Meteor.publish('users', function(userId){
	if (Roles.userIsInRole(userId, ['admin', 'manage-users','flight-director'])){
		return Meteor.users.find();
	} else {
		return Meteor.users.find({_id:userId});
	}
});

Meteor.publish('flightDirectors', function(userId){
	if (userId){ // Indicates a logged-in user
		return Meteor.users.find({'roles':{$elemMatch:{$eq:'flight-director'}}});
	}
});

Meteor.publish('schedule', function(){
	return Schedule.find();
});

Meteor.publish('flight', function(userId){
	var output;
	if (Roles.userIsInRole(userId, ['admin', 'manage-users'])){
		output = Flight.find();
	} else {
		output = Flight.find({$or:[{user:userId}, {flightDirector:userId}]});
	}
	return output;
});

Meteor.publish(null, function(){
	return [FlightType.find(), Pictures.find()];
});
