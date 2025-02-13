import {
    TWITTER_API_URL,
    SIX_MONTH_TIME
} from '../constant';
import { TwitterCredentials } from '../type/resp';
import { OnTwitterCredentialsUpdateFunction } from '../type/auth';
import {
    TwitterClientException,
    NonRefreshableCredentialsException,
    ExpiredRefreshTokenException,
} from '../exception';
import {
    checkTwitterResponse,
    setQueryParams
} from '../util/http';

export interface ClientOptions {
    clientID?: string,
    clientSecret?: string,
    apiURL?: string,
    onCredentialsUpdateFunction?: OnTwitterCredentialsUpdateFunction
}

interface internalClientOptions extends ClientOptions {
    pathPrefix?: string,
}

export class BaseClient {
    private _accountID: string;
    private _clientID?: string;
    private _clientSecret?: string;
    private _credentials: TwitterCredentials;
    private _apiURL: string;

    private onCredentialsUpdate?: OnTwitterCredentialsUpdateFunction;

    constructor(
        accountID: string,
        credentials: TwitterCredentials,
        options?: internalClientOptions
    ) {
        this._accountID = accountID;
        this._credentials = credentials;
        const baseAPIURL = options?.apiURL ?? TWITTER_API_URL;
        if (options) {
            if ((options.clientID?.length ?? 0) ^ (options.clientSecret?.length ?? 0))
                throw new TwitterClientException('clientID and clientSecret must be both set or both unset');
            this._clientID = options.clientID;
            this._clientSecret = options.clientSecret;
            this._apiURL = baseAPIURL + (options.pathPrefix ?? '');
        } else {
            this._apiURL = baseAPIURL;
        }
    }

    public get accountID(): string {
        return this._accountID;
    }

    public get clientID(): string | undefined {
        return this._clientID;
    }

    /**
     * Customized fetch function to add twitter credentials to the request
     * 
     * @param input 
     * @param init 
     * @returns {Promise<Response>} Response object fetch
     */
    async fetch(
        input: RequestInfo | URL,
        init?: RequestInit
    ): Promise<Response> {
        const credentials = await this.getOrRefreshCredentials();
        const bearerAuthorizationStr = `Bearer ${credentials.access_token}`
        const newInit = { ...init }
        
        newInit.headers = {
            ...newInit.headers,
            Authorization: bearerAuthorizationStr
        }
        if (!(newInit.body instanceof FormData)) {
            if (newInit.body instanceof URLSearchParams) {
                // @ts-ignore
                newInit.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            } else {
                // @ts-ignore
                newInit.headers['Content-Type'] = 'application/json';
            }
        }
        
        const resp = await fetch(input, newInit);
        await checkTwitterResponse(resp);
        return resp;
    }

    /**
     * Refresh the credentials and return it
     * 
     * @returns TwitterCredentials
     * 
     * @throws {NonRefreshableCredentialsException}
     * This generic exception is thrown if the credentials is not refreshable
     * 
     * @throws {ExpiredRefreshTokenException}
     * This specific exception is thrown if the refresh token is expired
     * 
     * @throws {TwitterClientAPIException}
     * Thrown if the Twitter API refused to refresh the token
     */
    async refreshCredentials(): Promise<TwitterCredentials> {
        if (!this._clientID || !this._clientSecret) {
            throw new TwitterClientException('client ID or client secret not found');
        }
        if (!this._credentials.refresh_token) {
            throw new NonRefreshableCredentialsException('no refresh token found');
        }
        if (!this._credentials.created_at) {
            throw new NonRefreshableCredentialsException('no created_at timestamp found');
        }
        const now = Math.floor(Date.now() / 1000);
        const expiredAt = this._credentials.created_at + SIX_MONTH_TIME;
        if (expiredAt < now) {
            throw new ExpiredRefreshTokenException(expiredAt);
        }

        const twitterBasicAuthToken = btoa(`${this._clientID}:${this._clientSecret}`)
        
        const oauthURL = new URL(TWITTER_API_URL);
        oauthURL.pathname += '/oauth2/token'
        const tokenResp = await fetch(oauthURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${twitterBasicAuthToken}`
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: this._clientID,
                refresh_token: this._credentials.refresh_token,
            })
        })
        await checkTwitterResponse(tokenResp);
        
        const credentials = await tokenResp.json() as TwitterCredentials
        credentials.created_at = Math.floor(Date.now() / 1000);
        this._credentials = credentials;

        if (this.onCredentialsUpdate) {
            await this.onCredentialsUpdate(this.accountID, credentials);
        }

        return credentials;
    }

    /**
     * Get existing credentials or refresh the credentials then return it
     * 
     * @returns {TwitterCredentials} New or existing credentials
     */
    async getOrRefreshCredentials(): Promise<TwitterCredentials> {
        const expireAt = (this._credentials.created_at || 0) + this._credentials.expires_in;
        const now = Math.floor(Date.now() / 1000) + 10;
        if (expireAt > now) return this._credentials;
        return this.refreshCredentials();
    }

    getFullURL(
        path?: string,
        params?: Record<string, any>,
        requiredParams?: Iterable<string>
    ): URL {
        const url = new URL(this._apiURL);
        url.pathname += path
        setQueryParams(url.searchParams, params, requiredParams);
        return url;
    }
}