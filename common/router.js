Router.configure({
	layoutTemplate:'main_layout'
});

Router.route('/', {
	layoutTemplate:'front_layout',
	action:function(){
		this.render('main');
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
			Router.go('/sign-in');
		}
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

Router.route('/contact',{
	action:function(){
		this.render('contactForm');
	}
})
/*
Router.route('/admin', {
	layoutTemplate:'admin_layout',
	action:function(){
		if (!Roles.userIsInRole(Meteor.userId(), ['admin'])){
			Router.go('/sign-in');
		} else {
			this.render('admin');
		}
	}
});

Router.route('/admin/users', {
	layoutTemplate:'admin_layout',
	waitOn:function(){
		return Meteor.subscribe('users',Meteor.userId());
	},
	action:function(){
		if (!Roles.userIsInRole(Meteor.userId(), ['admin'])){
			Router.go('/sign-in');
		} else {
			this.render('admin_users');
		}
	}
});

Router.route('/admin/user/:userId', {
	layoutTemplate:'admin_layout',
	waitOn:function(){
		return Meteor.subscribe('users',Meteor.userId());
	},
	data:function(){
		if (Users.findOne({_id:this.params.userId})){
			return Users.findOne({_id:this.params.userId}).profile;
		}
	},
	action:function(){
		if (!Roles.userIsInRole(Meteor.userId(), ['admin'])){
			Router.go('/sign-in');
		} else {
			this.render('admin_user_profile');
		}
	}
});*/
