const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
	name:String,
	orders:[{type:mongoose.Schema.Types.ObjectId,ref:'Order'}],
	credit:Number
	})

module.exports=mongoose.model('Customer',customerSchema);
