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
			if (!Roles.userHasRole(userId, 'admin')){
				return false;
			}
		}
	}
});

Transactions.allow({
	insert:function(userId){
		if (userId){
			return true;
		}
	}
})
// Only Flight Directors (and admins) can change schedules.
Schedule.allow({
	insert:function(userId){
		if (Roles.userHasRole(userId, 'admin') || Roles.userHasRole(userId, 'flight-director') ){
			return true;
		}
	},
	update:function(userId, doc){
		if (userId == doc.user || (Roles.userHasRole(userId, 'admin'))){
			return true;
		}
	},
	remove:function(userId, doc){
		if (Roles.userHasRole(userId, 'admin')){
			if (userId !== doc.user){
				return true;
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
		if (!Roles.userHasRole(userId, 'admin')){
			if (userId !== doc.flightDirector){
				if (userId !== doc.user){
					return false;
				}
			}
		}
	},
	remove:function(userId, doc){
		if (!Roles.userHasRole(userId, 'admin')){
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
		if (!Roles.userHasRole(userId, 'admin')){
			return false;
		}
	},
	update:function(userId){
		if (!Roles.userHasRole(userId, 'admin')){
			return false;
		}
	},
	remove:function(userId){
		if (!Roles.userHasRole(userId, 'admin')){
			return false;
		}
	}
});
