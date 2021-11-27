export enum HttpCode {
  Ok = 200,
  Redirect = 302,
  NotFound = 404,
  BadRequest = 400,
  Unauthorized = 401,
  LargePayload = 413,
  ServerError = 500,
}

export class HttpError extends Error {
  public constructor(message: string, public readonly code: number) {
    super(message)
    this.name = this.constructor.name
  }
}

export enum ApiEndpoint {
  applications = "/applications",
  process = "/process",
  recent = "/recent",
  run = "/run",
  status = "/status",
}
