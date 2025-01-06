const express = require('express');
const router = express.Router(); // Create a new router instance

// Import controllers and middleware
const transactionController = require('../controllers/transactionController');
const webhookController = require('../controllers/webhookController');
const authMiddleware = require('../middleware/auth');

// Public route: Webhook (doesn't require authentication)
router.post('/webhook', webhookController.handleWebhook);

// Middleware: Protect routes below this line (require authentication)
router.use(authMiddleware);

// Protected routes
router.get('/transactions', transactionController.getAllTransactions); // Get all transactions 
router.get('/transactions/collect/:collectId', transactionController.getCollectTransactions); // Get transactions for a specific collect
router.get('/transactions/gateway/:gateway', transactionController.getGatewayTransactions); // Get transactions for a specific gateway
router.get('/transactions/school/:schoolId', transactionController.getSchoolTransactions); // Get transactions for a specific school
router.get('/transaction/status/:customOrderId', transactionController.checkTransactionStatus); // Check transaction status
router.post('/create-collect-request', transactionController.createPaymentRequest); // Create a payment request

module.exports = router; 
