Template.user_profile.helpers({
	selectedPersonDoc:function() {
		if (typeof Meteor.user() !== 'undefined'){
			console.log(Meteor.user().profile);
			return Meteor.user().profile;
		}
	},
	formType: function() {
		//	if (Meteor.userId()) {
			//	return "update";
			//} else {
				return "disabled";
		//	}
	},
	userPicture:function(){
		var user = Meteor.user();
		if (!user){
			return '';
		}
		if (user.profile && user.profile.picture){
			return user.profile.picture;
		} else{
			return 'http://placehold.it/500?text=No+Picture';
		}
		return '';
	},
	profile:function(){
		return Meteor.user().profile;
	},
	schema:function(){
		return new SimpleSchema({
			firstName:{
				type:String
			},
			lastName:{
				type:String
			},
			email:{
				type:String,
				regEx:SimpleSchema.RegEx.Email
			},
			phoneNumber:{
				type:String,
				optional:true,
			},
			userSince:{ // Also used for tracking flight director time
				type:Date,
				autoform:{
					type:'bootstrap-datepicker',
					readonly:true
				},
				autoValue:function() {
					if (this.isInsert) {
						return new Date();
					}
				}
			},
			bio:{
				type:String,
				autoform:{
					rows:5
				},
				optional:true
			}
		});
	}
});
Template.user_profile.events({
	'change #file':function(e,t){
		var file;
		e.preventDefault();
		e.stopPropagation();
		file = e.target.files[0];
		Pictures.insert(file,function(err,img){
			var interval = Meteor.setInterval(function(){
				var url = (img.url());
				var userProfile = Meteor.user().profile;
				userProfile.picture = url;
				Meteor.users.update({_id:Meteor.userId()},{$set:{profile:userProfile}});
				Meteor.clearInterval(interval);
			}, 1000);
		});
	},
	'click #updateProfile':function(e,t){
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
