Meteor.startup(function() {
	var id;
	if (typeof Meteor.users.findOne({username:'admin'}) === 'undefined'){
		id = Accounts.createUser({
			username:'admin',
			email:'alex@infinitedev.com',
			password:'voyager1'
		});
		Roles.addUsersToRoles(id, ['admin']);
	}
});

Accounts.onCreateUser(function(options, user) {
	//Construct the profile
	//Start with Google
	var profile = {};
	if (user.services){
		if (user.services.google){
			var data = user.services.google;
			profile.firstname = data.given_name;
			profile.lastname = data.family_name;
			profile.picture = data.picture;
			profile.email = data.email;
		} else if (user.services.facebook){
			var data = user.services.facebook;
			profile.firstname = data.first_name;
			profile.lastname = data.last_name;
			var picture = HTTP.get('https://graph.facebook.com/v2.4/me/picture?type=large&redirect=false&access_token=' + data.accessToken);
			console.log(picture);
			profile.picture = picture.data.data.url;
			profile.email = data.email;
		} else {
			// If they signed up using a password, make them
			// Update their profile from the get-go.

		}
		user.profile = profile;
	}
	return user;
});
