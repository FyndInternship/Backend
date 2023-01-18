const handle_custom_error = (err, req, res, next) => {
    console.log("Middleware Error Handling");
    const errStatus = err.status || 500;
    const errMsg = err.message || "Something went wrong";
    console.log("Error Handler: ", errStatus, errMsg);
    res.status(errStatus).json({
      success: false,
      status: errStatus,
      message: errMsg,
      stack: process.env.ENV === "LOCAL" ? err.stack : {},
    });
  };
  
  const page_not_found_error = (req, res) => {
    res.status(404).json({
      success: false,
      status: 404,
      message: "Page Not Found",
    });
  };
  const authenticationError = () => {
    const err = new Error()
    err.status = 401
    err.message = "Authentication error"
    return err;
  }
  
  module.exports = { handle_custom_error, page_not_found_error, authenticationError};