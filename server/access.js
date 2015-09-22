Pictures.allow({
	insert:function(){
		return true;
	},
	update:function(){
		return true;
	},
	remove:function(){
		return false;
	}
});

Users.allow({
	insert:function(userId, doc){
		// No creation of users with roles automatically assigned.
		if (doc.roles){
			return false;
		}
	},
	update:function(userId, doc){
		if (userId !== doc._id){
			if (!Roles.userIsInRole(userId, ['admin'])){
				return false;
			}
		}
	}
});

// Only Flight Directors (and admins) can change schedules.
Schedule.allow({
	insert:function(userId){
		if (!Roles.userIsInRole(userId, ['admin', 'flight-director'])){
			return false;
		}
	},
	update:function(userId, doc){
		if (!Roles.userIsInRole(userId, ['admin'])){
			if (userId !== doc.user){
				return false;
			}
		}
	},
	remove:function(userId, doc){
		if (!Roles.userIsInRole(userId, ['admin'])){
			if (userId !== doc.user){
				return false;
			}
		}
	},
});

// Logged in users can create, only assigned users and FDs can modify
Flight.allow({
	insert:function(userId){
		if (!userId){
			return false;
		}
	},
	update:function(userId, doc){
		if (!Roles.userIsInRole(userId, ['admin'])){
			if (userId !== doc.flightDirector){
				if (userId !== doc.user){
					return false;
				}
			}
		}
	},
	remove:function(userId, doc){
		if (!Roles.userIsInRole(userId, ['admin'])){
			if (userId !== doc.flightDirector){
				if (userId !== doc.user){
					return false;
				}
			}
		}
	}
});

// Only allow admins to change the flight types
FlightType.allow({
	insert:function(userId){
		if (!Roles.userIsInRole(userId, ['admin'])){
			return false;
		}
	},
	update:function(userId){
		if (!Roles.userIsInRole(userId, ['admin'])){
			return false;
		}
	},
	remove:function(userId){
		if (!Roles.userIsInRole(userId, ['admin'])){
			return false;
		}
	}
});
