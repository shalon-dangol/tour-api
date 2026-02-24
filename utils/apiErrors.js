const apiError = (message, statusCode) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  error.isOperational = true;

  // removes createAppError itself from the stack trace
  Error.captureStackTrace(error, apiError);

  return error;
};

export default apiError;
