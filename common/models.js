Schemas = {};
Collections = {};

Users = Collections.Users = Meteor.users;
Schedule = Collections.Schedule = new Mongo.Collection('schedule');
Flight = Collections.Flight = new Mongo.Collection('flight');
FlightType = Collections.FlightType = new Mongo.Collection('flighttype');
pictureStore = new FS.Store.GridFS('profile-pictures', {
	chunkSize:1024 * 1024,
});

var imageStore = new FS.Store.FileSystem("images", {
  path: "~/app-files/images", //optional, default is "/cfs/files" path within app container
  maxTries: 1 //optional, default 5
});

Pictures = Collections.Pictures = new FS.Collection('profile-pictures', {
	stores:[imageStore],
	filter:{
		allow:{
            contentTypes:['image/*'] // allow only images in this FS.Collection
        }
    }
});

// This users schema is just for autoform, not for attaching
// To the collection.
Schemas.Profile = new SimpleSchema({
	firstname:{
		type:String
	},
	lastname:{
		type:String
	},
	email:{
		type:String,
		regEx:SimpleSchema.RegEx.Email
	},
	picture:{
		type:String,
		regEx:SimpleSchema.RegEx.Url
	},
	userSince:{ // Also used for tracking flight director time
		type:Date,
		autoform:{
			type:'bootstrap-datetimepicker'
		},
		autoValue:function() {
			if (this.isInsert) {
				return new Date();
			}
		}
	},
	phoneNumber:{
		type:Number,
		optional: true
	},
	discountRate:{
		type:Number,
		optional:true
	},
	hoursWorkes:{
		type:Number,
		optional:true
	},
});

Schemas.Schedule = new SimpleSchema({
	starttime:{
		type:Date,
		autoform:{
			afFieldInput:{
				type:'bootstrap-datetimepicker'
			}
		}
	},
	endtime:{
		type:Date,
		autoform:{
			afFieldInput:{
				type:'bootstrap-datetimepicker'
			}
		}
	},
	user:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoValue:function() {
			if (this.isInsert) {
				return Meteor.userId();
			}
		},
		autoform:{
			options:function() {
				return _.map(Meteor.users.find().fetch(), function(user) {
					return {
						label:user.emails[0].address,
						value:user._id
					};
				});
			}
		}
	},
	notes:{
		type:String,
		optional:true
	}
});

Schemas.Flight = new SimpleSchema({
	starttime:{
		type:Date
	},
	type:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoform:{
			options:function() {
				return _.map(FlightType.find().fetch(), function(type) {
					return {
						label:type.name,
						value:type._id
					};
				});
			}
		}
	},
	flightDirector:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoform:{
			options:function() {
				return _.map(Meteor.users.find({'roles':{$elemMatch:{$eq:'flight-director'}}}).fetch(), function(user) {
					return {
						label:user.emails[0].address,
						value:user._id
					};
				});
			}
		}
	},
	user:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoValue:function() {
			if (this.isInsert) {
				return Meteor.userId();
			}
		},
		autoform:{
			options:function() {
				return _.map(Meteor.users.find().fetch(), function(user) {
					return {
						label:user.emails[0].address,
						value:user._id
					};
				});
			}
		}
	},
});

Schemas.FlightType = new SimpleSchema({
	length:{
		type:Number,
		label:'Time Length (in minutes)'
	},
	name:{
		type:String
	},
	price:{
		type:Number
	}
});

Collections.Schedule.attachSchema(Schemas.Schedule);
Collections.Flight.attachSchema(Schemas.Flight);
Collections.FlightType.attachSchema(Schemas.FlightType);
