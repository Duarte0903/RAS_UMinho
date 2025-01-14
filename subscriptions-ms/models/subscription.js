const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // UUID for subscription
    user_id: { type: String, required: true, unique: true }, // UUID for user
    type: { 
        type: String, 
        enum: ['monthly', 'annual'],  
        required: true 
    },
    state: { 
        type: String, 
        enum: ['active', 'inactive'],
        required: true 
    },
    inserted_at: { type: Date, default: Date.now }
}, { collection: 'subscriptions' });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
