Schemas = {};
Collections = {};

Users = Collections.Users = Meteor.users;
Schedule = Collections.Schedule = new orion.collection('schedule',{
	singularName:'schedule',
	pluralName:'schedules',
	title:'Schedules',
	link:{
		title:'Schedules'
	},
	tabular: {
		columns: [
		{ data: "title", title: "Title" }
		]
	}
});
Flight = Collections.Flight = new Mongo.Collection('flight');
FlightType = Collections.FlightType = new Mongo.Collection('flighttype');
Links = Collections.Links = new orion.collection('links',{
	singularName:'link',
	pluralName:'links',
	link:{
		title:'Links'
	},
	tabular: {
		columns: [
		{ data: "title", title: "Title" }
		]
	}
});
Dictionary = Collections.Dictionary = new orion.collection('dictionaryo',{
	singularName:'dictionary',
	pluralName:'dictionaries',
	link:{
		title:'Dictionary'
	},
	tabular: {
		columns: [
		{ data: "title", title: "Title" }
		]
	}
});
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
// Schemas.Profile = new SimpleSchema
Options.set('profileSchema',{
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
			type:'bootstrap-datepicker'
		},
		autoValue:function() {
			if (this.isInsert) {
				return new Date();
			}
		}
	},
	phoneNumber:{
		type:Number,
		optional:true
	},
	/*discountRate:{
		type:Number,
		optional:true
	},
	hoursWorked:{
		type:Number,
		optional:true
	},*/
});

Schemas.Schedule = new SimpleSchema({
	start:{
		type:Date,
		autoform:{
			afFieldInput:{
				type:'bootstrap-datepicker'
			}
		}
	},
	end:{
		type:Date,
		autoform:{
			afFieldInput:{
				type:'bootstrap-datepicker'
			}
		}
	},
	title:{
		type:String,
		autoValue:function() {
			if (this.isInsert) {
				return 'Available';
			}
		},
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

Schemas.Links = new SimpleSchema({
	title:{
		type:String
	},
	path:{
		type:String
	},
	parent:{
		type:String,
		regEx:SimpleSchema.RegEx.Id,
		autoform:{
			options:function() {
				return _.map(Links.find().fetch(), function(link) {
					return {
						label:link.title,
						value:link._id
					};
				});
			}
		}
	}
});

Schemas.Dictionary = new SimpleSchema({
	title:{
		type:String
	},
	content:{
		type:String,
		autoform:{
			rows:5
		}
	}
});

Collections.Schedule.attachSchema(Schemas.Schedule);
Collections.Flight.attachSchema(Schemas.Flight);
Collections.FlightType.attachSchema(Schemas.FlightType);
Collections.Dictionary.attachSchema(Schemas.Dictionary);
Collections.Links.attachSchema(Schemas.Links);
Schedule.helpers({
  forbiddenFields: function () {
    return false;
  }
});
