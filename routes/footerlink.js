const express = require('express');
const router = express.Router();
const Link=require('../models/footerlink');

/*View all the links*/
router.get('/',(req, res, next) => {
	Link.find()
	.then((links) => {
		res.json(links);
	})
	.catch((err) => {
		next(err);
	})
})

/*View the particular link*/
router.get('/:id',(req,res,next) => {
	Link.findById(req.params.id)
	.then((link) => {
		if(!link) {
			return res.json({status:"Unsuccessfull!",message:"Link does not exist"});
		}
		res.status(200).json(link);
	})
	.catch(err => next(err));
})

/*Create the link*/
router.post('/create',(req, res, next) => {
	Link.create(req.body)
	.then(async (link) => {
		link.isActive=true;
		await link.save();
		res.json(link);
	})
	.catch((err) =>  next(err));
})

/*Hide unhide the link*/
router.put('/hide/:id',(req, res, next) => {
	Link.findById(req.params.id)
	.then(async (link) => {
		link.isActive=!link.isActive;
		await link.save();
		res.json(link);
	})
	.catch(err => next(err));
})

/*Update the link*/
router.put('/update/:id',(req, res, next) => {
	Link.findByIdAndUpdate(req.params.id,req.body,{new:true})
	.then((link) => {
		if(!link) {
			return res.json({status:"Unsuccessfull!",message:"Link does not exist"});
		}
		res.status(200).json({status:"Successfull!",link});
	})
	.catch(err =>{
		next(err);
	});
})

/*Delete the link*/
router.delete('/delete/:id',(req, res, next) => {
	Link.findByIdAndRemove(req.params.id)
	.then((link)=> {
		if(!link) {
			return res.json({status:"Unsuccessfull!",message:"Link does not exist"});
		}
		res.json({status:"Successfull!",link});
	})
	.catch(err => next(err));
})

module.exports=router;