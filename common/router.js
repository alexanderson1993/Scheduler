
Router.configure({
	layoutTemplate:'main_layout',
	onBeforeAction:function(){
		$('.navbar-collapse').removeClass('in');
		this.next();
	}
});

Router.route('/', {
	layoutTemplate:'front_layout',
	action:function(){
		this.render('main');
	}
});
Router.route('/missions', {
	waitOn:function(){
		return Meteor.subscribe('mission');
	},
	action:function(){
		this.render('missions');
	}
});
Router.route('/profile', {
	waitOn:function(){
		return Meteor.subscribe('users', Meteor.userId());
	},
	action:function(){
		if (Meteor.userId()){
			this.render('user_profile');
		} else {
			Router.go('/login');
		}
	}
});
Router.route('/book/', {
	waitOn:function(){
		return [Meteor.subscribe('flighttype'),Meteor.subscribe('schedule')];
	},
	data:function(){
		return Session.get('pendingBooking');
	},
	action:function(){
		this.render('book');
	}
});
Router.route('/shop', {
	waitOn:function(){
		Meteor.subscribe('product');
	},
	actions:function(){
		this.render('shop');
	}
});
Router.route('/schedule', {
	waitOn:function(){
		Meteor.subscribe('schedule');
	},
	action:function(){
		this.render('schedule');
	}
});
Router.route('/faq', {
	waitOn:function(){
		Meteor.subscribe('faq');
	},
	action:function(){
		this.render('faq');
	}
});
Router.route('/contact', {
	action:function(){
		this.render('contactForm');
	},
});
Router.route('/login', {
	action:function(){
		this.render('login');
	}
});
Router.route('/sign-out',{
	action:function(){
		Meteor.logout();
		Router.go('/')
	}
});
