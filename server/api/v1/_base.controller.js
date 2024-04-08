class BaseController {
    /**
     * Response creator
     * @param  {Response} res
     * @param  {any} data
     * @param  {number} statusCode
     * @param  {string} message
     */
    response(res, data, statusCode, message) {
        let responseObject = {};
        responseObject.data = data || '';
        responseObject.message = message || '';
        return res.status(statusCode).json(responseObject);
    }
}

module.exports = BaseController;
