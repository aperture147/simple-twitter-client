import { BaseClient } from "./_base";
import { TwitterResponse } from "../schema";
import { TwitterClientUserException } from "../exception";

interface userLookupParams {
    "user.fields"?: string[],
    expansions?: string[],
    "tweet.fields"?: string[],
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
        id: string,
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
        "tweet.fields"?: string[],
        expansions?: string[],
        "user.fields"?: string[],
    }): Promise<TwitterResponse> {
        const url = this.getFullURL("/users/search", params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Follows API ********************/
    // TODO: Implement follows API

    /******************** Mutes API ********************/
    // TODO: Implement mutes API

    /******************** Blocks API ********************/
    // TODO: Implement blocks API

    /******************** Personalized Trends API ********************/
    // TODO: Implement personalized trends API
}