const { logger } = require("../../../common/logger");
const { manageError } = require("../../../helper/response.helper");
const AuthService = require("./auth.service");
const HelperService = require("../../../services/helper.service");
const BaseController = require("../_base.controller");

class Controller extends BaseController {
    async login(req, res) {
        try {
            const response = await AuthService.login(req.body);
            res.cookie('token', response.accessToken);
            super.response(res, response, 200, "");
        } catch (error) {
            logger.error(error);
            const err = manageError(error);
            logger.error(`Error in login, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getLoggedInUser(req, res) {
        try {
            super.response(res, HelperService.tranformMeData(req.user.toJSON(), req.cookies.token), 200, "");
        } catch (error) {
            logger.error(error);
            const err = manageError(error);
            logger.error(`Error in login, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async forgotPassword(req, res) {
        try {
            const user = await AuthService.forgotPassword(req.body);
            super.response(res, user, 200, "Email sent Successfully!");
        } catch (error) {
            logger.error(error);
            const err = manageError(error);
            logger.error(`Error in sending email for resetting password, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async resetPassword(req, res) {
        try {
            const user = await AuthService.resetPassword(req.body.token, req.body.password);
            super.response(res, user, 200, "Password reset Successfully!");
        } catch (error) {
            logger.error(error);
            const err = manageError(error);
            logger.error(`Error in resetting password, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

module.exports = new Controller();
