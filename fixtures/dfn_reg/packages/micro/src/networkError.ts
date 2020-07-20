export class NetworkError extends Error {
  statusCode: number;
  constructor(statusCode: number = 500, message: string = "Internal server error") {
    super(message);
    this.statusCode = statusCode;
  }
}
