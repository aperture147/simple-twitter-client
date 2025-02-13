import { BaseClient, ClientOptions } from "./_base";
import { TwitterResponse, TwitterCredentials } from "../type/resp";
import { TwitterClientUserException } from "../exception";
import { UsageField } from "../type/enum";
export interface RuleAddObject {
    value: string,
    tag?: string,
}

export class UsageClient extends BaseClient {
    constructor(
        accountID: string,
        credentials: TwitterCredentials,
        options?: ClientOptions
    ) {
        super(accountID, credentials, {
            pathPrefix: '/usage',
            ...options
        });
    }
    
    async getPostUsage(
        params?: {
            days?: number,
            "usage.fields"?: UsageField[],
        }
    ): Promise<TwitterResponse> {
        const url = this.getFullURL(`/tweets`, params);
        const resp = await this.fetch(url);
        return resp.json();
    }
}