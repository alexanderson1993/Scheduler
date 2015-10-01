function permission(){
	if (this.role === 'noUser'){
		if (Meteor.userId()){
			return false;
		} else {
			return true;
		}
	}
	if (!this.role || this.role === ''){
		return true;
	} else {
		return Roles.userHasRole(Meteor.userId(), this.role);
	}
}

Template.nav.helpers({
	parentLink:function(){
		return Links.find({parent:null}, {sort:{order:1}});
	},
	permission:permission
});

Template.headerLink.helpers({
	childrenLink:function(){
		return Links.find({parent:this._id}, {sort:{order:1}});
	},
	hasChildren:function(){
		return Links.find({parent:this._id}).count() > 0;
	},
	permission:permission
});
