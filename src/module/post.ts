import { BaseClient, ClientOptions } from "./_base";
import { TwitterResponse, TwitterCredentials } from "../type/resp";
import { TwitterClientUserException } from "../exception";
import { 
    TweetField, Expansion, UserField,
    MediaField, PollField, PlaceField,
    SearchCountField, RulesCountField,
    MinuteBasedGranularity, Exclude,
    ReplySetting, SortOrder
} from "../type/enum";
export interface RuleAddObject {
    value: string,
    tag?: string,
}

export class PostClient extends BaseClient {
    constructor(
        accountID: string,
        credentials: TwitterCredentials,
        options?: ClientOptions
    ) {
        super(accountID, credentials, {
            pathPrefix: '/tweets',
            ...options
        });
    }


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
            sort_order?: SortOrder,
            "tweet.fields"?: TweetField[],
            expansions?: Expansion[],
            "media.fields"?: MediaField[],
            "poll.fields"?: PollField[],
            "user.fields"?: UserField[],
            "place.fields"?: PlaceField[],
        }
    ): Promise<TwitterResponse> {
        if (!query)
            throw new TwitterClientUserException('query is required');
        const url = this.getFullURL("/search/all", {
            query,
            ...params
        }, ['query']);
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
            sort_order?: SortOrder,
            "tweet.fields"?: TweetField[],
            expansions?: Expansion[],
            "media.fields"?: MediaField[],
            "poll.fields"?: PollField[],
            "user.fields"?: UserField[],
            "place.fields"?: PlaceField[],
        }
    ): Promise<TwitterResponse> {
        if (!query)
            throw new TwitterClientUserException('query is required');
        const url = this.getFullURL("/search/recent", {
            query,
            ...params
        }, ['query']);
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
            granularity?: MinuteBasedGranularity,
            "search_count.fields"?: SearchCountField[],
        }
    ): Promise<TwitterResponse> {
        if (!query)
            throw new TwitterClientUserException('query is required');
        const url = this.getFullURL("/counts/all", {
            query,
            ...params
        }, ['query']);
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
            granularity?: MinuteBasedGranularity,
            "search_count.fields"?: SearchCountField[],
        }
    ): Promise<TwitterResponse> {
        if (!query)
            throw new TwitterClientUserException('query is required');
        const url = this.getFullURL("/counts/recent", {
            query,
            ...params
        }, ['query']);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Filtered Stream API ********************/

    /**
     * Streams Posts matching the stream’s active rule set.
     */
    async getFilteredStream(params?: {
        backfill_minutes?: number,
        start_time?: string,
        end_time?: string,
        "tweet.fields"?: TweetField[],
        expansions?: Expansion[],
        "media.fields"?: MediaField[],
        "poll.fields"?: PollField[],
        "user.fields"?: UserField[],
        "place.fields"?: PlaceField[],
    }): Promise<TwitterResponse> {
        const url = this.getFullURL("/search/stream", params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /**
     * Returns rules from a User’s active rule set.
     * Users can fetch all of their rules or a subset, specified by the provided rule ids.
     */
    async getRules(
        ids: string[],
        params: {
            max_results?: number,
            pagination_token?: string,
        }
    ): Promise<TwitterResponse> {
        const url = this.getFullURL("/search/stream/rules", {
            ids,
            ...params
        }, ["ids"]);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /**
     * Returns the counts of rules from a User’s active rule set, to reflect usage by project and application.
     */
    async getRulesCount(
        rules_count_fields: RulesCountField[]
    ): Promise<TwitterResponse> {
        const url = this.getFullURL("/search/stream/rules", { rules_count_fields });
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
        const url = this.getFullURL("/search/stream/rules", { dry_run });
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
    async deleteRules(options: {
        ids?: string[],
        values?: string[],
        dry_run?: boolean,
        delete_all?: boolean
    }): Promise<TwitterResponse> {
        const url = this.getFullURL("/search/stream/rules", {
            dry_run: options.dry_run,
            delete_all: options.delete_all
        });
        let data = {};
        if (!options.delete_all) {
            if (!options.ids && !options.values)
                throw new TwitterClientUserException('at least ids or values are required');

            data = { delete: { ids: options.ids, values: options.values } };
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
    async getPost(body: {
        card_uri?: string,
        community_id?: string,
        direct_message_deep_link?: string,
        for_super_followers_only?: boolean,
        geo?: {
            place_id: string
        },
        media?: {
            media_ids: string[],
            tagged_user_ids?: string[]
        },
        nullcast?: boolean,
        poll?: {
            duration_minutes: number,
            end_datetime: string,
            options: string[]
        },
        quote_tweet_id?: string,
        reply?: {
            in_reply_to_tweet_id: string,
            exclude_reply_user_ids?: string[]
        },
        reply_settings?: ReplySetting[],
        text?: string,
    }): Promise<TwitterResponse> {
        const url = this.getFullURL();
        const resp = await this.fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return resp.json();
    }

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
        geo?: {
            place_id: string
        },
        media?: {
            media_ids: string[],
            tagged_user_ids?: string[]
        },
        nullcast?: boolean,
        poll?: {
            duration_minutes: number,
            end_datetime: string,
            options: string[]
        },
        quote_tweet_id?: string,
        reply?: {
            in_reply_to_tweet_id: string,
            exclude_reply_user_ids?: string[]
        },
        reply_settings?: ReplySetting[],
        text?: string,
    }): Promise<TwitterResponse> {
        const url = this.getFullURL();
        const resp = await this.fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return resp.json();
    }

    /**
     * Causes the User to delete a Post under the authorized account.
     */
    async deletePost(id: string): Promise<TwitterResponse> {
        const url = this.getFullURL(`/${id}`);
        const resp = await this.fetch(url, {
            method: 'DELETE',
        });
        return resp.json();
    }

    /******************** Reposts API ********************/
    // TODO: Implement Reposts API

    /******************** Quotes API ********************/
    /**
     * Returns a variety of information about each Post that
     * quotes the Post specified by the requested ID.
     */
    async getQuotePost(
        id: string,
        params?: {
            max_results?: number,
            pagination_token?: string,
            exclude?: Exclude[],
            "tweet.fields"?: TweetField[],
            expansions?: Expansion[],
            "media.fields"?: MediaField[],
            "poll.fields"?: PollField[],
            "user.fields"?: UserField[],
            "place.fields"?: PlaceField[],
        }
    ): Promise<TwitterResponse> {
        const url = this.getFullURL(`/${id}/quote_tweets`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }

    /******************** Hide replies API ********************/
    async hideReplies(id: string, hidden: boolean): Promise<TwitterResponse> {
        const url = this.getFullURL(`/${id}/hidden`);
        const resp = await this.fetch(url, {
            method: 'PUT',
            body: JSON.stringify({ hidden }),
        });
        return resp.json();
    }

    /******************** Volume streams API ********************/
    // TODO: Implement Volume streams API
}