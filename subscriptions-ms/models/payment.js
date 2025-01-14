const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    subscription_id: {
        type: String,
        required: true,
        unique: true
    },
    extra: {
        type: Map, 
        of: String,
        required: false
    }
}, { collection: 'payments' });

module.exports = mongoose.model('Payment', PaymentSchema);
