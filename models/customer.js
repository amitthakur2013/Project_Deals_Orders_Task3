const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
	name:String,
	orders:[{type:mongoose.Schema.Types.ObjectId,ref:'Order'}]
	})

module.exports=mongoose.model('Customer',customerSchema);
