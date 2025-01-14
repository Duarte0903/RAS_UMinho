const Subscription = require('../models/subscription');
const mongoose = require('mongoose');

// Create a new subscription
module.exports.createSubscription = async (data) => {
    const { user_id, type, state } = data;

    const subscription = new Subscription({
        id: new mongoose.Types.ObjectId().toString(),
        user_id,
        type,
        state,
        inserted_at: new Date()
    });

    return await subscription.save();
};

// Get all subscriptions and sort by order (mostRecent or leastRecent)
module.exports.getAllSubscriptions = async (order) => {
    if (order === 'mostRecent') {
        return await Subscription.find().sort({ inserted_at: -1 }).exec();
    }
    return await Subscription.find().sort({ inserted_at: 1 }).exec();
};

// Get a subscription by ID
module.module.exports.getSubscriptionById = async (id) => {
    return await Subscription.findOne({ id }).exec();
};

// Get a subscription by user ID
module.exports.getSubscriptionByUserId = async (user_id) => {
    return await Subscription.findOne({ user_id }).exec();
}

// Get monthly subscriptions
module.exports.getMonthlySubscriptions = async () => {
    return await Subscription.find({ type: 'monthly' }).sort({ inserted_at: -1 }).exec();
}

// Get annual subscriptions
module.exports.getAnnualSubscriptions = async () => {
    return await Subscription.find({ type: 'annual' }).sort({ inserted_at: -1 }).exec();
}

// Get a subscriptions by day
module.exports.getSubscriptionByDay = async (day) => {
    return await Subscription.find({ inserted_at: { $gte: day, $lt: day + 1 } }).exec();
}

// Get a subscriptions by month
module.exports.getSubscriptionByMonth = async (month) => {
    return await Subscription.find({ inserted_at: { $gte: month, $lt: month + 1 } }).exec();
}

// Get a subscriptions by year
module.exports.getSubscriptionByYear = async (year) => {
    return await Subscription.find({ inserted_at: { $gte: year, $lt: year + 1 } }).exec();
}

// Get active subscriptions
module.exports.getActiveSubscriptions = async () => {
    return await Subscription.find({ state: 'active' }).sort({ inserted_at: -1 }).exec();
}

// Get inactive subscriptions
module.exports.getInactiveSubscriptions = async () => {
    return await Subscription.find({ state: 'inactive' }).sort({ inserted_at: -1 }).exec();
}

// Update a subscription by ID
module.exports.updateSubscription = async (id, updates) => {
    return await Subscription.findOneAndUpdate({ id }, updates, { new: true });
};

// Update a subscription by user_id
module.exports.updateSubscriptionByUserId = async (user_id, updates) => {
    return await Subscription.findOneAndUpdate({ user_id }, updates, { new: true });
}

// Delete a subscription by ID
module.exports.deleteSubscription = async (id) => {
    return await Subscription.findOneAndDelete({ id }).exec();
};

// Delete a subscription by user_id
module.exports.deleteSubscriptionByUserId = async (user_id) => {
    return await Subscription.findOneAndDelete({ user_id }).exec();
}

// Delete all subscriptions
module.exports.deleteAllSubscriptions = async () => {
    return await Subscription.deleteMany().exec();
}
