
/**
 * Base exception for all TwitterClient exceptions
 */
export class TwitterClientException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TwitterClientException';
        Object.setPrototypeOf(this, TwitterClientException.prototype);
    }
}

/**
 * Exception for user errors, such as missing required parameters
 */
export class TwitterClientUserException extends TwitterClientException {
    constructor(message: string) {
        super(message);
        this.name = 'TwitterClientUserException';
        Object.setPrototypeOf(this, TwitterClientUserException.prototype);
    }
}

/**
 * Exception for API errors
 * @module TwitterClientAPIException
 */
export class TwitterClientAPIException extends TwitterClientException {
    status: number;
    body: any;
    path: string;
    constructor(status: number, message: string, path: string, body: any) {
        super(`[STATUS ${status}]: ${message}`);
        this.status = status;
        this.body = body;
        this.path = path;
        this.name = 'TwitterClientAPIException';
        Object.setPrototypeOf(this, TwitterClientAPIException.prototype);
    }
}

export class NonRefreshableCredentialsException extends TwitterClientException {
    constructor(message: string) {
        super(message);
        this.name = 'NonRefreshableCredentialsException';
        Object.setPrototypeOf(this, NonRefreshableCredentialsException.prototype);
    }
}

export class ExpiredRefreshTokenException extends NonRefreshableCredentialsException {
    expiredAt: number;
    constructor(expiredAt: number) {
        const nowDate = new Date(expiredAt * 1000);
        super('Refresh token expired at ' + nowDate.toISOString());
        this.expiredAt = expiredAt;
        this.name = 'ExpiredRefreshTokenException';
        Object.setPrototypeOf(this, ExpiredRefreshTokenException.prototype);
    }
}