Schemas = {};
Collections = {};

Users = Collections.Users = Meteor.users;
Transactions = Collections.Transactions = new Mongo.Collection('transactions');
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
Mission = Collections.Mission = new orion.collection('mission',{
	singularName:'mission',
	pluralName:'missions',
	title:'Missions',
	link:{
		title:'Missions'
	},
	tabular: {
		columns: [
		{ data: "name", title: "name" }
		]
	}
});
Flight = Collections.Flight = new orion.collection('flight', {
	singularName:'flight',
	pluralName:'flights',
	link:{
		title:'Flights'
	},
	tabular: {
		columns: [
		{ data: "start", title: "Start" },
		{ data: "end", title: "End" }

		]
	}
});
FlightType = Collections.FlightType = new orion.collection('flighttype',{
	singularName:'flight type',
	pluralName:'flight types',
	link:{
		title:'Flight Type'
	},
	tabular: {
		columns: [
		{ data: "name", title: "Name" }
		]
	}
});
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
Product = Collections.Product = new orion.collection('product',{
	singularName:'product',
	pluralName:'products',
	link:{
		title:'Products'
	},
	tabular: {
		columns: [
		{ data: "name", title: "Name" }
		]
	}
});
Faq = Collections.Faq = new orion.collection('faq',{
	singularName:'faq',
	pluralName:'faqs',
	link:{
		title:'Faqs'
	},
	tabular: {
		columns: [
		{ data: "title", title: "Title" }
		]
	}
});
Simulator = Collections.Simulator = new orion.collection('simulator',{
	singularName:'simulator',
	pluralName:'simulators',
	link:{
		title:'Simulators'
	},
	tabular: {
		columns: [
		{ data: "name", title: "Name" }
		]
	}
});
MissionRequest = Collections.MissionRequest = new orion.collection('missionrequest',{
	singularName:'mission request',
	pluralName:'mission requests',
	link:{
		title:'Mission Requests'
	},
	tabular: {
		columns: [
		{ data: "name", title: "Name" },
		{ data: "misionTime", title: "Date" }
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
	stores:[pictureStore],
	filter:{
		allow:{
            contentTypes:['image/*'] // allow only images in this FS.Collection
        }
    }
});

MissionPictures = Collections.MissionPictures = new FS.Collection('missionPictures',{
	stores:[pictureStore],
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
	name:{
		type:String
	},
	firstName:{
		type:String
	},
	lastName:{
		type:String
	},
	email:{
		type:String,
		regEx:SimpleSchema.RegEx.Email
	},
	picture:{
		type:String,
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
	start:{
		type:Date
	},
	end:{
		type:Date
	},
	notes:{
		type:String,
		optional:true
	},
	flightType:{
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
		optional:true,
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
	slug:{
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
		type:String,
		optional:true
	},
	parent:{
		type:String,
		optional:true,
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
	},
	tab: {
		type: Boolean,
		defaultValue: false,
		label: "Open in new tab"
	},
	role:{
		type:String,
		optional:true
	},
	order:{
		type:Number,
		autoValue:function() {
			if (this.isInsert) {
				return Links.find().count()+1;
			}
		},
	}
});

Schemas.Dictionary = new SimpleSchema({
	title:{
		type:String
	},
	content:orion.attribute('summernote', {
		label: 'Content'
	})
});

Schemas.Mission = new SimpleSchema({
	name:{
		type:String
	},
	picture:{
		type:String,
		optional:true,
	},
	description: orion.attribute('summernote', {
		label: 'Description'
	}),
});

Schemas.Product = new SimpleSchema({
	name:{
		type:String,
		max:60
	},
	description:{
		type:String,
		autoform:{
			rows:5
		}
	},
	price:{
		type:Number,
		min:1
	},
	picture:{
		type:String,
		optional:true
	},
});

Schemas.Faqs = new SimpleSchema({
	title:{
		type:String,
		max:60
	},
	content:orion.attribute('summernote', {
		label:'Content'
	})
});

Schemas.Simulator = new SimpleSchema({
	name:{
		type:String,
		max:60
	},
	description:orion.attribute('summernote', {
		label:'Description'
	}),
	picture:{
		type:String,
		optional:true
	},
	minCrew:{
		type:Number,
		min:1
	},
	maxCrew:{
		type:Number,
		min:1
	},
	positions: {
		type: Array,
		optional: true,
		minCount: 0,
	},
	"positions.$": {
		type: Object
	},
	"positions.$.name": {
		type: String
	},
	"positions.$.description":{
		type:String,
		optional:true
	},
	"positions.$.quantity": {
		type: Number,
		optional:true
	},
	"positions.$.difficulty":{
		type: Number,
		min:1,
		max:5,
		optional:true
	},
	"positions.$.responsibilities":{
		type:Array,
		optional:true
	},
	"positions.$.responsibilities.$": {
		type: String
	}
});
Schemas.MissionRequest = new SimpleSchema({
	name:{
		type:String,
		autoform:{
			readonly:true
		}
	},
	email:{
		type:String,
		regEx:SimpleSchema.RegEx.Email,
		autoform:{
			readonly:true
		}
	},
	flightType:{
		type:String,
		autoform:{
			readonly:true
		}
	},
	missionTime:{
		type:Date,
		autoform:{
			afFieldInput: {
				type:'bootstrap-datetimepicker',
			}
		},
	},
	notes:{
		type:String,
		autoform:{
			rows:5
		},
		optional:true
	}
});

Collections.Schedule.attachSchema(Schemas.Schedule);
Collections.Flight.attachSchema(Schemas.Flight);
Collections.FlightType.attachSchema(Schemas.FlightType);
Collections.Dictionary.attachSchema(Schemas.Dictionary);
Collections.Links.attachSchema(Schemas.Links);
Collections.Mission.attachSchema(Schemas.Mission);
Collections.Product.attachSchema(Schemas.Product);
Collections.Faq.attachSchema(Schemas.Faqs);
Collections.Simulator.attachSchema(Schemas.Simulator);
Collections.MissionRequest.attachSchema(Schemas.MissionRequest)
Schedule.helpers({
	forbiddenFields: function () {
		return false;
	}
});
if (Meteor.isClient){
	Template.registerHelper("Schemas", Schemas);
	Template.registerHelper("Collections", Collections);
}
