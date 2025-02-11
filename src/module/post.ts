import { BaseClient } from "./_base";
import { TwitterResponse } from "../schema";
import { TwitterClientUserException } from "../exception";

export interface RuleAddObject {
    value: string,
    tag?: string,
}

export class PostClient extends BaseClient {
    /******************** Post Search API ********************/
    /**
     * Returns Posts that match a search query.
     */
    async fullArchiveSearch(
        query: string,
        params: {
            start_time?: string,
            end_time?: string,
            since_id?: string,
            until_id?: string,
            max_results?: number,
            next_token?: string,
            pagination_token?: string,
            sort_order?: string,
            "tweet.fields"?: string[],
            expansions?: string[],
            "media.fields"?: string[],
            "poll.fields"?: string[],
            "user.fields"?: string[],
            "place.fields"?: string[],
        }
    ): Promise<TwitterResponse> {
        if (!query)
            throw new TwitterClientUserException('query is required');
        const url = this.getFullURL("/tweets/search/all", params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /**
     * Returns Posts from the last 7 days that match a search query.
     */
    async recentSearch(
        query: string,
        params: {
            start_time?: string,
            end_time?: string,
            since_id?: string,
            until_id?: string,
            max_results?: number,
            next_token?: string,
            pagination_token?: string,
            sort_order?: string,
            "tweet.fields"?: string[],
            expansions?: string[],
            "media.fields"?: string[],
            "poll.fields"?: string[],
            "user.fields"?: string[],
            "place.fields"?: string[],
        }
    ): Promise<TwitterResponse> {
        if (!query)
            throw new TwitterClientUserException('query is required');
        const url = this.getFullURL("/tweets/search/recent", params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Post Counts API ********************/

    /**
     * Returns Post Counts that match a search query.
     */
    async fullArchiveSearchCounts(
        query: string,
        params: {
            start_time?: string,
            end_time?: string,
            since_id?: string,
            until_id?: string,
            max_results?: number,
            next_token?: string,
            pagination_token?: string,
            granularity?: string,
            "search_count.fields"?: string[],
        }
    ): Promise<TwitterResponse> {
        if (!query)
            throw new TwitterClientUserException('query is required');
        const url = this.getFullURL("/tweets/counts/all", params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /**
     * Returns Post Counts from the last 7 days that match a search query.
     */
    async recentSearchCounts(
        query: string,
        params: {
            start_time?: string,
            end_time?: string,
            since_id?: string,
            until_id?: string,
            max_results?: number,
            next_token?: string,
            pagination_token?: string,
            granularity?: string,
            "search_count.fields"?: string[],
        }
    ): Promise<TwitterResponse> {
        if (!query)
            throw new TwitterClientUserException('query is required');
        const url = this.getFullURL("/tweets/counts/recent", params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Filtered Stream API ********************/

    /**
     * Streams Posts matching the stream’s active rule set.
     */
    async filteredStream(params?: {
        backfill_minutes?: number,
        start_time?: string,
        end_time?: string,
        "tweet.fields"?: string[],
        expansions?: string[],
        "media.fields"?: string[],
        "poll.fields"?: string[],
        "user.fields"?: string[],
        "place.fields"?: string[],
    }): Promise<TwitterResponse> {
        const url = this.getFullURL("/tweets/search/stream", params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /**
     * Returns rules from a User’s active rule set.
     * Users can fetch all of their rules or a subset, specified by the provided rule ids.
     */
    async rulesLookup(ids: string[],
        params: {
            max_results?: number,
            pagination_token?: string,
        }
    ): Promise<TwitterResponse> {
        const url = this.getFullURL("/tweets/search/stream/rules", params, ["ids"]);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /**
     * Returns the counts of rules from a User’s active rule set, to reflect usage by project and application.
     */
    async rulesCount(rules_count_fields: string[]): Promise<TwitterResponse> {
        const url = this.getFullURL("/tweets/search/stream/rules", { rules_count_fields });
        const resp = await this.fetch(url);
        return resp.json();
    }

    /**
     * Add rules from a User’s active rule set.
     * Users can provide unique, optionally tagged rules to add.
     */
    async addRules(
        add: RuleAddObject[],
        dry_run?: boolean
    ): Promise<TwitterResponse> {
        const url = this.getFullURL("/tweets/search/stream/rules", { dry_run });
        const resp = await this.fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(add),
        });
        return resp.json();
    }

    /**
     * Delete rules from a User’s active rule set.
     * Users can delete their entire rule set or a subset specified by rule ids or values.
     */
    async deleteRules(
        ids?: string[],
        values?: string[],
        dry_run?: boolean,
        delete_all?: boolean
    ): Promise<TwitterResponse> {
        const url = this.getFullURL("/tweets/search/stream/rules", { dry_run, delete_all });
        let data = {};
        if (!delete_all) {
            data = { delete: { ids, values } };
        }
        const resp = await this.fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return resp.json();
    }

    /******************** Timelines API ********************/
    // TODO: Implement Timelines API

    /******************** Post Lookup API ********************/
    // TODO: Implement Post Lookup API

    /******************** Bookmarks API ********************/
    // TODO: Implement Bookmarks API

    /******************** Manage Posts API ********************/
    /**
     * Causes the User to create a Post under the authorized account.
     */
    async createPost(body: {
        card_uri?: string,
        community_id?: string,
        direct_message_deep_link?: string,
        for_super_followers_only?: boolean,
        geo?: { place_id: string },
        media?: { media_ids: string[], tagged_user_ids?: string[] },
        nullcast?: boolean,
        poll?: { duration_minutes: number, end_datetime: string, options: string[] },
    }): Promise<TwitterResponse> {
        const url = this.getFullURL("/tweets");
        const resp = await this.fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return resp.json();
    }

    /**
     * Causes the User to delete a Post under the authorized account.
     */
    async deletePost(id: string): Promise<TwitterResponse> {
        const url = this.getFullURL(`/tweets/${id}`);
        const resp = await this.fetch(url, {
            method: 'DELETE',
        });
        return resp.json();
    }

    /******************** Reposts API ********************/
    // TODO: Implement Reposts API

    /******************** Quotes API ********************/
    // TODO: Implement Quotes API

    /******************** Hide replies API ********************/
    // TODO: Implement Hide replies API

    /******************** Volume streams API ********************/
    // TODO: Implement Volume streams API
}