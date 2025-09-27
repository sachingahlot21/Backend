const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountAmount: {
        type: Number,
        required: true,
    },
    minPurchaseAmount: {
        type: Number,
        default: 0,
    },
    maxDiscountAmount: {
        type: Number,
        default: null, 
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);