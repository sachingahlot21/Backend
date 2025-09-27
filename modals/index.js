const express = require('express')
const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema(
    {
        productid: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        usp: {
            type: String,
            required: true
        },
        offer: {
            type: String,
            required: true
        },
        itemName: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        discount: {
            type: String,
            required: true
        },
        priceBefore: {
            type: String,
            required: true
        },
     
        rating: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    });

const cartSchema = new mongoose.Schema({
    items: [cartItemSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming a user reference
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});



// const CartItem = mongoose.model('CartItem', cartItemSchema);
const Cart = mongoose.model('Cart', cartSchema);

module.exports = {Cart};
