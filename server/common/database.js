const mongoose = require("mongoose");
const { logger, l } = require("./logger");

mongoose.Promise = global.Promise;

let isConnected = false;

const dbOption = {
};

function connectDB() {
    return new Promise((resolve, reject) => {
        mongoose.connection.on('connected', function () {
            l.info('Mongoose successfully connected');
            isConnected = true;
            resolve(mongoose.connection);
        });

        mongoose.connection.on('error', function (err) {
            logger.error(err);
            l.error(`Mongoose default connection has occurred error ${err}`);
        });

        mongoose.connection.on('disconnected', function () {
            l.warn('Mongoose connection disconnected');
        });

        // Close the Mongoose connection If the Node process ends
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                console.log("Mongoose default connection is disconnected due to application termination");
                process.exit(0);
            });
        });

        try {
            const MONGO_URI = process.env.MONGODB_URI;
            mongoose.connect(MONGO_URI, dbOption);
        }
        catch (err) {
            logger.error(err);
            console.log(err);
        }
    });
}

module.exports = { connectDB };