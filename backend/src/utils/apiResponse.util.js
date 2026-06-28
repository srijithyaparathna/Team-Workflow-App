
// A helper for successful API responses
export const success = (res, data = null, message = 'OK', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

// A helper for failed API responses
export const failure = (res, message = 'Something went wrong', statusCode = 400) =>
  res.status(statusCode).json({ success: false, message });
