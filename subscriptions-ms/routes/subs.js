const express = require('express');
const router = express.Router();
const subsController = require('../controllers/subs');
const { extract_user } = require('../utils/utils');

// Get all subscriptions
router.get('/', extract_user, async (req, res) => {
    try {
        const subscriptions = await subsController.getSubscription(req.user.sub);
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
});

// Create a new subscription
router.post('/', extract_user, async (req, res) => {
    try {
        const subscription = await subsController.createSubscription(req.user.sub, req.body);
        res.status(201).json({ message: 'Subscription created successfully', subscription });
    } catch (error) {
        res.status(500).json({ message: 'Error creating subscription', error: error.message });
    }
});

// Update a subscription by ID
router.put('/:subs_id', extract_user, async (req, res) => {
    try {
        const updatedSubscription = await subsController.updateSubscription(
            req.params.subs_id, 
            req.user.sub, 
            req.body
        );
        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription updated successfully', subscription: updatedSubscription });
    } catch (error) {
        res.status(500).json({ message: 'Error updating subscription', error: error.message });
    }
});

// Delete a subscription by ID
router.delete('/:subs_id', extract_user, async (req, res) => {
    try {
        const deletedSubscription = await subsController.deleteSubscription(req.params.subs_id, req.user.sub);
        if (!deletedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscription', error: error.message });
    }
});


// ---------------- PAYMENTS ---------------------


// Get all payments
router.get('/:subs_id/payments', extract_user, async (req, res) => {
    try {
        const payments = await subsController.getPayments(req.params.subs_id, req.user.sub);
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
});

// Create a new payment
router.post('/:subs_id/payments', extract_user, async (req, res) => {
    try {
        const payment = await subsController.createPayment(req.user.sub, req.params.subs_id, req.body);
        res.status(201).json({ message: 'Payment created successfully', payment: payment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment', error: error.message });
    }
});

// Update a payment by ID
router.put('/:subs_id/payments/:pay_id', extract_user, async (req, res) => {
    try {
        const updatedPayment = await subsController.updatePayment(
            req.params.subs_id,
            req.params.pay_id,
            req.user.sub, 
            req.body
        );
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment updated successfully', payment: updatedPayment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
});

// Delete a payment by ID
router.delete('/:subs_id/payments/:pay_id', extract_user, async (req, res) => {
    try {
        const deletedPayment = await subsController.deletePayment(req.params.subs_id, req.params.pay_id, req.user.sub);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscription', error: error.message });
    }
});


module.exports = router;
