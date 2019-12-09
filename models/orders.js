const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderItems = new Schema({
  name: {
    type: String
  },
  price: {
    type: Number
  },
  description: {
    type: String
  },
  size: {
    type: String
  },
  crust: {
    type: String
  },
  toppings: {
    type: [String]
  }
});

// Define collection and schema for Orders
let Orders = new Schema(
  {
    order: [orderItems]
  },
  {
    versionKey: false,
    collection: "orders"
  }
);

module.exports = mongoose.model("Orders", Orders);
