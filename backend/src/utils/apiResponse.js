export const successResponse = ({ message, data = null, meta = null }) => ({
  success: true,
  message,
  data,
  meta
});

export const errorResponse = ({ message, errors = null }) => ({
  success: false,
  message,
  errors
});
