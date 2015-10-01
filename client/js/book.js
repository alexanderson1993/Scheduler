Template.book.helpers({
	currentTemplate:function(){
		var output;
		var pendingBooking = Session.get('pendingBooking');
		if (typeof pendingBooking === 'undefined'){
			pendingBooking = {};
		}
		if (pendingBooking.start){
			return 'missionPayment';
		} else if (pendingBooking.flightType){
			return 'missionTimeChoice';
		} else {
			return 'flightTypeChoice';
		}
	}
});
Template.flightTypeChoice.helpers({
	flightType:function(){
		return FlightType.find();
	}
});
Template.flightTypeChoice.events({
	'click .thumbnail':function(){
		var obj = {
			flightType:this._id
		};
		Session.set('pendingBooking', obj);
	},
});
Template.missionTimeChoice.events({
	'click .back':function(){
		Session.set('pendingBooking', {});
	}
});
Template.missionTimeChoice.helpers({
	name:function(){
		if (FlightType.findOne({_id:this.flightType})){
			return FlightType.findOne({_id:this.flightType}).name;
		}
	},
	options:function() {
		return {
			defaultView:'basicWeek',
			id:'calendar',
			timezone:'UTC',
			editable:false,
			events:events,
			height:document.height - document.height / 10,
			eventClick:function(event){
				var obj = Session.get('pendingBooking');
				if (event.start._d < Date()){
					return false;
				}
				obj.start = event.start._d;
				obj.end = event.end._d;
				Session.set('pendingBooking',obj);
			},
			eventMouseover:function( event, jsEvent, view ){
			},
			eventMouseout:function(){

			}
		};
	}
});

function events(start, end, timezone, callback){
	var output = [];
	var i;
	var flightType = FlightType.findOne(Session.get('pendingBooking').flightType);
	var victorDays = Schedule.find({
		start:{$lt:end._d},
		end:{$gt:start._d}
	}).fetch().filter(function(e){
		if (Roles.userHasRole(e.user, 'victor')){
			return moment.duration(e.end - e.start).asMinutes() >= flightType.length;
		}
	});
	victorDays.forEach(function(e){
		for (i = 0;
			i <= Math.ceil(moment.duration(moment(e.end).subtract(flightType.length,'minutes')._d - e.start).asMinutes() / 30);
			i++){
			output.push({
				start:moment(e.start).add(i * 30, 'minutes'),
				end:moment(e.start).add(i * 30, 'minutes').add(flightType.length, 'minutes'),
				title:"Available\n" + flightType.name
			});
	}
});
	callback(output);
}
Template.missionTimeChoice.created = function(){
	this.observeSchedule = Schedule.find().observe({
		added:function(){
			$('#calendar').fullCalendar('refetchEvents');
		},
		changed:function(){
			$('#calendar').fullCalendar('refetchEvents');
		},
		removed:function(){
			$('#calendar').fullCalendar('refetchEvents');
		}
	});
};
Template.missionTimeChoice.destroyed = function(){
	this.observeSchedule.stop();
};
Template.missionPayment.events({
	'click .back':function(){
		var obj = Session.get('pendingBooking')
		Session.set('pendingBooking', {flightType:obj.flightType});
	}
});
