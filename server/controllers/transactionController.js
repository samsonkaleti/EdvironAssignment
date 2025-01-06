const transactionService = require('../services/transactionService');

const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionService.getAllTransactions(req.query);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
}; 
const getCollectTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionService.getCollectTransactions(req.params.collectId);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};  

const getGatewayTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionService.getGatewayTransactions(req.params.gateway);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};

const getSchoolTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionService.getSchoolTransactions(req.params.schoolId);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};

const checkTransactionStatus = async (req, res, next) => {
    try {
        const transaction = await transactionService.checkTransactionStatus(req.params.customOrderId);
        res.json(transaction);
    } catch (error) {
        next(error);
    }
};

const createPaymentRequest = async (req, res, next) => {
    try {
        const result = await transactionService.createPaymentRequest(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTransactions,
    getCollectTransactions,
    getGatewayTransactions,
    getSchoolTransactions,
    checkTransactionStatus,
    createPaymentRequest
};
