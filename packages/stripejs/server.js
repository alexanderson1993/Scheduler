var StripeAPI = Npm.require('stripe');
var Stripe = StripeAPI(Meteor.settings.stripe.secret_key);
var Future = Npm.require('fibers/future');

Meteor.methods({
    charge_create: function(amount, currency, card_number, card_month, card_year, card_cvc, card_name, user) {
        fut = new Future();
        user = Meteor.users.findOne({_id:user._id});
        var receipt_email;
        if (user.services){
            if (user.services.facebook)
                receipt_email = user.services.facebook.email;
            if (user.services.google)
                receipt_email = user.services.google.email;
        }
        if (user.emails){
            receipt_email = user.emails[0].address;
        }
        var campaign_obj = {}; //Campaigns.findOne({_id:campaign});
        campaign_obj.domain = Meteor.absoluteUrl();

        var payment_obj = _.extend({
            amount: amount,
            currency: currency,
            card: {
                number: card_number,
                exp_month: card_month,
                exp_year: card_year,
                cvc: card_cvc,
                name: card_name
            },
            receipt_email: receipt_email
        });
        campaign_obj.amount = (payment_obj.amount/100).toFixed(2);
        var date = new Date();
        campaign_obj.date = date.toLocaleDateString();

        Stripe.charges.create(payment_obj, function (err, res) {
            if (err) {
                fut.return(err);
            } else {

                fut.return(res);
            }
        });

        var email_obj = {
            from: Meteor.settings.email.from,
            to: receipt_email,
            subject: "Receipt for " + campaign_obj.name,
            html: Handlebars.templates.payment_received(campaign_obj)
        };
       //Email.send(email_obj);


        return fut.wait();
    }
});
