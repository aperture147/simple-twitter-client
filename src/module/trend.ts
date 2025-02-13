import { BaseClient, ClientOptions } from "./_base";
import { TwitterResponse, TwitterCredentials } from "../type/resp";
import { TwitterClientUserException } from "../exception";
import { TrendField } from "../type/enum";
export interface RuleAddObject {
    value: string,
    tag?: string,
}

export class TrendClient extends BaseClient {
    constructor(
        accountID: string,
        credentials: TwitterCredentials,
        options?: ClientOptions
    ) {
        super(accountID, credentials, {
            pathPrefix: '/trends',
            ...options
        });
    }
    
    async getTrends(
        woeID: string,
        params?: {
            max_trends?: number,
            "trend.fields"?: TrendField[],
        }
    ): Promise<TwitterResponse> {
        if (!woeID)
            throw new TwitterClientUserException('woeID is required');
        const url = this.getFullURL(`/by/woeid/${woeID}`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }
}