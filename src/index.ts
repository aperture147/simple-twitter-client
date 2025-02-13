import { TwitterCredentials } from './type/resp'
import { OnTwitterCredentialsUpdateFunction } from './type/auth';
import { PostClient } from './module/post';
import { UserClient } from './module/user';
import { EngagementClient } from './module/engagement';
import { MediaClient } from './module/media';
import { UsageClient } from './module/usage';
import { TrendClient } from './module/trend';

export class TwitterClient {
    private _postClient: PostClient;
    private _userClient: UserClient;
    private _engagementClient: EngagementClient;
    private _mediaClient: MediaClient;
    private _usageClient: UsageClient;
    private _trendClient: TrendClient;
    
    /**
     * Constructor of TwitterClient
     * 
     * @param accountID Twitter Account ID
     * @param clientID Twitter API v2 Client ID
     * @param clientSecret Twitter API v2 Client Secret
     * @param credentials Twitter API v2 Credentials
     * @param onCredentialsUpdateFunction a callback function to update the credentials if it was refreshed
     */
    constructor(
        accountID: string,
        credentials: TwitterCredentials,
        clientID?: string,
        clientSecret?: string,
        onCredentialsUpdateFunction?: OnTwitterCredentialsUpdateFunction
    ) {
        const commonOptions = {
            clientID,
            clientSecret,
            onCredentialsUpdateFunction,
        }
        this._postClient = new PostClient(
            accountID, credentials,
            commonOptions
        );
        this._userClient = new UserClient(
            accountID, credentials,
            commonOptions
        );
        this._engagementClient = new EngagementClient(
            accountID, credentials,
            commonOptions
        );
        this._mediaClient = new MediaClient(
            accountID, credentials,
            commonOptions
        );
        this._usageClient = new UsageClient(
            accountID, credentials,
            commonOptions
        );
        this._trendClient = new TrendClient(
            accountID, credentials,
            commonOptions
        );
    }
    
    public get post() {
        return this._postClient;
    }

    public get user() {
        return this._userClient;
    }

    public get engagement() {
        return this._engagementClient;
    }

    public get media() {
        return this._mediaClient;
    }

    public get usage() {
        return this._usageClient;
    }

    public get trend() {
        return this._trendClient;
    }
}