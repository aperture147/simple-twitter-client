import { BaseClient, ClientOptions } from "./_base";
import { TwitterResponse, TwitterCredentials } from "../type/resp";
import { TwitterClientUserException } from "../exception";
import {
    UserField, Expansion, TweetField,
    PersonalizedTrendField
} from "../type/enum";

interface userLookupParams {
    "user.fields"?: UserField[],
    expansions?: Expansion[],
    "tweet.fields"?: TweetField[],
}

export class UserClient extends BaseClient {
    constructor(
        accountID: string,
        credentials: TwitterCredentials,
        options?: ClientOptions
    ) {
        super(accountID, credentials, {
            pathPrefix: '/users',
            ...options
        });
    }

    /******************** User Lookup API ********************/
    async getUsersByIDs(
        ids: string[] | string,
        params?: userLookupParams
    ): Promise<TwitterResponse> {
        if (!ids) {
            throw new TwitterClientUserException('ids is required');
        }
        let path = "";
        const queryParams: Record<string, any> = {
            ...params
        }
        if (Array.isArray(ids)) {
            queryParams["ids"] = ids;
        } else {
            path = `/${ids}`;
        }
        const url = this.getFullURL(path, queryParams);
        const resp = await this.fetch(url);
        return resp.json();
    }

    async getCurrentUser(params?: userLookupParams): Promise<TwitterResponse> {
        return this.getUsersByIDs('me', params);
    }

    async getUsersByUsernames(
        usernames: string[] | string,
        params?: userLookupParams
    ): Promise<TwitterResponse> {
        if (!usernames) {
            throw new TwitterClientUserException('usernames is required');
        }
        let path = '/by';
        const queryParams: Record<string, any> = {
            ...params
        }
        if (Array.isArray(usernames)) {
            queryParams["usernames"] = usernames;
        } else {
            path += `/username/${usernames}`;
        }
        const url = this.getFullURL(path, queryParams);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Search API ********************/

    async userSearch(query: string, params: {
        max_results?: number,
        next_token?: string,
    } & userLookupParams): Promise<TwitterResponse> {
        const url = this.getFullURL("/search", {
            query,
            ...params
        }, ['query']);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Follows API ********************/
    
    async getFollowersByUserID(
        id: string = this.accountID,
        params: {
            max_results?: number,
            pagination_token?: string,
        } & userLookupParams
    ): Promise<TwitterResponse> {
        if (!id) {
            throw new TwitterClientUserException('id is required');
        }
        const url = this.getFullURL(`/${id}/followers`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    async getFollowingByUserID(
        id: string = this.accountID,
        params?: {
            max_results?: number,
            pagination_token?: string,
        } & userLookupParams
    ): Promise<TwitterResponse> {
        if (!id)
            throw new TwitterClientUserException('id is required');
        const url = this.getFullURL(`/${id}/following`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    async followUser(id: string): Promise<TwitterResponse> {
        if (!id)
            throw new TwitterClientUserException('id is required');
        const url = this.getFullURL(`/${this.accountID}/following`);
        const resp = await this.fetch(url, {
            method: 'POST',
            body: JSON.stringify({ target_user_id: id }),
        });
        return resp.json();
    }

    async unfollowUser(id: string): Promise<TwitterResponse> {
        if (!id)
            throw new TwitterClientUserException('id is required');

        const url = this.getFullURL(`/${this.accountID}/following/${id}`);
        const resp = await this.fetch(url, {
            method: 'DELETE',
        });
        return resp.json();
    }

    /******************** Mutes API ********************/
    async muteUserByID(id: string): Promise<TwitterResponse> {
        if (!id)
            throw new TwitterClientUserException('id is required');

        const url = this.getFullURL(`/${this.accountID}/muting`);
        const resp = await this.fetch(url, {
            method: 'POST',
            body: JSON.stringify({ target_user_id: id }),
        });
        return resp.json();
    }

    async unmuteUserByID(id: string): Promise<TwitterResponse> {
        if (!id)
            throw new TwitterClientUserException('id is required');

        const url = this.getFullURL(`/${this.accountID}/muting/${id}`);
        const resp = await this.fetch(url, {
            method: 'DELETE',
        });
        return resp.json();
    }

    async getMutedUsers(
        params: {
            max_results?: number,
            pagination_token?: string,
        } & userLookupParams
    ): Promise<TwitterResponse> {
        const url = this.getFullURL(`/${this.accountID}/muting`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Blocks API ********************/
    async getBlockedUsers(
        params: {
            max_results?: number,
            pagination_token?: string,
        } & userLookupParams
    ): Promise<TwitterResponse> {
        const url = this.getFullURL(`/${this.accountID}/blocking`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Personalized Trends API ********************/
    async getPersonalizedTrends(
        params?: {
            "personalized_trend.fields"?: PersonalizedTrendField[],
        }
    ): Promise<TwitterResponse> {
        const url = this.getFullURL(`/personalized_trends`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }
}