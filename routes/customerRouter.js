const router = require("express").Router();
const Customer=require('../models/customer');

router.get('/',(req, res, next) => {
	Customer.find().populate('orders').exec().then((cats) => {
		if(!cats){
			res.status(404).send("Not found");
		}
		return res.json(cats);
	})
	.catch(err=>next(err));
})

router.post('/',async (req, res, next) => {
	cat=new Customer(req.body);
	await cat.save();
	res.json(cat);
})

module.exports=router;