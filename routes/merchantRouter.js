const router = require("express").Router();
const {Merchant}=require('../models/merchant');

router.get('/',(req, res, next) => {
	Merchant.find().then((cats) => {
		if(!cats){
			res.status(404).send("Not found");
		}
		return res.json(cats);
	})
	.catch(err=>next(err));
})

router.post('/',async (req, res, next) => {
	cat=new Merchant(req.body);
	await cat.save();
	return res.json(cat);
})

module.exports=router;