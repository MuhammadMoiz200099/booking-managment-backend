const { logger } = require("../../../common/logger");
const { manageError } = require("../../../helper/response.helper");
const AppointmentService = require("./user.service");
const BaseController = require("../_base.controller");

class Controller extends BaseController {
    async get(req, res) {
        try {
            const user = await AppointmentService.get();
            super.response(res, user, 200, "");
        } catch (error) {
            logger.error(error);
            const err = manageError(error);
            logger.error(`Error in creating user, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

    async create(req, res) {
        try {
            const user = await AppointmentService.create(req.body);
            super.response(res, user, 200, "User created Successfully!");
        } catch (error) {
            logger.error(error);
            const err = manageError(error);
            logger.error(`Error in creating user, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

    async getByID(req, res) {
        try {
            const user = await AppointmentService.getById(req.params.id);
            super.response(res, user, 200, "");
        } catch (error) {
            logger.error(error);
            const err = manageError(error);
            logger.error(`Error in creating user, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async getByUserID(req, res) {
        try {
            const user = await AppointmentService.getByUserID(req.params.id);
            super.response(res, user, 200, "");
        } catch (error) {
            logger.error(error);
            const err = manageError(error);
            logger.error(`Error in creating user, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

    async update(req, res) {
        try {
            const user = await AppointmentService.update(req.params.id, req.body);
            super.response(res, user, 200, "");
        } catch (error) {
            logger.error(error);
            const err = manageError(error);
            logger.error(`Error in creating user, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

    async delete(req, res) {
        try {
            const user = await AppointmentService.delete(req.params.id);
            super.response(res, user, 200, "");
        } catch (error) {
            logger.error(error);
            const err = manageError(error);
            logger.error(`Error in creating user, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

module.exports = new Controller();
