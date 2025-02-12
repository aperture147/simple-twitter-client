import { TwitterCredentials } from './type/resp'
import { TwitterCredentialsUpdateFunction } from './type/auth';
import { PostClient } from './module/post';
import { UserClient } from './module/user';

export class TwitterClient {
    private _postClient: PostClient;
    private _userClient: UserClient;
    
    /**
     * Constructor of TwitterClient
     * 
     * @param accountID Twitter Account ID
     * @param clientID Twitter API v2 Client ID
     * @param clientSecret Twitter API v2 Client Secret
     * @param credentials Twitter API v2 Credentials
     * @param credentialsUpdateFunction a callback function to update the credentials if it was refreshed
     */
    constructor(
        accountID: string,
        credentials: TwitterCredentials,
        clientID?: string,
        clientSecret?: string,
        credentialsUpdateFunction?: TwitterCredentialsUpdateFunction
    ) {
        this._postClient = new PostClient(
            accountID, credentials,
            clientID, clientSecret,
            credentialsUpdateFunction
        );
        this._userClient = new UserClient(
            accountID, credentials,
            clientID, clientSecret,
            credentialsUpdateFunction
        );
    }
    
    public get post() {
        return this._postClient;
    }

    public get user() {
        return this._userClient;
    }
}