const router = require("express").Router();
const Category=require('../models/category');

router.get('/',(req, res, next) => {
	Category.find().then((cats) => {
		if(!cats){
			res.status(404).send("Not found");
		}
		return res.json(cats);
	})
	.catch(err=>next(err));
})

router.post('/',async (req, res, next) => {
	cat=new Category(req.body);
	await cat.save();
	return res.json(cat);
})

module.exports=router;