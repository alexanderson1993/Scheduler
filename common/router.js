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
Router.route('/academy', {
	onBeforeAction:function(){
		if (!Meteor.userId()){
			Session.set('redirectURL','/academy');
			Router.go('/login');
		} else {
			this.next();
		}
	},
	action:function(){
		if (Roles.userHasRole(Meteor.userId(),'cadet')){
			this.render('academy');
		} else {
			this.render('academy_application');
		}
	}
});
Router.route('/book/', {
	onBeforeAction:function(){
		if (!Meteor.userId()){
			Session.set('redirectURL','/book');
			Router.go('/login');
		} else {
			this.next();
		}
	},
	waitOn:function(){
		return [Meteor.subscribe('flighttype'), Meteor.subscribe('schedule'), Meteor.subscribe('victor_roles'), Meteor.subscribe('flight',Meteor.userId())];
	},
	data:function(){
		return Session.get('pendingBooking');
	},
	action:function(){
		this.render('book');
	}
});
Router.route('/bookingSubmit', {
	action:function(){
		this.render('submitAnimation');
	}
});
Router.route('/request',{
	onBeforeAction:function(){
		if (!Meteor.userId()){
			Session.set('redirectURL','/request');
			Router.go('/login');
		} else {
			this.next();
		}
	},
	data:function(){
		return Session.get('pendingBooking');
	},
	action:function(){
		this.render('missionRequest');
	}
});
Router.route('/flights', {
	waitOn:function(){
		return [Meteor.subscribe('flight',Meteor.userId()), Meteor.subscribe('flighttype'), Meteor.subscribe('mission'), Meteor.subscribe('schedule'), Meteor.subscribe('fd_roles')];
	},
	action:function(){
		if (Roles.userHasRole(Meteor.userId(), 'victor')){
			this.render('flights');
		} else {
			Router.go('/login');
		}
	}
});
Router.route('/shop', {
	waitOn:function(){
		return Meteor.subscribe('product');
	},
	actions:function(){
		this.render('shop');
	}
});
Router.route('/schedule', {
	waitOn:function(){
		return [Meteor.subscribe('schedule',Meteor.userId()), Meteor.subscribe('scheduleUsers',Meteor.userId())];
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
