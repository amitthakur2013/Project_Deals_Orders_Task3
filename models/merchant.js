const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema({
	name:String,
	deals:[
		{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Deal"
		}
	]
	})

const merchant=mongoose.model('merchant',merchantSchema);
module.exports.Merchant=merchant;