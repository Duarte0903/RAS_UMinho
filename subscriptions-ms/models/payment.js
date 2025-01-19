const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const PaymentSchema = new mongoose.Schema({
    _id: { type: String, required: true, default: uuidv4 },
    subs_id: {
        type: String,
        required: true,
        validate: { // como subscription é definido neste ms podemos validar sem problema
            validator: v => uuidRegex.test(v),
            message: props => `${props.value} is not a valid UUID!`
        }
    },
    extra: {
        type: Map, 
        of: String,
        required: false
    }
}, { collection: 'payments' });

PaymentSchema.index({ subs_id: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);
