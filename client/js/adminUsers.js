Template.admin_user_profile.helpers({
	schema:function(){
		return Schemas.Profile;
	}
});

Template.admin_users.helpers({
	user:function(){
		return Meteor.users.find();
	}
})
