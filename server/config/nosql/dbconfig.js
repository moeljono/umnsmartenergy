/*
Defining MongoDB connection
*/

var mongoose = require("mongoose");
var gracefulShutdown;
var dbURI = "mongodb://localhost/db_umnsmartenergy";
// if (process.env.NODE_ENV === 'production') {
//   dbURI = process.env.MONGOLAB_URI;
// }

// Set mongoose setting - to avoid deprecated APIs
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.connect(dbURI);

// CONNECTION EVENTS - check connection
mongoose.connection.on("connected", function () {
  console.log("Mongoose connected to " + dbURI);
});
mongoose.connection.on("error", function (err) {
  console.log("Mongoose connection error: " + err);
});
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose disconnected");
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected through " + msg);
    callback();
  });
};
// For nodemon restarts
process.once("SIGUSR2", function () {
  gracefulShutdown("nodemon restart", function () {
    process.kill(process.pid, "SIGUSR2");
  });
});
// For app termination
process.on("SIGINT", function () {
  gracefulShutdown("app termination", function () {
    process.exit(0);
  });
});
// For Heroku app termination
process.on("SIGTERM", function () {
  gracefulShutdown("Heroku app termination", function () {
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS (not sure why)
require("./models/devices.js");
