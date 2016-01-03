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
			timezone:'MST',
			editable:false,
			events:events,
			height:document.height - document.height / 30,
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
		var obj = {};
		for (i = 0; i <= Math.ceil(moment.duration(moment(e.end).subtract(flightType.length, 'minutes')._d - e.start).asMinutes() / 30); i++){
			obj = {
				start:moment(e.start).add(i * 30, 'minutes'),
				end:moment(e.start).add(i * 30, 'minutes').add(flightType.length, 'minutes'),
				title:"Available\n" + flightType.name
			}
			if (Flight.find({
				start:{$lt:obj.end._d},
				end:{$gt:obj.start._d}
			}).count() <= 0){
				output.push(obj);
			}
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
Template.missionPayment.helpers({
	type:function(){
		if (FlightType.findOne(this.flightType)){
			return FlightType.findOne(this.flightType).name;
		}
	},
	start:function(){
		return moment(this.start).format('MMMM Do YYYY, h:mmA');
	},
	end:function(){
		return moment(this.end).format('MMMM Do YYYY, h:mmA');
	},
	paymentErrors:function(){
		return Session.get('paymentErrors');
	}
});


Template.missionPayment.events({
	'click .back':function(){
		var obj = Session.get('pendingBooking')
		Session.set('pendingBooking', {flightType:obj.flightType});
	},
	'blur input':function(e){
		var tf = true;
		if (e.target.name === 'number'){
			tf = e.target.classList.contains('card-valid');
		}
		if (e.target.value === ''){
			tf = false;
		}
		if (!tf){
			e.target.classList.add('has-error');
		} else {
			e.target.classList.remove('has-error');
		}
	},
	'click .submit-button':function(e,t){
		var d;
		var objId;
		var tf = true;
		//Do some form validation
		$('input').each(function(i,e){
			if (e.name === 'number'){
				tf = e.classList.contains('card-valid');
			}
			if (e.value === ''){
				tf = false;
			}
		});
		if (!tf){
			return false;
		}
		$('.modal').modal();
		// GAnalytics.event("pledge","Pledge Made");
		d = {
			'card_number':t.find('input[name="number"]').value.replace(/ /g, ''),
			'card_month':parseInt(t.find('input[name="expiry"]', 10).value.split(' / ')[0]).toString(10),
			'card_year':'20' + t.find('input[name="expiry"]').value.split(' / ')[1],
			'card_cvc':t.find('input[name="cvc"]').value,
			'card_name':t.find('input[name="card_firstName"]').value + ' ' + t.find('input[name="card_lastName"]').value,
			'amount':(Session.get('bookingPrice')) * 100,
			'currency':'USD',
		};
		var obj = {
			start:Session.get('pendingBooking').start,
			end:Session.get('pendingBooking').end,
			flightType:Session.get('pendingBooking').flightType,
			notes:t.find('textarea[name="notes"]').value,
			user:Meteor.userId()
		}
		objId = Flight.insert(obj);

		Meteor.call('charge_create', d.amount, d.currency, d.card_number, d.card_month, d.card_year, d.card_cvc, d.card_name, Meteor.user(),obj,
			function(error, result){
				var txnId;
				if (error) {
					// Deal with Error
					console.log(error);
				} else {
					if (result.rawType === 'card_error') {
						$('.modal').modal('hide');
						Session.set('paymentErrors',[result.message]);
					} else {
						Session.set('paymentErrors',[]);
						Session.set('pendingBooking',{});
						txnId = Transactions.insert({
							entity_id:objId,
							stripe_obj:result,
							charge_id:result.id
						});
						Meteor.setTimeout(function(){
							Router.go('/');
							$('.modal').modal('hide');
						}, 500);
					}
				}
			});
	}
});
