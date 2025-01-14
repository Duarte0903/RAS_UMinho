
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const subscriptionModel = require('../models/subscription')
const subscriptionController = require('../controllers/subscription');

// Create a new subscription
router.post('/', async (req, res) => {
    try {
        const subscription = await subscriptionController.createSubscription(req.body);
        res.status(201).json({ message: 'Subscription created successfully', subscription });
    } catch (error) {
        res.status(500).json({ message: 'Error creating subscription', error: error.message });
    }
});

// Get all subscriptions (with optional sorting order)
router.get('/', async (req, res) => {
    try {
        const order = req.query.order || 'mostRecent';
        const subscriptions = await subscriptionController.getAllSubscriptions(order);
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
});

// Get a subscription by ID
router.get('/:id', async (req, res) => {
    try {
        const subscription = await subscriptionController.getSubscriptionById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscription', error: error.message });
    }
});

// Get a subscription by user ID
router.get('/user/:user_id', async (req, res) => {
    try {
        const subscription = await subscriptionController.getSubscriptionByUserId(req.params.user_id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscription', error: error.message });
    }
});

// Get subscriptions by type
router.get('/type/monthly', async (req, res) => {
    try {
        const subscriptions = await subscriptionController.getMonthlySubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
});

router.get('/type/annual', async (req, res) => {
    try {
        const subscriptions = await subscriptionController.getAnnualSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
});

// Get subscriptions by day, month, or year
router.get('/date/day/:day', async (req, res) => {
    try {
        const subscriptions = await subscriptionController.getSubscriptionByDay(new Date(req.params.day));
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
});

router.get('/date/month/:month', async (req, res) => {
    try {
        const subscriptions = await subscriptionController.getSubscriptionByMonth(new Date(req.params.month));
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
});

router.get('/date/year/:year', async (req, res) => {
    try {
        const subscriptions = await subscriptionController.getSubscriptionByYear(new Date(req.params.year));
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
});

// Get active subscriptions
router.get('/state/active', async (req, res) => {
    try {
        const subscriptions = await subscriptionController.getActiveSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
});

// Get inactive subscriptions
router.get('/state/inactive', async (req, res) => {
    try {
        const subscriptions = await subscriptionController.getInactiveSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
});

// Update a subscription by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedSubscription = await subscriptionController.updateSubscription(req.params.id, req.body);
        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription updated successfully', subscription: updatedSubscription });
    } catch (error) {
        res.status(500).json({ message: 'Error updating subscription', error: error.message });
    }
});

// Update a subscription by user ID
router.put('/user/:user_id', async (req, res) => {
    try {
        const updatedSubscription = await subscriptionController.updateSubscriptionByUserId(req.params.user_id, req.body);
        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription updated successfully', subscription: updatedSubscription });
    } catch (error) {
        res.status(500).json({ message: 'Error updating subscription', error: error.message });
    }
});

// Delete a subscription by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedSubscription = await subscriptionController.deleteSubscription(req.params.id);
        if (!deletedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscription', error: error.message });
    }
});

// Delete a subscription by user ID
router.delete('/user/:user_id', async (req, res) => {
    try {
        const deletedSubscription = await subscriptionController.deleteSubscriptionByUserId(req.params.user_id);
        if (!deletedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscription', error: error.message });
    }
});

// Delete all subscriptions
router.delete('/', async (req, res) => {
    try {
        await subscriptionController.deleteAllSubscriptions();
        res.status(200).json({ message: 'All subscriptions deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscriptions', error: error.message });
    }
});

module.exports = router;
