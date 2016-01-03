Meteor.startup(function() {
	var id;
	Options.set('defaultRoles', ['user']);
	if (typeof Meteor.users.findOne({username:'admin'}) === 'undefined'){
		id = Accounts.createUser({
			username:'admin',
			email:'alex@infinitedev.com',
			password:'voyager1'
		});
		Roles.addUserToRoles(id, ['admin']);
	}


});

Accounts.onCreateUser(function(options, user) {
	//Construct the profile
	//Start with Google
	var profile = {};
	if (user.services){
		if (user.services.google){
			var data = user.services.google;
			profile.firstName = data.given_name;
			profile.lastName = data.family_name;
			profile.name = data.given_name + ' ' + data.family_name;
			profile.picture = data.picture;
			profile.email = data.email;
		} else if (user.services.facebook){
			var data = user.services.facebook;
			profile.firstName = data.first_name;
			profile.lastName = data.last_name;
			profile.name = data.first_name + ' ' + data.last_name;
			var picture = HTTP.get('https://graph.facebook.com/v2.4/me/picture?type=large&redirect=false&access_token=' + data.accessToken);
			profile.picture = picture.data.data.url;
			profile.email = data.email;
		} else {
			// If they signed up using a password, make them
			// Update their profile from the get-go.

		}
		user.profile = profile;
	}
	console.log(user);
	return user;
});
