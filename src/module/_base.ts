import {
    TWITTER_API_URL,
    SIX_MONTH_TIME
} from '../constant';
import { TwitterCredentials } from '../schema';
import { TwitterCredentialsUpdateFunction } from '../type';
import {
    TwitterClientException,
    NonRefreshableCredentialsException,
    ExpiredRefreshTokenException,
} from '../exception';
import {
    checkTwitterResponse,
    setQueryParams
} from '../util/http';

export class BaseClient {
    private accountID: string;
    private clientID?: string;
    private clientSecret?: string;
    private credentials: TwitterCredentials;

    private credentialsUpdate?: TwitterCredentialsUpdateFunction;

    constructor(
        accountID: string,
        credentials: TwitterCredentials,
        clientID?: string,
        clientSecret?: string,
        credentialsUpdateFunction?: TwitterCredentialsUpdateFunction
    ) {
        if ((clientID?.length ?? 0) ^ (clientSecret?.length ?? 0)) {
            throw new TwitterClientException('clientID and clientSecret must be both set or both unset');
        }

        this.accountID = accountID;
        this.clientID = clientID;
        this.clientSecret = clientSecret;
        this.credentials = credentials;
        this.credentialsUpdate = credentialsUpdateFunction;
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
        if (!this.clientID || !this.clientSecret) {
            throw new TwitterClientException('client ID or client secret not found');
        }
        if (!this.credentials.refresh_token) {
            throw new NonRefreshableCredentialsException('no refresh token found');
        }
        if (!this.credentials.created_at) {
            throw new NonRefreshableCredentialsException('no created_at timestamp found');
        }
        const now = Math.floor(Date.now() / 1000);
        const expiredAt = this.credentials.created_at + SIX_MONTH_TIME;
        if (expiredAt < now) {
            throw new ExpiredRefreshTokenException(expiredAt);
        }

        const twitterBasicAuthToken = btoa(`${this.clientID}:${this.clientSecret}`)
        
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
                client_id: this.clientID,
                refresh_token: this.credentials.refresh_token,
            })
        })
        await checkTwitterResponse(tokenResp);
        
        const credentials = await tokenResp.json() as TwitterCredentials
        credentials.created_at = Math.floor(Date.now() / 1000) - 900;
        this.credentials = credentials;

        if (this.credentialsUpdate) {
            await this.credentialsUpdate(this.accountID, credentials);
        }

        return credentials;
    }

    /**
     * Get existing credentials or refresh the credentials then return it
     * 
     * @returns {TwitterCredentials} New or existing credentials
     */
    async getOrRefreshCredentials(): Promise<TwitterCredentials> {
        const expireAt = (this.credentials.created_at || 0) + this.credentials.expires_in;
        const now = Math.floor(Date.now() / 1000) + 10;
        if (expireAt > now) return this.credentials;
        return this.refreshCredentials();
    }

    getFullURL(
        path: string,
        params?: Record<string, any>,
        requiredParams?: Iterable<string>
    ): URL {
        const url = new URL(TWITTER_API_URL);
        url.pathname += path
        setQueryParams(url.searchParams, params, requiredParams);
        return url;
    }
}