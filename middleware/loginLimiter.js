const rateLimit = require("express-rate-limit");
// const { options } = require("../routes/userRoutes");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many login attemps from this IP, please try again after 60 second pause",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too many Request : ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origins}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standarHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
