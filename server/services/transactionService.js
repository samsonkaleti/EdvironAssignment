const CollectRequest = require('../models/CollectRequest');
const CollectRequestStatus = require('../models/CollectRequestStatus');
const axios = require('axios'); 
const mongoose = require('mongoose'); 
require('dotenv').config();

const getAllTransactions = async (filters = {}) => {
    const query = filters.status ? { status: filters.status } : {};
    const collectRequests = await CollectRequest.find();

    const transactions = await Promise.all(
        collectRequests.map(async (request) => {
            const status = await CollectRequestStatus.findOne({ collect_id: request._id.toString(), ...query });
            return status ? mergeTransactionData(request, status) : null;
        })
    );

    return transactions.filter(Boolean);
}; 

const getCollectTransactions = async (collectId) => {
    // Use findOne instead of findById
    const status = await CollectRequestStatus.findOne({ collect_id: collectId });
    if (!status) throw new Error('Transaction not found');

    // Fetch the corresponding CollectRequest
    const request = await CollectRequest.findById(collectId);
    if (!request) throw new Error('CollectRequest not found');

    return mergeTransactionData(request, status);
};


const getGatewayTransactions = async (gateway) => {
    const requests = await CollectRequest.find({ gateway });
    return Promise.all(
        requests.map(async (request) => {
            const status = await CollectRequestStatus.findOne({ gateway: request.gateway});
            return mergeTransactionData(request, status);
        })
    );
}; 

const getOrderAmountTransactions = async (orderAmount) => {
    const requests = await CollectRequest.find({ order_amount: orderAmount });
    return Promise.all(
        requests.map(async (request) => {
            const status = await CollectRequestStatus.findOne({ order_amount: request.order_amount});
            return mergeTransactionData(request, status);
        })
    );
}; 

const getTransationAmountTransactions = async (transactionAmount) => {
    const data = await CollectRequestStatus.find({ transaction_amount: transactionAmount }); 
    if (!data.length) return []; 
    
    return data

    
};

const getStatusTransactions = async (status) => {
    const statusRecords = await CollectRequestStatus.find({ status });
    if (!statusRecords.length) return []; 

    const collectIds = statusRecords.map((record) => record.collect_id);

    const collectRequests = await CollectRequest.find({ _id: { $in: collectIds } });

    return collectRequests.map((request) => {
        const status = statusRecords.find((s) => s.collect_id === request._id.toString());
        return mergeTransactionData(request, status);
    });
};

const getCustomeOrdrIdTransactions = async (customOrderId) => {
    const requests = await CollectRequest.find({ custom_order_id: customOrderId });
    return Promise.all(
        requests.map(async (request) => {
            const status = await CollectRequestStatus.findOne({ collect_id: request._id.toString() });
            return mergeTransactionData(request, status);
        })
    );
};




const getSchoolTransactions = async (schoolId) => {
    const collectRequests = await CollectRequest.find({ school_id: schoolId });
    return Promise.all(
        collectRequests.map(async (request) => {
            const status = await CollectRequestStatus.findOne({ collect_id: request._id.toString() });
            return mergeTransactionData(request, status);
        })
    );
}; 




const checkTransactionStatus = async (customOrderId) => {
    const request = await CollectRequest.findOne({ custom_order_id: customOrderId });
    if (!request) throw new Error('Transaction not found');

    const status = await CollectRequestStatus.findOne({ collect_id: request._id.toString() });
    return mergeTransactionData(request, status);
};

const createPaymentRequest = async (data) => {
    const collectRequest = await CollectRequest.create({
        school_id: data.school_id,
        trustee_id: data.trustee_id,
        gateway: 'CASHFREE',
        order_amount: data.amount,
        custom_order_id: `ORD_${Date.now()}`
    }); 


    const payload = {
        school_id: data.school_id, // Use SCHOOL_ID from the request body
        pg_key: process.env.PG_KEY,
        collect_id: collectRequest._id,
        custom_order_id: collectRequest.custom_order_id,
        amount: data.amount
    };

    const response = await axios.post(
        'https://dev-vanilla.edviron.com/erp/create-collect-request',
        payload,
        {
            headers: {
                Authorization: `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    ); 
    // Save the transaction status in CollectRequestStatus
    await CollectRequestStatus.create({
        collect_id: collectRequest._id,
        status: 'PENDING', // Initial status
        gateway: 'CASHFREE',
        transaction_amount: null,
        bank_reference: null
    });


    return {
        success: true,
        collect_id: collectRequest._id,
        payment_link: response.data.payment_link
    };
};

const handleWebhook = async (data) => {
    try {
        const { order_info } = data;

        if (!order_info || !order_info.order_id) {
            throw new Error('Invalid webhook payload: Missing order_info or order_id');
        }

        // Find the transaction by custom_order_id
        const existingTransaction = await CollectRequest.findOne({
            custom_order_id: order_info.order_id
        });

        if (!existingTransaction) {
            throw new Error(`Transaction with ID ${order_info.order_id} not found`);
        }

        // Update or create the transaction status
        // Note that collect_id is stored as String
        const updatedStatus = await CollectRequestStatus.findOneAndUpdate(
            { collect_id: existingTransaction._id.toString() },
            {
                status: data.status === 200 ? 'SUCCESS' : 'FAILED',
                payment_method: order_info.payment_method,
                gateway: order_info.gateway || existingTransaction.gateway,
                transaction_amount: order_info.transaction_amount,
                bank_refrence: order_info.bank_reference  // Note: incoming payload uses reference, model uses refrence
            },
            { upsert: true, new: true }
        );

        return updatedStatus;
    } catch (error) {
        console.error('Error handling webhook:', error);
        throw error;
    }
};



const updateTransactionStatus = async (data) => {
    try {
        const { transactionId, status, payment_method, bank_refrence } = data;

        // Find the transaction by custom_order_id
        const existingTransaction = await CollectRequest.findOne({
            custom_order_id: transactionId
        });

        if (!existingTransaction) {
            throw new Error(`Transaction with ID ${transactionId} not found`);
        }

        // Update the status
        const updatedStatus = await CollectRequestStatus.findOneAndUpdate(
            { collect_id: existingTransaction._id.toString() },
            {
                status: status.toUpperCase(),
                ...(payment_method && { payment_method }),
                gateway: existingTransaction.gateway, 
                ...(bank_refrence && { bank_refrence })
            },
            { upsert: true, new: true }
        );

        return updatedStatus;
    } catch (error) {
        console.error('Error updating transaction status:', error);
        throw error;
    }
};








const mergeTransactionData = (request, status) => ({
    collect_id: request._id,
    school_id: request.school_id,
    gateway: request.gateway,
    order_amount: request.order_amount,
    transaction_amount: status?.transaction_amount,
    status: status?.status || 'PENDING',
    custom_order_id: request.custom_order_id,
    payment_method: status?.payment_method,
    bank_reference: status?.bank_reference,
    created_at: request.createdAt
});

module.exports = {
    getAllTransactions,
    getCollectTransactions,
    getGatewayTransactions,
    getOrderAmountTransactions,
    getTransationAmountTransactions,
    getStatusTransactions,
    getCustomeOrdrIdTransactions,
    getSchoolTransactions,
    checkTransactionStatus,
    createPaymentRequest,
    handleWebhook,
    updateTransactionStatus
};
