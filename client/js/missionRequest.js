Template.missionRequest.helpers({
	missionRequestDoc:function(){
		return {
			name:Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName,
			email:Meteor.user().profile.email,
			flightType:FlightType.findOne(Session.get('pendingBooking').flightType).name
		};
	},
	schema:function(){
		return Schemas.MissionRequest;
	}
});

Template.missionRequest.events({
	'click [type="button"]':function(e,c){
		var obj = {
			user:Meteor.user(),
			name:Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName,
			email:Meteor.user().profile.email,
			flightTypeId:Session.get('pendingBooking').flightType,
			flightType:FlightType.findOne(Session.get('pendingBooking').flightType).name,
			missionTime:c.find('[name="missionTime"]').value,
			notes:c.find('[name="notes"]').value,
		};
		e.preventDefault();
		Meteor.call('missionRequest',obj,function(err){
			if (err){
				sAlert.error('Error: ' + err);
			}
			sAlert.info('Your request has been sent. You will be contacted shortly.');
			Router.go('/');
		});
	}
});
