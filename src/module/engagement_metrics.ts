import { BaseClient, ClientOptions } from "./_base";
import { TwitterResponse, TwitterCredentials } from "../type/resp";
import { 
    EngagementField, DayBasedGranularity, RequestedMetric
} from "../type/enum";
export interface RuleAddObject {
    value: string,
    tag?: string,
}

export class EngagementMetricsClient extends BaseClient {
    constructor(
        accountID: string,
        credentials: TwitterCredentials,
        options?: ClientOptions
    ) {
        super(accountID, credentials, {
            pathPrefix: '/insights',
            ...options
        });
    }
    
    async getLast28hMetricsForPost(
        tweet_ids: string[],
        granularity: DayBasedGranularity[],
        requested_metrics: RequestedMetric[],
        params: {
            "engagement.fields"?: EngagementField[],
        }
    ): Promise<TwitterResponse> {

        const url = this.getFullURL("/28hr", {
            tweet_ids,
            granularity,
            requested_metrics,
            ...params
        }, ['tweet_ids', 'granularity', 'requested_metrics']);
        const resp = await this.fetch(url);
        return resp.json();
    }

    async getHistoricalMetricsForPost(
        tweet_ids: string[],
        start_time: string,
        end_time: string,
        granularity: DayBasedGranularity[],
        requested_metrics: RequestedMetric[],
        params: {
            "engagement.fields"?: EngagementField[],
        }
    ): Promise<TwitterResponse> {
        const url = this.getFullURL("/28hr", {
            tweet_ids,
            start_time,
            end_time,
            granularity,
            requested_metrics,
            ...params
        }, [
            'start_time', 'end_time', 'tweet_ids',
            'granularity', 'requested_metrics'
        ]);
        const resp = await this.fetch(url);
        return resp.json();
    }
}