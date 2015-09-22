if (Meteor.isClient) {


	Template.user_profile.helpers({
		selectedPersonDoc: function () {
			if (typeof Meteor.user() !== 'undefined')
				return Meteor.user().profile;
		},
		formType: function () {
		//	if (Meteor.userId()) {
			//	return "update";
			//} else {
				return "disabled";
		//	}
	},
	userPicture: function(){
		var user = Meteor.user();
		if (!user)
			return '';

		if (user.profile && user.profile.picture)
			return user.profile.picture;
			//return picture.findOne(user.profile.picture).url();
		else
			return "/avatar.jpeg";

		return '';
	},
	profile: function(){
		return Meteor.user().profile;
	},
	schema:function(){
		return Schemas.Profile;
	}
});
	Template.user_profile.events({
		'click #updateProfile': function(e,t){
			var obj = Meteor.user().profile || {};

			obj.firstName = t.find('input[name="firstName"]').value;
			obj.lastName = t.find('input[name="lastName"]').value;
			obj.name = obj.firstName + " " + obj.lastName;
			obj.email = t.find('input[name="email"]').value;
			obj.birthdate = t.find('input[name="birthdate"]').value;

			//User Fixtures
			obj.team = obj.team || null;
			obj.rank = obj.rank || 1;
			obj.points = obj.points || 0;
			obj.votes = obj.votes || 0;
			obj.cardNumber = obj.cardNumber || null;

			var user = Meteor.users.update(Meteor.userId(),{$set:{profile:obj}});
		},
		'click .profileOverlay':function(){
			$('.modal').modal();
		}
	})
}
