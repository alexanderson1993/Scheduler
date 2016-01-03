Template.flights.helpers({
	flight:function(){
		return Flight.find();
	},
	customerName:function(){
		Meteor.subscribe('user',this.user,Meteor.userId());
		if (Meteor.users.findOne({_id:this.user})){
			return Meteor.users.findOne({_id:this.user}).profile.name;
		}
	},
	missionType:function(){
		return FlightType.findOne({_id:this.flightType}).name;
	},
	missionTime:function(){
		return moment(this.start).format('M/D/YY h:mm A') + " - " + moment(this.end).format('h:mm A');
	},
	flightDirectors:function(){
		var output = [];
		Roles._collection.find({roles:'flight-director'}).forEach(function(e){
			output.push(e.userId);
			Meteor.subscribe('user',e.userId,Meteor.userId());
		});
		return Meteor.users.find({_id:{$in:output}});
	},
	selected:function(_id){
		if (this._id === _id){
			return 'selected';
		}
	}
});

Template.flights.events({
	'change .flightDirector':function(e){
		Flight.update({_id:this._id},{$set:{flightDirector:e.target.value}});
	}
});
