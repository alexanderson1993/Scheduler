// Options
AccountsTemplates.configure({
    // defaultLayout: 'emptyLayout',
    showForgotPasswordLink:true,
    overrideLoginErrors:false,
    enablePasswordChange:true,
    sendVerificationEmail:false,

    // enforceEmailVerification: true,
    confirmPassword:true,
    continuousValidation:false,
    forbidClientAccountCreation: false,
    // formValidationFeedback: true,
    // homeRoutePath: '/',
    showAddRemoveServices:true,
    showPlaceholders: true,

    negativeValidation:true,
    positiveValidation:true,
    negativeFeedback:false,
    positiveFeedback:true,

    // Privacy Policy and Terms of Use
    // privacyUrl: 'privacy',
    // termsUrl: 'terms-of-use',
    onSubmitHook:function(error, state){
        if (!error) {
            if (Session.get('redirectURL')){
               // GAnalytics.event("account","Sign In");
               Router.go(Session.get('redirectURL'));
               Session.set('redirectURL', null);
           } else {
            Router.go('/');
        }
    }
}
});
/*
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
*/

AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
{
	_id:'username',
	type:'text',
	displayName:'username',
	required:true,
	minLength:3,
},
{
	_id:'email',
	type:'email',
	required:true,
	displayName:'email',
	re:/.+@(.+){2,}\.(.+){2,}/,
	errStr:'Invalid email',
}
]);
AccountsTemplates.removeField('password');
AccountsTemplates.addField({
	_id:'password',
	type:'password',
	required:true,
	minLength:6,
});

// Running it in Meteor.startup is only necessary because Telescope
// defines the route at startup
Meteor.startup(function () {
  // OR find a route by path
  var route = RouterLayer.ironRouter.findFirstRoute('/admin/my-account');
  // Override existing route options
  _.extend(route.options, {
    template:'accountIndex'
});
   sAlert.config({
        effect: 'stackslide',
        position: 'top-left',
        timeout: 5000,
        html: true,
    });
});
