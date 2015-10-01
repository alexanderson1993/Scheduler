Package.describe({
	summary: "Stripe.js convenience methods",
	version: "1.0.0",
	name: "infinitedg:stripe",
	git: "https://github.com/infinitedev/meteor-stripe.git"
});

Npm.depends({ "stripe": "3.0.3", "fibers":"1.0.5" });

Package.onUse(function (api) {
	// api.use('mrgalaxy:stripe');
	api.addFiles('server.js', 'server');
});
