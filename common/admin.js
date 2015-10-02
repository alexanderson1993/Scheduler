var victorRole = new Roles.Role('victor');
var flightDirector = new Roles.Role('flight-director');
var userRole = new Roles.Role('user');
orion.pages.addTemplate({
	template:'pageTemplate',
	layout:'main_layout',
	name:'Simple Template',
	description:'Just include some HTML, and it will be rendered'
},
{
	content : orion.attribute('summernote', {
      label: 'Description'
  }),
});

ReactiveTemplates.set('myAccount.index', 'accountIndex');
ReactiveTemplates.set('collections.dictionaryo.create', 'collectionCreate');
ReactiveTemplates.set('collections.links.create', 'collectionCreate');
ReactiveTemplates.set('collections.flighttype.create', 'collectionCreate');
ReactiveTemplates.set('collections.dictionaryo.update', 'collectionUpdate');
ReactiveTemplates.set('collections.links.update', 'collectionUpdate');
ReactiveTemplates.set('collections.flighttype.update', 'collectionUpdate');
ReactiveTemplates.set('collections.mission.create', 'collectionCreate');
ReactiveTemplates.set('collections.mission.update', 'collectionUpdate');
ReactiveTemplates.set('collections.product.create', 'collectionCreate');
ReactiveTemplates.set('collections.product.update', 'collectionUpdate');
ReactiveTemplates.set('collections.faq.create', 'collectionCreate');
ReactiveTemplates.set('collections.faq.update', 'collectionUpdate');
ReactiveTemplates.set('collections.simulator.create', 'collectionCreate');
ReactiveTemplates.set('collections.simulator.update', 'collectionUpdate');
ReactiveTemplates.set('collections.flight.create', 'collectionCreate');
ReactiveTemplates.set('collections.flight.update', 'collectionUpdate');
Meteor.settings.contactForm = {
	emailTo:'alex@infinitedev.com'
};
