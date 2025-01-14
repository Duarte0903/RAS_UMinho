const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment');

// Create a new payment
router.post('/', async (req, res) => {
    try {
        const payment = await paymentController.createPayment(req.body);
        res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment', error: error.message });
    }
});

// Get all payments
router.get('/', async (req, res) => {
    try {
        const payments = await paymentController.getAllPayments();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
});

// Get a payment by ID
router.get('/:id', async (req, res) => {
    try {
        const payment = await paymentController.getPaymentById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment', error: error.message });
    }
});

// Get payments by subscription ID
router.get('/subscription/:subscription_id', async (req, res) => {
    try {
        const payments = await paymentController.getPaymentsBySubscriptionId(req.params.subscription_id);
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
});

// Update a payment by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedPayment = await paymentController.updatePayment(req.params.id, req.body);
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment updated successfully', payment: updatedPayment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
});

// Delete a payment by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPayment = await paymentController.deletePayment(req.params.id);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error: error.message });
    }
});

// Delete all payments for a subscription ID
router.delete('/subscription/:subscription_id', async (req, res) => {
    try {
        await paymentController.deletePaymentsBySubscriptionId(req.params.subscription_id);
        res.status(200).json({ message: 'All payments for the subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payments', error: error.message });
    }
});

// Delete all payments
router.delete('/', async (req, res) => {
    try {
        await paymentController.deleteAllPayments();
        res.status(200).json({ message: 'All payments deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payments', error: error.message });
    }
});

module.exports = router;


