Template.registerHelper("dicto", function (key) {
	if (Dictionary.findOne({title:key})){
		return Dictionary.findOne({title:key}).content;
	}
});
