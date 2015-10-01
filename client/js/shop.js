Template.shop.created = function(){
	if (typeof Session.get('productQty') === 'undefined'){
		Session.set('productQty', {});
	}
};
var forceRedraw = function(element){
	$(element).css("opacity", 0.99);
	setTimeout(function(){
		$(element).css("opacity", 1);
	},20);
}

Template.shop.helpers({
	product:function(){
		return Product.find();
	},
	productQty:function(){
		return Session.get('productQty')[this._id];
	},
	downDisabled:function(){
		return (Session.get('productQty')[this._id] <= 0 || typeof Session.get('productQty')[this._id] === 'undefined');
	},
	checkoutAmount:function(){
		var prodQty = Session.get('productQty');
		var price;
		var key;
		var total = 0;
		for (key in prodQty){
			price = Product.findOne({_id:key}).price;
			total += price * prodQty[key];
		}
		return total;
	}
});

Template.shop.events({
	'click .qtyDown':function(){
		var prodQty = Session.get('productQty');
		var value = prodQty[this._id];
		if (value - 1 >= 0){
			prodQty[this._id] = value - 1;
			Session.set('productQty', prodQty);
		}
		Meteor.setTimeout(function(){
			forceRedraw($('.shop')[0]);
		},10);
	},
	'click .qtyUp':function(){
		var prodQty = Session.get('productQty');
		var value = prodQty[this._id];
		if (typeof value === 'undefined'){
			prodQty[this._id] = 1;
		} else {
			prodQty[this._id] = value + 1;
		}
		Session.set('productQty', prodQty);
		Meteor.setTimeout(function(){
			forceRedraw($('.shop')[0]);
		},10);
	},
	'change .qtyValue':function(e){
		if (e.target.value > -1){
			var prodQty = Session.get('productQty');
			prodQty[this._id] = parseInt(e.target.value,10);
			Session.set('productQty', prodQty);
		}
	},
	'click .checkout':function(){
		var prodQty = Session.get('productQty');
		var price;
		var key;
		var total = 0;
		for (key in prodQty){
			if (Product.findOne({_id:key})){
				price = Product.findOne({_id:key}).price;
				total += price * prodQty[key];
			}
		}
		//GAnalytics.event("pledge","Pledge Modal");
		Session.set('totalPayment', total);
		$('.modal').modal();
	}
});
