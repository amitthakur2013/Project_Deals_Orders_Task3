const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const dealSchema = new mongoose.Schema({
  name: String,
  movieName: String,
  movieAvailability:[{
    day:String,
    slot:[{
      from:String,
      to:String,
      price:Number,
      seats:[{
      seatno:String,
      isavailable:{type:Boolean,default:true}
            }]
    }]
  }],

  //hotel deal start
  adult:Number,
  child:Number,
  maxAdult:Number,
  maxChild:Number,
  roomQty:Number,
  meal:{
    mealtype:String,
    price:Number
  },
  extraPrice:Number,
  //hotel deal finished

  availability:[{
    day:String,
    slot:[{
      from:String,
      to:String,
      price:Number,
      qty:Number
    }]
  }],
  description: String,
  img: {
    type: String,
    required: true,
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "merchant",
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  commision: {
    //? also percent?? if yes also change validation
    type: Number,
    required: true,
  },
  discountPercent: Number,
  prefernceOrder: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  Subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
  },
  valid: {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  display:{
    from:{
      type:String,
      required:true
    },
    to:{
      type:String,
      required:true
    },
  },
  location: {
    type: String,
  },
  createdOn: String,
});

function validateDeal(deal) {
  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    img: Joi.string().required(),
    merchant: Joi.objectId().required(),
    price: Joi.number().required(),
    commision: Joi.number().required(),
    discountPercent: Joi.number(),
    prefernceOrder: Joi.number().required(),
    category: Joi.objectId().required(),
    // Subcategory: Joi.objectId().required(),
    valid: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    display: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    location: Joi.string(),
  });
  return schema.validate(deal);
}

function validateactivityDeal(deal) {
  const schema = Joi.object({
    name: Joi.string(),
    availability:Joi.array().items(
      Joi.object({
        day:Joi.string().required(),
        slot:Joi.array().items(Joi.object({
        from:Joi.string().required(),
        to:Joi.string().required(),
        price:Joi.number().required(),
        qty:Joi.number().required()
        }))
      })
      ),
    description: Joi.string(),
    img: Joi.string().required(),
    merchant: Joi.objectId().required(),
    price: Joi.number().required(), 
    commision: Joi.number().required(),
    discountPercent: Joi.number(),
    prefernceOrder: Joi.number().required(),
    category: Joi.objectId().required(),
    //Subcategory: Joi.objectId().required(),
    valid: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    display: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    location: Joi.string(),
  });
  return schema.validate(deal);
}

function validatemovieDeal(deal) {
  const schema = Joi.object({
    movieName: Joi.string().required(),
    description: Joi.string(),
    row:Joi.number().required(),
    col:Joi.number().required(),
    img: Joi.string().required(),
    merchant: Joi.objectId().required(),
    price: Joi.number().required(),
    commision: Joi.number().required(),
    discountPercent: Joi.number(),
    prefernceOrder: Joi.number().required(),
    category: Joi.objectId().required(),
    movieAvailability:Joi.array().items(
      Joi.object({
        day:Joi.string().required(),
        slot:Joi.array().items(Joi.object({
        from:Joi.string().required(),
        to:Joi.string().required(),
        price:Joi.number().required(),
        }))
      })
      ),
    // Subcategory: Joi.objectId().required(),
    valid: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    display: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    location: Joi.string(),
  });
  return schema.validate(deal);
}

function validatehotelDeal(deal) {
  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    img: Joi.string().required(),
    merchant: Joi.objectId().required(),
    price: Joi.number().required(),
    commision: Joi.number().required(),
    discountPercent: Joi.number(),
    prefernceOrder: Joi.number().required(),
    category: Joi.objectId().required(),
    roomQty:Joi.number().required(),
    adult:Joi.number().required(),
    child:Joi.number().required(),
    maxAdult:Joi.number().required(),
    maxChild:Joi.number().required(),
    meal:Joi.object({
      mealtype:Joi.string(),
      price:Joi.number()
    }), 
    extraPrice:Joi.number().required(),
    valid: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    display: Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
    }),
    location: Joi.string(),
  });
  return schema.validate(deal);
}

const Deal = mongoose.model("Deal", dealSchema);

exports.Deal = Deal;
exports.validateDeal= validateDeal;
exports.validateactivityDeal = validateactivityDeal;
exports.validatemovieDeal = validatemovieDeal;
exports.validatehotelDeal=validatehotelDeal;