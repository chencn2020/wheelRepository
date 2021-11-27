export declare enum HttpCode {
    Ok = 200,
    Redirect = 302,
    NotFound = 404,
    BadRequest = 400,
    Unauthorized = 401,
    LargePayload = 413,
    ServerError = 500
}
export declare class HttpError extends Error {
    readonly code: number;
    constructor(message: string, code: number);
}
export declare enum ApiEndpoint {
    applications = "/applications",
    process = "/process",
    recent = "/recent",
    run = "/run",
    status = "/status"
}
