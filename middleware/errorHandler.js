const { logEvents } = require("./logger");

const errorHandler = (err, req, res, nex) => {
  logEvents(`${err.name}\t${err.message}\t${req.headers.origin}`, "errLog.log");
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500; // server error

  res.status(status);

  res.json({ message: err.message });
};

module.exports = errorHandler;
