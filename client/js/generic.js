Template.registerHelper("dicto", function (key) {
	if (Dictionary.findOne({title:key})){
		return Dictionary.findOne({title:key}).content;
	}
});
Meteor.startup(function(){
	Meteor.subscribe('pages');
	GoogleMaps.load();
});
Template.missions.helpers({
	mission:function(){
		return Mission.find();
	}
})
Template.faq.helpers({
	faq:function(){
		return Faq.find();
	}
})
