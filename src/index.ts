import { TwitterCredentials } from './schema'
import { TwitterCredentialsUpdateFunction } from './type';
import { PostClient } from './module/post';

export class TwitterClient {
    private postClient: PostClient;
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
        this.postClient = new PostClient(
            accountID, credentials,
            clientID, clientSecret,
            credentialsUpdateFunction
        );
    }
    
    public get post() {
        return this.postClient;
    }
}