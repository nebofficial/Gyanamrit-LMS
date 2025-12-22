export const STATUS = {
  SUCCESS: "success",
  FAIL: "fail",
  ERROR: "error",
};

export const MSG = {
  // Auth
  AUTH_REQUIRED: "Authentication required.",
  UNAUTHORIZED: "Unauthorized",
  LOGIN_SUCCESS: "Login successful.",
  REGISTER_SUCCESS: "Registration successful.",

  INVALID_CREDENTIALS: "Invalid email or password.",
  PASSWORD_NOT_MATCH: "Passwords do not match.",
  CONFIRM_PASSWORD_NOT_MATCH: "Confirm Password do not match",
  PASSWORD_REGEX_ERROR:
    "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.",
  EMAIL_ALREADY_EXISTS: "Email already registered.",
  USER_NOT_FOUND: "User not found.",

  // Single
  UPDATE_SUCCESS: "Update Successfully",
  FETCH_SUCCESS: "Fetch Successfully",
  DELETE_SUCCESS: "Deleted Successfully",
  ADD_SUCCESS: "Add Successfully",

  // Course
  COURSE_CREATED: "Course created successfully.",
  COURSE_UPDATED: "Course updated successfully.",
  COURSE_DELETED: "Course deleted successfully.",
  COURSE_NOT_FOUND: "Course not found.",
  ACCESS_DENIED: "Access denied.",

  // Instructor
  INSTRUCTOR_ONLY: "Only instructors can perform this action.",

  // Admin
  ADMIN_ONLY: "Admin access only.",
  USER_UPDATED: "User updated successfully.",
  USER_DELETED: "User deleted successfully.",

  // Payment
  PAYMENT_PENDING: "Payment pending confirmation.",
  PAYMENT_CONFIRMED: "Payment confirmed.",

  // General
  REQUIRED_FIELDS: "All fields are required.",
  INVALID_DATA: "Invalid data.",
  SERVER_ERROR: "Internal server error.",
};

export const HTTP = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,

  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_CODE = {
  USER_ALREADY_EXIST: "GM-000X1F",
  INVALID_LOGIN: "GM-000X2A",
  AUTH_REQUIRED: "GM-000X3C",
  PERMISSION_DENIED: "GM-000X4D",

  COURSE_NOT_FOUND: "GM-000C1A",
  COURSE_ACCESS_DENIED: "GM-000C2B",

  PAYMENT_REQUIRED: "GM-000P1A",
  PAYMENT_PENDING: "GM-000P2B",

  SERVER_ERROR: "GM-000S1E",
};
