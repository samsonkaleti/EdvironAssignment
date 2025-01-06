const CollectRequest = require('../models/CollectRequest');
const CollectRequestStatus = require('../models/CollectRequestStatus');
const axios = require('axios');

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

    const response = await axios.post(
        'https://dev-vanilla.edviron.com/erp/create-collect-request',
        {
            school_id: data.school_id,
            pg_key: 'edvtest01',
            collect_id: collectRequest._id,
            custom_order_id: collectRequest.custom_order_id,
            amount: data.amount
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return {
        success: true,
        collect_id: collectRequest._id,
        payment_link: response.data.payment_link
    };
};

const handleWebhook = async (data) => {
    const { order_info } = data;
    return await CollectRequestStatus.create({
        collect_id: order_info.order_id,
        status: data.status === 200 ? 'SUCCESS' : 'FAILED',
        payment_method: order_info.payment_method,
        gateway: order_info.gateway,
        transaction_amount: order_info.transaction_amount,
        bank_reference: order_info.bank_reference
    });
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
    getSchoolTransactions,
    checkTransactionStatus,
    createPaymentRequest,
    handleWebhook
};
