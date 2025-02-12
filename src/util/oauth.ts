import { urlsafeBtoa } from './encoding';
import {
    TwitterClientAPIException
} from '../exception';
import { checkTwitterResponse } from './http';
import { TwitterCredentials } from '../type/resp';
import { TWITTER_API_URL, TWITTER_OAUTH_URL } from '../constant';

async function generatePKCEKeyPair(): Promise<{ verifier: string; challenge: string }> {
    const verifierBlob = new Uint8Array(64);
    crypto.getRandomValues(verifierBlob);
    
    const verifier = urlsafeBtoa(verifierBlob)
    const challengeBlob = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(verifier)
    )
    const challenge = urlsafeBtoa(challengeBlob)
    return { verifier, challenge }

}

/**
 * Twitter OAuth Authorization Information
 * 
 * @property {string} state State string
 * @property {string} verifier PKCE verifier string
 * @property {string} oauthURLString OAuth URL string
*/
export interface TwitterOAuthAuthorizationInfo {
    state: string,
    verifier: string,
    oauthURLString: string
}

/**
 * Create OAuth URL for user to authorize the app
 * 
 * @param clientID Client ID
 * @param redirectURLString Redirect URL
 * @param scope Scope
 * @returns {Promise<TwitterOAuthAuthorizationInfo>}
 */
export async function createOAuthURL(
    clientID: string,
    redirectURLString: string,
    scope: string
): Promise<TwitterOAuthAuthorizationInfo> {
    const state = crypto.randomUUID();
    const { verifier, challenge } = await generatePKCEKeyPair()

    const requestTokenURL = new URL(TWITTER_OAUTH_URL)
    requestTokenURL.searchParams.set('response_type', 'code')
    requestTokenURL.searchParams.set('scope', scope)
    requestTokenURL.searchParams.set('client_id', clientID)
    requestTokenURL.searchParams.set('redirect_uri', redirectURLString)
    requestTokenURL.searchParams.set('state', state)
    requestTokenURL.searchParams.set('code_challenge', challenge)
    requestTokenURL.searchParams.set('code_challenge_method', 'S256')

    return {
        state: state,
        verifier: verifier,
        oauthURLString: requestTokenURL.toString()
    }
}

export async function getCredentials(
    clientID: string,
    clientSecret: string,
    code: string,
    verifier: string,
    redirectURLString: string,
): Promise<{ userID: string, credentials: TwitterCredentials }> {
    const twitterBasicAuthToken = btoa(`${clientID}:${clientSecret}`)
    const tokenURL = new URL(TWITTER_API_URL);
    tokenURL.pathname += '/oauth2/token'
    const tokenResp = await fetch(tokenURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${twitterBasicAuthToken}`
        },
        body: new URLSearchParams({
            code: code,
            grant_type: 'authorization_code',
            client_id: clientID,
            redirect_uri: redirectURLString,
            code_verifier: verifier,
        })
    })

    await checkTwitterResponse(tokenResp);
    
    const credentials = await tokenResp.json() as TwitterCredentials
    const userInfoURL = new URL(TWITTER_API_URL);
    userInfoURL.pathname += '/users/me';
    userInfoURL.searchParams.set('user.fields', 'id');
    const userInfoResp = await fetch(userInfoURL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${credentials.access_token}`
        }
    })

    if (!userInfoResp.ok) {
        throw new TwitterClientAPIException(
            userInfoResp.status,
            'Failed to get user info',
            userInfoURL.pathname,
            await userInfoResp.json()
        )
    }

    const userInfo = await userInfoResp.json()
    credentials.created_at = Math.floor(Date.now() / 1000) - 10

    return {
        userID: userInfo.data.id,
        credentials: credentials
    }
}