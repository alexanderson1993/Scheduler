Meteor.methods({
	missionRequest:function(options){
		//Check Options
		check(options.name, String);
		check(options.email, String);
		check(options.flightType, String);
		check(options.missionTime, String);
		//Compose the email
		var emailObj = {
			subject:'Mission Time Request - ' + options.missionTime,
			image:Meteor.absoluteUrl + 'icon.png',
			title:options.name + " has requested a specific mission time.",
			content:'<ul><li>Name: ' + options.name + "</li>" +
			'<li>Email: <a href="mailto:' + options.email + '">' + options.email + "</a></li>" +
			'<li>Flight Type: ' + options.flightType + '</li>' +
			'<li>Requested Time: ' + options.missionTime + '</li>' +
			'<li>Notes: ' + options.notes + '</li></ul>' +
			'<p>Please check the schedule and then contact this customer as soon as possible.</p>',
			email: Meteor.settings.email.notifyto, //TODO: Get this being sent to anyone with Victor role
			domain:Meteor.absoluteUrl()
		};
		emailObj = {
			from: Meteor.settings.email.from,
			to: emailObj.email,
			subject: emailObj.subject,
			html: Handlebars.templates.basic(emailObj)
		};
		Email.send(emailObj);
		return true;
	}
});
