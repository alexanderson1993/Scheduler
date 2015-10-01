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
				if (user.profile.firstname){
					e.title = e.title + " - " + user.profile.firstname + " " +
					user.profile.lastname.substr(0, 1);
				}
			}
		}
		if (!userColors[e.user]){
			userColors[e.user] = Please.make_color();
		}
		e.color = userColors[e.user]
		output.push(e);
	});
	callback(output);
}
Template.schedule.helpers({
	options:function() {
		return {
			defaultView:'agendaWeek',
			id:'calendar',
			timezone:'UTC',
			editable:true,
			events:events,
			height: document.height - document.height/10,
			allDaySlot:false,
			minTime:"06:00:00",
			maxTime:"23:00:00",
			slotDuration:"00:15:00",
			selectable:true,
			selectHelper:true,
			select:function(start, end){
				if (Meteor.userId()){
					var obj = {
						start:start.toISOString(),
						end:end.toISOString(),
						user:Meteor.userId(),
					};
					Schedule.insert(obj);
				}
				this.unselect();
			},
			eventResize:function(event, delta, revertFunc) {
				var obj = {
					start:event.start.toString(),
					end:event.end.toString(),
				};
				Schedule.update({_id:event._id}, {$set:obj});
			},
			eventDrop:function(event, delta, revertFunc) {
				var obj = {
					start:event.start.toString(),
					end:event.end.toString(),
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


