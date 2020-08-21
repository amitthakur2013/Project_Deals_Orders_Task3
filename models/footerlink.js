const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const linkSchema =  new Schema ({
	name:{
		type:String,
		required:true
	},
	isActive:{
		type:Boolean,
		default:false
	},
	body:{
		type:String,
		required:true
	}
});

const footerLink=mongoose.model('footerLink',linkSchema);

module.exports=footerLink;

