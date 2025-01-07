const express = require('express');
const router = express.Router(); // Create a new router instance

// Import controllers and middleware
const transactionController = require('../controllers/transactionController');
const webhookController = require('../controllers/webhookController');
const authMiddleware = require('../middleware/auth');

// Public route: Webhook (doesn't require authentication)
router.post('/webhook', webhookController.handleWebhook); 
router.post('/update-status', webhookController.updateTransactionStatus);


// Middleware: Protect routes below this line (require authentication)
router.use(authMiddleware);

// Protected routes
router.get('/transactions', transactionController.getAllTransactions); 
router.get('/transactions/collect/:collectId', transactionController.getCollectTransactions); 
router.get('/transactions/gateway/:gateway', transactionController.getGatewayTransactions); 
router.get('/transactions/school/:schoolId', transactionController.getSchoolTransactions); 

router.get('/transactions/status/:customOrderId', transactionController.checkTransactionStatus);  
router.get('/transactions/status/filter/:status', transactionController.getStatusTransactions);  
router.get('/transactions/amount/:amount', transactionController.getOrderAmountTransactions);   
router.get('/transactions/transaction-amount/:amount', transactionController.getTransationAmountTransactions);




router.post('/create-collect-request', transactionController.createPaymentRequest); 


module.exports = router; 
