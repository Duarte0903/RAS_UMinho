const Payment = require('../models/payment');
const mongoose = require('mongoose');

// Create a new payment
module.exports.createPayment = async (data) => {
    const { subscription_id, extra } = data;

    const payment = new Payment({
        id: new mongoose.Types.ObjectId().toString(), // Generate UUID as a string
        subscription_id,
        extra
    });

    return await payment.save();
};

// Get all payments
module.exports.getAllPayments = async () => {
    return await Payment.find().exec();
};

// Get a payment by ID
module.exports.getPaymentById = async (id) => {
    return await Payment.findOne({ id }).exec();
};

// Get payments by subscription ID
module.exports.getPaymentsBySubscriptionId = async (subscription_id) => {
    return await Payment.find({ subscription_id }).sort({ createdAt: -1 }).exec();
};

// Update a payment by ID
module.exports.updatePayment = async (id, updates) => {
    return await Payment.findOneAndUpdate({ id }, updates, { new: true });
};

// Delete a payment by ID
module.exports.deletePayment = async (id) => {
    return await Payment.findOneAndDelete({ id }).exec();
};

// Delete all payments for a subscription ID
module.exports.deletePaymentsBySubscriptionId = async (subscription_id) => {
    return await Payment.deleteMany({ subscription_id }).exec();
};

// Delete all payments
module.exports.deleteAllPayments = async () => {
    return await Payment.deleteMany().exec();
};
