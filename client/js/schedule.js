var userColors = {};
function events(start, end, timezone, callback){
	var output = [];
	var user;
	Schedule.find().forEach(function(e){
		e.start = moment(e.start);
		e.end = moment(e.end);
		user = Meteor.users.findOne({_id:e.user});
		if (user){
			if (user.profile){
				if (user.profile.firstName){
					e.title = e.title + " - " + user.profile.firstName + " " +
					user.profile.lastName.substr(0, 1);
				}
				if (!user.profile.color){
					user.profile.color = Please.make_color();
					Meteor.users.update({_id:user._id},{$set:{profile:user.profile}});
				}
				e.color = user.profile.color;
			}
		}
		output.push(e);
	});
	callback(output);
}
Template.schedule.helpers({
	options:function() {
		return {
			defaultView:'agendaWeek',
			id:'calendar',
			timezone:'MST',
			editable:true,
			events:events,
			height: document.height - document.height/10,
			allDaySlot:false,
			minTime:"06:00:00",
			maxTime:"23:00:00",
			slotDuration:"00:30:00",
			selectable:true,
			selectHelper:true,
			select:function(start, end){
				if (Meteor.userId()){
					//Add the necessary time to translate
					//Timezones
					var obj = {
						start:start.add(7,'h').toISOString(),
						end:end.add(7,'h').toISOString(),
						user:Meteor.userId(),
					};
					Schedule.insert(obj);
				}
				this.unselect();
			},
			eventResize:function(event, delta, revertFunc) {
				var obj = {
					start:event.start.add(7,'h').toString(),
					end:event.end.add(7,'h').toString(),
				};
				Schedule.update({_id:event._id}, {$set:obj});
			},
			eventDrop:function(event, delta, revertFunc) {
				var obj = {
					start:event.start.add(7,'h').toString(),
					end:event.end.add(7,'h').toString(),
				};
				Schedule.update({_id:event._id}, {$set:obj});
			}
		};
	}
});
Template.schedule.created = function(){
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
Template.schedule.destroyed = function(){
	this.observeSchedule.stop();
};


