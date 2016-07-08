Template.academy_application.helpers({
	academyCollection:function(){
		return Collections.Academy;
	},
	profile:function(){
		return Meteor.user().profile;
	}
});

Template.academy_application.events({
	'click .submit':function(e,t){
		var pictureId = Pictures.insert(t.find('[data-cfs-collection="pictures"]').files[0])._id;
		var gradesId = GradesFiles.insert(t.find('[data-cfs-collection="gradesFiles"]').files[0])._id;
		var obj = {
			birthdate:t.find('[name="birthdate"]').value,
			phone:t.find('[name="phone"]').value,
			school:t.find('[name="school"]').value,
			grade:t.find('[name="grade"]').value,
			extra:t.find('[name="extra"]').value,
			bio:t.find('[name="bio"]').value,
			endorsement:t.find('[name="endorsement"]').value,
			picture:pictureId,
			grades:gradesId
		};
		debugger;
		Application.insert(obj);
		Meteor.setTimeout(function(){
			sAlert.info('Your application has been submitted. You will be contacted shortly.');
		},100);
		Router.go('/');
	}
});
