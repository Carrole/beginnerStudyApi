class HttpError extends Error {
  constructor(message, cause, errorCode) {
    super(message);
    this.cause = cause;
    this.code = errorCode;

    if (!this.cause) {
      this.cause = message;
    }
  }
}

module.exports = HttpError;
