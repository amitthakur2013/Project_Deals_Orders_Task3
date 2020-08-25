const express = require("express");

// * NPM Packages
const shortid = require("shortid");
const randomize = require("randomatic");
const _ = require("lodash");

// * Models
const {Deal}=require("../models/Deals");
const { Order } = require("../models/orders");
const Customer = require("../models/customer");

// * Functions

// * Util

// * Middleware

// * Requests -->
const router = express.Router();

// * Get all orders
router.get("/all", async (req, res) => {
  try {
    var orders = await Order.find({}).populate("customer").sort("-purchasedOn");
    if (!orders) return res.send("Orders not found.");

    res.send(orders);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get a single order ( AnC )
router.get("/view/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("deal")
      .populate("customer")
      .populate("outlet")
      .exec();
    if (!order) return res.send("Order not found.");

    res.send(order);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get a single order (M)
router.get("/merchant/view/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("deal")
      .populate("customer")
      .populate("outlet")
      .exec();
    if (!order) return res.send("Order not found.");

    var orderLocal = _.omit(req.body, ["redeemCode"]);
    var redeemCodeLocal = order.redeemCode.slice(0, -6).trim();
    redeemCodeLocal = redeemCodeLocal + "******";

    var response = {
      ...orderLocal,
      redeemCode: redeemCodeLocal,
    };

    res.send(response);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get orders in date range
router.post("/between-dates", async (req, res) => {
  try {
    const ordersFrom = new Date(req.body.ordersFrom.toString());
    const ordersTill = new Date(req.body.ordersTill.toString());

    const orders = await Order.find({
      purchasedOn: { $gte: ordersFrom },
      purchasedOn: { $lte: ordersTill },
    })
      .populate("customer")
      .sort("-purchasedOn");

    if (!orders) return res.send("Orders not found.");

    res.send(orders);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get orders of a merchant
router.get("/merchant/:merchant_id", async (req, res) => {
  try {
    const orders = await Order.find({
      outlet: req.params.merchant_id,
    })
      .populate("customer")
      .sort("-purchasedOn");

    if (!orders) return res.send("No Orders found.");

    res.send(orders);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get orders of a merchant in date range
router.post("/merchant/between-dates", async (req, res) => {
  try {
    const ordersFrom = new Date(req.body.ordersFrom.toString());
    const ordersTill = new Date(req.body.ordersTill.toString());

    const orders = await Order.find({
      outlet: req.params.merchant_id,
      purchasedOn: { $gte: ordersFrom, $lte: ordersTill },
    })
      .populate("customer")
      .sort("-purchasedOn");

    if (!orders) return res.send("No Orders found.");

    res.send(orders);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Get orders of a customer
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user_id })
      .populate("deal, outlet")
      .sort("-purchasedOn");

    if (!orders) return res.send("Orders not found.");

    res.send(orders);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Create a new order of Normal deal
router.post("/new", async (req, res) => {
  /*req.body ====>{
    "deal":"5f3fe44200346b2b400e0291",
    "outlet":"5f3df8bd8b809123ecb147b3",
    "userid":"5f3fe31200346b2b400e028f",
    "price":500,
    "discountedPrice":400,
    "useCredit":true}*/

  try {
    var redeemCode =
      shortid.generate().toString() +
      "-" +
      shortid.generate().toString() +
      "-" +
      randomize("Aa0", 6).toString();

    var newOrder = await Order.create({
      redeemCode: redeemCode,
      deal: req.body.deal,
      outlet: req.body.outlet,
      // customer: req.user._id,
      customer: req.body.userid,
      status: "active",
      purchasedOn: new Date(),
      price: req.body.price,
      promocode: req.body.promocodeApplied, // <-- This is an optional field
      discountedPrice: req.body.discountedPrice,
    });

    // var customer = await Customer.findById(req.user._id).exec();
    var customer = await Customer.findById(req.body.userid).exec();
    customer.orders.push(newOrder._id);
    customer.markModified("orders");
    //await customer.save();

    if (req.body.useCredit){
      if(newOrder.discountedPrice <= customer.credit ) {
        customer.credit-=newOrder.discountedPrice;
        newOrder.discountedPrice=0;
      } else {
        newOrder.discountedPrice-=customer.credit;
        customer.credit=0;
      }
      await newOrder.save();
    }
    await customer.save();

    res.send(newOrder);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

/*Create a new Order of a movie deal*/
router.post("/new_movie",(req, res) => {
  var redeemCode =
    shortid.generate().toString() +
    "-" + 
    shortid.generate().toString() +
    "-" +
    randomize("Aa0", 6).toString();

  /* req.body.seat => "A1-A12" */  
  const seat=req.body.seat.trim().split("-")
  var s=seat[0][0];
  var a=parseInt(seat[0].substring(1,));
  var b=parseInt(seat[1].substring(1,));
  l=[]
  for(var i=a;i<=b;i++){
    l.push(s+i);
  }
  Deal.findById(req.body.deal)
  .then(async(deal)=> {
    try{ 
      var flag=0;
      deal.movieAvailability.map((avl)=>{
      if (avl.day.toString() === req.body.day.toString()){
        flag=1;
        avl.slot.map((slt) => {
          if ((slt.from.toString() === req.body.from.toString()) && (slt.to.toString() === req.body.to.toString())) {
            slt.seats.map((seat) => {
            if(l.includes(seat.seatno)){
              if (!seat.isavailable) return res.send("Seat not available!pls book carefully!");
              seat.isavailable=false;
              }
            
            })
            return;
          }
         })
        return;
      }
    })
      if (flag==0) return res.status(400).send("Movie not available on the given date!");
     /* deal.seats.map((seat) => {
      if(l.includes(seat.seatno)){
        seat.isavailable=false;
        }
      })*/
      await deal.save();
      
      var newOrder = await Order.create({
      redeemCode: redeemCode,
      deal: req.body.deal,
      outlet: req.body.outlet,
      // customer: req.user._id,
      customer: req.body.userid,
      status: "active",
      purchasedOn: new Date(),
      price: req.body.price,
      promocode: req.body.promocodeApplied, // <-- This is an optional field
      discountedPrice: req.body.discountedPrice,
    });

    // var customer = await Customer.findById(req.user._id).exec();
    var customer = await Customer.findById(req.body.userid).exec();
    customer.orders.push(newOrder._id);
    customer.markModified("orders");
    //await customer.save();

    if (req.body.useCredit){
      if(newOrder.discountedPrice <= customer.credit ) {
        customer.credit-=newOrder.discountedPrice;
        newOrder.discountedPrice=0;
      } else {
        newOrder.discountedPrice-=customer.credit;
        customer.credit=0;
      }
      await newOrder.save();
    }
    await customer.save();

    res.send(newOrder);
    }
    catch(err) {
      console.log(err);
      res.status(400).send("Something went wrong!");
    }

  })
  .catch(err => res.status(400).send("Something went wrong!"));

})

/*Create a new order of a hotel deal*/
router.post("/new_hotel",(req, res) => {
  var redeemCode =
    shortid.generate().toString() +
    "-" +
    shortid.generate().toString() +
    "-" +
    randomize("Aa0", 6).toString();

  Deal.findById(req.body.deal)
  .then(async (deal) => {
    if(!deal.roomQty){
      return res.send("No deal available");
    }
    deal.roomQty-=1;
    await deal.save();
  
    if(req.body.extraAdult) {
      if (req.body.extraAdult + deal.adult <=deal.maxAdult) {
        req.body.price+=deal.extraPrice*req.body.extraAdult;
        req.body.discountedPrice+=deal.extraPrice*req.body.extraAdult;
      } else{
        return res.send('Max adult limit exceeded!');
      }
    }
    if(req.body.extraChild) {
      if (req.body.extraChild + deal.child <= deal.maxChild) {
        req.body.price+=deal.extraPrice*req.body.extraChild;
        req.body.discountedPrice+=deal.extraPrice*req.body.extraChild;
      } else {
        return res.send('Max child limit exceeded!')
      }
    }

    if(req.body.meal){
        req.body.discountedPrice+=req.body.meal.price;
      }
    var newOrder = await Order.create({
      redeemCode: redeemCode,
      deal: req.body.deal,
      outlet: req.body.outlet,
      // customer: req.user._id,
      customer: req.body.userid,
      status: "active",
      purchasedOn: new Date(),
      price: req.body.price,
      promocode: req.body.promocodeApplied, // <-- This is an optional field
      discountedPrice: req.body.discountedPrice,
    });
    // var customer = await Customer.findById(req.user._id).exec();
    var customer = await Customer.findById(req.body.userid).exec();
    customer.orders.push(newOrder._id);
    customer.markModified("orders");
    //await customer.save();

    if (req.body.useCredit){
      if(newOrder.discountedPrice <= customer.credit ) {
        customer.credit-=newOrder.discountedPrice;
        newOrder.discountedPrice=0;
      } else {
        newOrder.discountedPrice-=customer.credit;
        customer.credit=0;
      }
      await newOrder.save();
    }
    await customer.save();

    res.send(newOrder);


  })
  .catch((err) => res.statue(400).send(err))
});

/*Create a new Order of an activity deal*/
router.post('/new_activity',(req, res) => {
  var redeemCode =
    shortid.generate().toString() +
    "-" +
    shortid.generate().toString() +
    "-" +
    randomize("Aa0", 6).toString();

 Deal.findById(req.body.deal)
 .then( async (deal)=> {
  if(!deal) return res.send("deal not exist!!");
  try{
    var flag=0;
  deal.availability.map((avl)=>{
    if (avl.day.toString() === req.body.day.toString()){
      flag=1;
      avl.slot.map((slt) => {
        if ((slt.from.toString() === req.body.from.toString()) && (slt.to.toString() === req.body.to.toString())) {
          if(!slt.qty) {
            return res.send("Slot Not available!");
          }
          slt.qty-=1;
          return;
        }
       })
      return;
    }
  })
  if (flag==0) return res.status(400).send("Movie not available on the given date!");
  await deal.save();

  var newOrder = await Order.create({
      redeemCode: redeemCode,
      deal: req.body.deal,
      outlet: req.body.outlet,
      // customer: req.user._id,
      customer: req.body.userid,
      status: "active",
      purchasedOn: new Date(),
      price: req.body.price,
      promocode: req.body.promocodeApplied, // <-- This is an optional field
      discountedPrice: req.body.discountedPrice,
    });

    // var customer = await Customer.findById(req.user._id).exec();
    var customer = await Customer.findById(req.body.userid).exec();
    customer.orders.push(newOrder._id);
    customer.markModified("orders");
    //await customer.save();

    if (req.body.useCredit){
      if(newOrder.discountedPrice <= customer.credit ) {
        customer.credit-=newOrder.discountedPrice;
        newOrder.discountedPrice=0;
      } else {
        newOrder.discountedPrice-=customer.credit;
        customer.credit=0;
      }
      await newOrder.save();
    }
    await customer.save();

    res.send(newOrder);
  } catch(err) {
    console.log(err);
    return res.send("Something went wrong!");
  }

 })
 .catch((err) => res.send("Something went wrong!"))

})

// * Redeem Order
router.post("/redeem/:order_id", async (req, res) => {
  try {
    var order = await Order.findById(req.params.order_id).exec();

    if (!order) return res.send("Order does not exist.");

    // check if already redeemed
    if (order.status.trim() === "redeemed")
      return res.send("Already redeemed.");

    // checking the redeem code
    if (req.body.code.trim() !== order.redeemCode.trim())
      return res.send("Invalid redeem code.");

    // check if order is in valid date bounds
    if (
      new Date() >= order.deal.validFrom &&
      new Date() <= order.deal.validTill
    ) {
      // code is valid
      order.status = "redeemed";
      order.redeemedOn = new Date();

      order = await order.save();

      res.send(order);
    } else {
      // order expired
      return res.send("Redeem code has expired.");
    }
  } catch (error) {
    console.log(error);
    res.send("Something went wrong.");
  }
});

// * Requests End -->

module.exports = router;
