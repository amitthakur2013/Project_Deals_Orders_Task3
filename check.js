
const Joi = require('@hapi/joi') 
Joi.objectId = require("joi-objectid")(Joi);
//User-defined function to validate the user 
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
    location: Joi.string(),
  });
  return schema.validate(deal);
}
var deal=
{
    "name":"Normal deal",
    "img":"IMAGE",
    "merchant":"5f3df8bd8b809123ecb147b3",
    "price":200,
    "commision":20,
    "prefernceOrder":2,
    "category": "5f3df7e68b809123ecb147b0",
    "valid":{"from":"25/08/19","to":"30/10/2020"}
}
response = validateDeal(deal) 
console.log(response);
if(response.error) 
{   
    console.log(response.error.details) 
} 
else
{ 
    console.log("Validated Data") 
} 