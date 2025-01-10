const express = require('express');
const router = express.Router(); 

const transactionController = require('../controllers/transactionController');
const webhookController = require('../controllers/webhookController');
const authMiddleware = require('../middleware/auth');

router.post('/webhook', webhookController.handleWebhook); 
router.post('/update-status', webhookController.updateTransactionStatus);


router.use(authMiddleware);

router.get('/transactions', transactionController.getAllTransactions); 
router.get('/transactions/collect/:collectId', transactionController.getCollectTransactions); 
router.get('/transactions/gateway/:gateway', transactionController.getGatewayTransactions); 
router.get('/transactions/:schoolId', transactionController.getSchoolTransactions); 

router.get('/transactions/status/:customOrderId', transactionController.checkTransactionStatus);  
router.get('/transactions/:status', transactionController.getStatusTransactions);  
router.get('/transactions/:amount', transactionController.getOrderAmountTransactions);   
router.get('/transactions/transaction-amount/:amount', transactionController.getTransationAmountTransactions);




router.post('/create-payment', transactionController.createPaymentRequest); 


module.exports = router; 
