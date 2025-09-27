const Coupon = require('../modals/coupons');

const addNewCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountAmount,
      minPurchaseAmount,
      maxDiscountAmount,
      expiresAt
    } = req.body;

    
    const existing = await Coupon.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code,
      discountType,
      discountAmount,
      minPurchaseAmount,
      maxDiscountAmount,
      expiresAt: new Date(expiresAt),
    });

    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const verifyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    const now = new Date();
    if (!coupon.isActive || coupon.expiresAt < now) {
      return res.status(400).json({ message: 'Coupon is expired or inactive' });
    }

    if (cartTotal < coupon.minPurchaseAmount) {
      return res.status(400).json({ message: `Minimum purchase amount is ${coupon.minPurchaseAmount}` });
    }

    let discount;
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountAmount) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountAmount;
    }

    res.status(200).json({
      message: 'Coupon is valid',
      discount,
      finalAmount: cartTotal - discount
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const showAllCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addNewCoupon,
  verifyCoupon,
  showAllCoupon
};
