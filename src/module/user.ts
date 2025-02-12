import { BaseClient } from "./_base";
import { TwitterResponse } from "../type/resp";
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
    /******************** User Lookup API ********************/
    async userLookupByIDs(
        ids: string[],
        params?: userLookupParams
    ): Promise<TwitterResponse> {
        if (!ids) {
            throw new TwitterClientUserException('ids is required');
        }
        const url = this.getFullURL("/users", params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    async userLookupByID(
        id: string = this.accountID,
        params?: userLookupParams
    ): Promise<TwitterResponse> {
        if (!id) {
            throw new TwitterClientUserException('id is required');
        }
        const url = this.getFullURL(`/users/${id}`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    async userLookupMe(params?: userLookupParams): Promise<TwitterResponse> {
        return this.userLookupByID('me', params);
    }

    async userLookupByUsername(
        username: string,
        params?: userLookupParams
    ): Promise<TwitterResponse> {
        if (!username) {
            throw new TwitterClientUserException('username is required');
        }
        const url = this.getFullURL(`/users/by/username/${username}`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    async userLookupByUsernames(
        usernames: string[],
        params?: userLookupParams
    ): Promise<TwitterResponse> {
        if (!usernames) {
            throw new TwitterClientUserException('usernames is required');
        }
        const url = this.getFullURL(`/users/by`, {
            usernames,
            ...params
        });
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Search API ********************/
    // TODO: Implement search API

    async userSearch(query: string, params: {
        max_results?: number,
        next_token?: string,
    } & userLookupParams): Promise<TwitterResponse> {
        const url = this.getFullURL("/users/search", {
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
        const url = this.getFullURL(`/users/${id}/followers`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    async getFollowingByUserID(
        id: string = this.accountID,
        params?: {
            max_results?: number,
            pagination_token?: string,
            "tweet.fields"?: string[],
            expansions?: string[],
            "user.fields"?: string[],
        }
    ): Promise<TwitterResponse> {
        if (!id)
            throw new TwitterClientUserException('id is required');
        const url = this.getFullURL(`/users/${id}/following`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    async followUser(
        id: string,
    ): Promise<TwitterResponse> {
        if (!id)
            throw new TwitterClientUserException('id is required');
        const url = this.getFullURL(`/users/${this.accountID}/following`);
        const resp = await this.fetch(url, {
            method: 'POST',
            body: JSON.stringify({ target_user_id: id }),
        });
        return resp.json();
    }

    async unfollowUser(
        id: string
    ): Promise<TwitterResponse> {
        if (!id)
            throw new TwitterClientUserException('id is required');

        const url = this.getFullURL(`/users/${this.accountID}/following/${id}`);
        const resp = await this.fetch(url, {
            method: 'DELETE',
        });
        return resp.json();
    }

    /******************** Mutes API ********************/
    async muteUserByID(
        id: string
    ): Promise<TwitterResponse> {
        if (!id)
            throw new TwitterClientUserException('id is required');

        const url = this.getFullURL(`/users/${this.accountID}/muting`);
        const resp = await this.fetch(url, {
            method: 'POST',
            body: JSON.stringify({ target_user_id: id }),
        });
        return resp.json();
    }

    async unmuteUserByID(
        id: string
    ): Promise<TwitterResponse> {
        if (!id)
            throw new TwitterClientUserException('id is required');

        const url = this.getFullURL(`/users/${this.accountID}/muting/${id}`);
        const resp = await this.fetch(url, {
            method: 'DELETE',
        });
        return resp.json();
    }

    async getMutedUsers(
        params: {
            max_results?: number,
            pagination_token?: string,
            "tweet.fields"?: string[],
            expansions?: string[],
            "user.fields"?: string[],
        }
    ): Promise<TwitterResponse> {
        const url = this.getFullURL(`/users/${this.accountID}/muting`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Blocks API ********************/
    async getBlockedUsers(
        params: {
            max_results?: number,
            pagination_token?: string,
            "tweet.fields"?: string[],
            expansions?: string[],
            "user.fields"?: string[],
        }
    ): Promise<TwitterResponse> {
        const url = this.getFullURL(`/users/${this.accountID}/blocking`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Personalized Trends API ********************/
    async getPersonalizedTrends(
        params?: {
            "personalized_trend.fields"?: PersonalizedTrendField[],
        }
    ): Promise<TwitterResponse> {
        const url = this.getFullURL(`/users/personalized_trends`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }
}