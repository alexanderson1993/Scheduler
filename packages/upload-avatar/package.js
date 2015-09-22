Package.describe({
    summary: "simple upload avatar package for meteor",
    version: "1.1.0",
    name: "upload-avatar",
});

// meteor test-packages ./
var both = ['client', 'server'];
var client = ['client'];
var server = ['server'];

Package.on_use(function (api) {

    api.use(['underscore', 'accounts-base', 'accounts-password'], both);
    api.use(['jquery', 'templating', 'twbs:bootstrap', 'less'], client);

    api.add_files([
        'avatar.html', 'avatar.js', 'style.less'
    ], client);
    if (typeof api.export !== 'undefined') {
        //api.export('DEBUGX', both);
    }
});
