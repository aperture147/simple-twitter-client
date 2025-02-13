/**
 * Twitter Credentials
 * 
 * @property {string} token_type Token type, should be 'bearer'
 * @property {number} expires_in Time in seconds until the token expires
 * @property {string} access_token Access token
 * @property {string} refresh_token
 * @property {string} scope Scope of the token
 * @property {number} created_at Timestamp in seconds of the creation of the token
 */
export interface TwitterCredentials {
    token_type: string,
    expires_in: number,
    access_token: string,
    scope: string,
    refresh_token?: string,
    created_at?: number,
}

/**
 * Twitter API Error Response
 * 
 * @property {string} title Error title
 * @property {string} type Error type
 * @property {string} detail Error detail
 * @property {number} status HTTP status code
 */
export interface TwitterErrorResponse {
    title: string,
    type: string,
    detail?: string,
    status?: number,
}

/**
 * Twitter API Error Response
 * 
 * @property {object} data Data object
 * @property {TwitterErrorResponse[]} errors Error object
 * @property {object} includes Include object
 * @property {object} meta Meta object
 * @property {object[]} matching_rules Matching rules
 * 
 */
export interface TwitterResponse {
    // TODO: research more about the Twitter API response
    data?: any,
    errors?: TwitterErrorResponse[],
    includes?: any,
    meta?: any,
    matching_rules?: object[]
}