var paymentErrorDep = new Tracker.Dependency,
paymentErrors = [],
getPaymentErrors = function() {
  paymentErrorDep.depend();
  return paymentErrors;
},
setPaymentErrors = function(errors) {
  paymentErrors = errors;
  paymentErrorDep.changed();
};

var formWorkingDep = new Tracker.Dependency,
formWorking = false,
getFormWorking = function() {
  formWorkingDep.depend();
  return formWorking;
},
setFormWorking = function(working) {
  formWorking = working;
  formWorkingDep.changed();
};

Template.payment.events({
  'click .submit-button':function(e,t) {
    setFormWorking(true);
    setPaymentErrors([]);
    var prizeArray = [];
    //GAnalytics.event("pledge","Pledge Made");
    //Validate to make sure that prize quantities are correct
    var d = {
      'card_number': t.find('input[name="number"]').value.replace(/ /g, ''),
      'card_month': parseInt(t.find('input[name="expiry"]').value.split(' / ')[0]).toString(10),
      'card_year': '20' + t.find('input[name="expiry"]').value.split(' / ')[1],
      'card_cvc': t.find('input[name="cvc"]').value,
      'card_name': t.find('input[name="card_firstName"]').value + " " + t.find('input[name="card_lastName"]').value,
      'amount': (Session.get('totalPayment'))*100,
      'currency': 'USD',
    };

    Meteor.call('charge_create', d.amount, d.currency, d.card_number, d.card_month, d.card_year, d.card_cvc, d.card_name, Meteor.user(),
      function(error, result){
        setFormWorking(false);
        console.log(error,result);
        if (error) {
            //Deal with Error
            console.log(error);
          } else {
            if (result.rawType === 'card_error') {
              setPaymentErrors([result.message]);
            } else {
              setPaymentErrors([]);
              var txnId = Transactions.insert({
                entity_id: objId,
                stripe_obj: result,
                charge_id: result.id
              });
              $('.modal').modal('hide');
              Meteor.setTimeout(function(){
                Router.go('/');
              },500);
            }
          }
        });
  }
});


Template.payment.rendered = function(){
  $('.payment-card').card({ 
    form: '.active form', container: $('.card-wrapper')[0], debug: 'true', formSelectors: {
      nameInput: 'input[name="card_firstName"], input[name="card_lastName"]'
    }
  })
}

Template.payment.helpers({
  payment_errors: function() {
    getPaymentErrors();
  },
  totalPaymentAmount: function(e, t) {
    return Session.get('totalPayment');
  },
  buttonsDisabled: function() {
    return getFormWorking();
  },
});

Template.paymentBooking.events({
  'click .submit-button':function(e,t) {
    setFormWorking(true);
    setPaymentErrors([]);
    var prizeArray = [];
    //GAnalytics.event("pledge","Pledge Made");
    //Validate to make sure that prize quantities are correct
    var d = {
      'card_number': t.find('input[name="number"]').value.replace(/ /g, ''),
      'card_month': parseInt(t.find('input[name="expiry"]').value.split(' / ')[0]).toString(10),
      'card_year': '20' + t.find('input[name="expiry"]').value.split(' / ')[1],
      'card_cvc': t.find('input[name="cvc"]').value,
      'card_name': t.find('input[name="card_firstName"]').value + " " + t.find('input[name="card_lastName"]').value,
      'amount': (Session.get('totalPayment'))*100,
      'currency': 'USD',
    };

    Meteor.call('charge_create', d.amount, d.currency, d.card_number, d.card_month, d.card_year, d.card_cvc, d.card_name, Meteor.user(),
      function(error, result){
        setFormWorking(false);
        console.log(error,result);
        if (error) {
            //Deal with Error
            console.log(error);
          } else {
            if (result.rawType === 'card_error') {
              setPaymentErrors([result.message]);
            } else {
              setPaymentErrors([]);
              var txnId = Transactions.insert({
                entity_id: objId,
                stripe_obj: result,
                charge_id: result.id
              });
              $('.modal').modal('hide');
              Meteor.setTimeout(function(){
                Router.go('/');
              },500);
            }
          }
        });
  }
});


Template.paymentBooking.rendered = function(){
  $('.payment-card').card({ 
    form: '.active form', container: $('.card-wrapper')[0], debug: 'true', formSelectors: {
      nameInput: 'input[name="card_firstName"], input[name="card_lastName"]'
    }
  })
}

Template.paymentBooking.helpers({
  payment_errors: function() {
    getPaymentErrors();
  },
  totalPaymentAmount: function(e, t) {
    return Session.get('totalPayment');
  },
  buttonsDisabled: function() {
    return getFormWorking();
  },
});
