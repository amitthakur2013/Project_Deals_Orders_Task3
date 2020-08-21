const router = require("express").Router();
const Subcategory=require('../models/Subcategory');

router.get('/',(req, res, next) => {
	Subcategory.find().then((cats) => {
		if(!cats){
			res.status(404).send("Not found");
		}
		return res.json(cats);
	})
	.catch(err=>next(err));
})

router.post('/',async (req, res, next) => {
	cat=new Subcategory(req.body);
	await cat.save();
	return res.json(cat);
})

module.exports=router;