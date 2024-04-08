const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { User } = require("../models");
const { BaseController } = require('../api/v1/_base.controller');
const { compose } = require('compose-middleware');

const validateJwt = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
});

function isAuthenticated() {
    return compose([
        function (req, res, next) { 
            if (typeof req.headers.authorization === 'undefined') {
                req.headers.authorization = `Bearer ${req.cookies.token}`;
            }
            validateJwt(req, res, next);
        },
        async function (req, res, next) { 
            try {
                const user = await User.findOne({ _id: req.user.id });
                if (!user) {
                    return BaseController.prototype.response(res, {}, 401, "Not Authorized");
                }
                req.user = user;
                next();
                return null;
            } catch (error) {
                return BaseController.prototype.response(res, {}, 401, "Not Authorized");
            }
        }
    ]);
}

function signToken(id, role) {
    return jwt.sign({ _id: id, role }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 5
    });
}

module.exports = { isAuthenticated, signToken };
