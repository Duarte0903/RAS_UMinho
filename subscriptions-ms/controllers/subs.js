const Subscription = require('../models/subscription');
const Payment = require('../models/payment');

// Get a subscription by user ID
module.exports.getSubscription = async (user_id) => {
    return await Subscription.findOne({ user_id }).exec();
}

// Create a new subscription
module.exports.createSubscription = async (user_id, data) => {
    const { type, state } = data;
    if (!user_id || !type || !state) {
        throw new Error("Missing required fields: user_id, type, or state");
    }
    
    // Prevent duplicate subscriptions
    const existingSubscription = await Subscription.findOne({ user_id: user_id });
    if (existingSubscription) {
        throw new Error("A subscription for this user already exists");
    }
    
    const subscription = new Subscription({
        user_id,
        type,
        state
    });

    try {
        return await subscription.save();
    } catch (error) {
        throw new Error(`Error creating subscription: ${error.message}`);
    }
};

// Update a subscription by ID
module.exports.updateSubscription = async (subs_id, user_id, updates) => {
    if (!updates || Object.keys(updates).length === 0) {
        throw new Error("No updates provided");
    }

    try {
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { _id: subs_id, user_id: user_id }, // Use _id para buscar o documento
            updates,
            {
                new: true,          // Retorna o documento atualizado
                runValidators: true // Aplica as validações do esquema
            }
        );

        if (!updatedSubscription) {
            throw new Error("Subscription not found");
        }

        return updatedSubscription;
    } catch (error) {
        throw new Error(`Error updating subscription: ${error.message}`);
    }
};

// Delete a subscription by ID
module.exports.deleteSubscription = async (subs_id, user_id) => {
    try {
        const deletedSubscription = await Subscription.findOneAndDelete({ _id: subs_id, user_id: user_id }).exec();

        if (!deletedSubscription) {
            throw new Error("Subscription not found");
        }

        return deletedSubscription;
    } catch (error) {
        throw new Error(`Error deleting subscription: ${error.message}`);
    }
};


// ----------------- PAYMENTS -------------------


// Get all payments associated to a subscription
module.exports.getPayments = async (subs_id, user_id) => {
    const subs = await Subscription.findOne({ subs_id: subs_id, user_id: user_id }).exec();
    if (!subs) {
        throw new Error("Subscription not found");
    }
    return await Payment.find({ subs_id }).exec();
}

// Create a new payment
module.exports.createPayment = async (user_id, subs_id, data) => {
    const { extra } = data;
    if (!user_id || !subs_id || !extra) {
        throw new Error("Missing required fields: user_id, subs_id, or extra");
    }
    
    const subs = await Subscription.findOne({ subs_id: subs_id, user_id: user_id }).exec();
    if (!subs) {
        throw new Error("Subscription not found");
    }
    
    const payment = new Payment({
        subs_id,
        extra
    });

    try {
        return await payment.save();
    } catch (error) {
        throw new Error(`Error creating payment: ${error.message}`);
    }
};

// Update a payment by ID
module.exports.updatePayment = async (subs_id, pay_id, user_id, data) => {
    const { extra } = data;
    if (!user_id || !subs_id || !pay_id || !extra) {
        throw new Error("Missing required fields: user_id, subs_id, pay_id, or extra");
    }
    
    const subs = await Subscription.findOne({ subs_id: subs_id, user_id: user_id }).exec();
    if (!subs) {
        throw new Error("Subscription not found");
    }

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { _id: pay_id, subs_id: subs_id }, // Use _id para buscar o documento
            updates,
            {
                new: true,          // Retorna o documento atualizado
                runValidators: true // Aplica as validações do esquema
            }
        );

        if (!updatedPayment) {
            throw new Error("Payment not found");
        }

        return updatedPayment;
    } catch (error) {
        throw new Error(`Error updating payment: ${error.message}`);
    }
};

// Delete a payment by ID
module.exports.deletePayment = async (subs_id, pay_id, user_id) => {
    if (!user_id || !subs_id || !pay_id) {
        throw new Error("Missing required fields: user_id, subs_id, or pay_id");
    }

    const subs = await Subscription.findOne({ subs_id: subs_id, user_id: user_id }).exec();
    if (!subs) {
        throw new Error("Subscription not found");
    }

    try {
        const deletedPayment = await Payment.findOneAndDelete({ _id: pay_id, subs_id: subs_id }).exec();

        if (!deletedPayment) {
            throw new Error("Payment not found");
        }

        return deletedPayment;
    } catch (error) {
        throw new Error(`Error deleting payment: ${error.message}`);
    }
};
