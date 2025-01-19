const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/payment');

const SubscriptionSchema = new mongoose.Schema({
    _id: { type: String, required: true, default: uuidv4 }, // UUID for subscription
    user_id: { // UUID for user 
        type: String, 
        required: true, 
        unique: true
        // OPCIONAL - validar se é um UUID válido
        /*validate: {
            validator: function(v) {
                return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid UUID!`
        }*/
    },
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

// Index for better performance searching by user_id
SubscriptionSchema.index({ user_id: 1 });

// Middleware to delete payments on cascade before deleting a subscription
SubscriptionSchema.pre('findOneAndDelete', async function(next) {
    const subscriptionId = this._conditions._id;

    if (subscriptionId) {
        await Payment.deleteMany({ subs_id: subscriptionId });
    }

    next();
});


module.exports = mongoose.model('Subscription', SubscriptionSchema);
