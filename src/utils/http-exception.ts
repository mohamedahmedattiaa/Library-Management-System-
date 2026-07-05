export class HttpException extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message = "Bad request") {
    return new HttpException(400, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new HttpException(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new HttpException(403, message);
  }

  static notFound(message = "Not found") {
    return new HttpException(404, message);
  }

  static conflict(message = "Conflict") {
    return new HttpException(409, message);
  }

  static tooManyRequests(message = "Too many requests") {
    return new HttpException(429, message);
  }

  static internal(message = "Internal server error") {
    return new HttpException(500, message);
  }
}
