Meteor.publish('users', function(userId){
	if (Roles.userHasRole(userId, 'admin')){
		return Meteor.users.find();
	}
	if (Roles.userHasRole(userId,'flight-director')){
		return Meteor.users.find();
	} else {
		return Meteor.users.find({_id:userId},{fields: {
			firstname:1,
			lastname:1,
			email:1,
			emails:1,
			picture:1,
			userSince:1,
			phoneNumber:1,
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

Meteor.publish(null,function(){
	return [Dictionary.find(),Links.find()];
});
Meteor.publish('schedule', function(){
	return Schedule.find();
});
Meteor.publish('mission',function(){
	return Mission.find();
});
Meteor.publish('product',function(){
	return Product.find();
});
Meteor.publish('faq',function(){
	return Faq.find();
});
Meteor.publish('flight', function(userId){
	var output;
	if (Roles.userHasRole(userId, 'admin')){
		output = Flight.find();
	} else {
		output = Flight.find({$or:[{user:userId}, {flightDirector:userId}]});
	}
	return output;
});
Meteor.publish('flighttype',function(){
	return FlightType.find();
})
Meteor.publish(null, function(){
	return [FlightType.find(), Pictures.find()];
});
