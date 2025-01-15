const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

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

SubscriptionSchema.index({ user_id: 1 });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
