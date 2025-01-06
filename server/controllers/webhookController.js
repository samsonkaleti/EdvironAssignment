const transactionService = require('../services/transactionService');

const handleWebhook = async (req, res, next) => {
    try {
        const result = await transactionService.handleWebhook(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleWebhook
};
