const express = require('express');
const path = require('path');
const http = require('http');
const os = require('os');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const l = require('./logger');

const app = express();

const corsOptions = {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Credentials'
};

class ExpressServer {
    constructor() {
        const root = path.normalize(__dirname + '/../..');
        app.use(express.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
        app.use(
            express.urlencoded({
                extended: true,
                limit: process.env.REQUEST_LIMIT || '100kb',
            })
        );
        app.use(express.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
        app.use(cookieParser('', {
            maxAge: 60 * 60 * 24 * 14 * 1000,
            httpOnly: true
        }));
        app.use(express.static(`${root}/server/dist`));
        app.use(cors(corsOptions));
    }

    router(routes) {
        this.routes = routes;
        return this;
    }

    listen(port) {
        const welcome = (p) => () =>
            l.info(
                `up and running in ${'production'
                } @: ${os.hostname()} on port: ${p}}`
            );
        this.routes(app);
        http.createServer(app).listen(port, welcome(port));
        return app;
    }
}

module.exports = ExpressServer;