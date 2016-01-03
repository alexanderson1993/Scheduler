Meteor.publish('users', function(userId){
	if (Roles.userHasRole(userId, 'admin')){
		return Meteor.users.find();
	}
	if (Roles.userHasRole(userId,'flight-director')){
		return Meteor.users.find();
	} else {
		return Meteor.users.find({_id:userId},{fields: {
			discountRate:0,
			hoursWorked:0
		}});
	}
});
/*
Meteor.publish('flightDirectors', function(userId){
	if (userId){ // Indicates a logged-in user
		return Meteor.users.find({'roles':{$elemMatch:{$eq:'flight-director'}}});
	}
});*/
Meteor.publish('user', function(userId, requeserId){
	if (Roles.userHasRole(requeserId, 'victor')){
		return Meteor.users.find({_id:userId});
	}
});
Meteor.publish(null,function(){
	return [Dictionary.find(), Links.find()];
});
Meteor.publish('victor_roles', function () {
	return Roles._collection.find({'roles':{$all:['victor']}});
});
Meteor.publish('fd_roles', function () {
	return Roles._collection.find({'roles':{$all:['flight-director']}});
});
Meteor.publish('schedule', function(userId){
	if (Roles.userHasRole(userId, 'victor')){
		return Schedule.find();
	} else {
		return Schedule.find({user:userId});
	}
});
Meteor.publish('scheduleUsers', function(userId){
	var output = [];
	if (Roles.userHasRole(userId, 'victor')){
		Roles._collection.find({roles:'flight-director'}).forEach(function(e){
			output.push(e.userId);
		});
		return Meteor.users.find({_id:{$in:output}});
	} else {
		return Meteor.users.find({_id:userId});
	}
});
Meteor.publish('mission', function(){
	return Mission.find();
});
Meteor.publish('product', function(){
	return Product.find();
});
Meteor.publish('faq', function(){
	return Faq.find();
});
Meteor.publish('flight', function(userId){
	var output;
	if (Roles.userHasRole(userId, 'admin')){
		output = Flight.find();
	} else if (Roles.userHasRole(userId, 'victor')){
		output = Flight.find({}, {fields:{user:1,flightType:1,start:1, end:1}});
	} else {
		output = Flight.find({}, {fields:{start:1, end:1}});
	}
	return output;
});
Meteor.publish('flighttype',function(){
	return FlightType.find();
})
Meteor.publish(null, function(){
	return [FlightType.find(), Pictures.find()];
});
