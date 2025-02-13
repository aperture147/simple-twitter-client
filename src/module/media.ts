import { BaseClient, ClientOptions } from "./_base";
import { TwitterResponse, TwitterCredentials } from "../type/resp";
import { TwitterClientUserException } from "../exception";
import { MediaCategory, UploadCommand } from "../type/enum";
import { checkKeyExists } from "../util/common";
import {
    detectMediaMimeExt
} from "../util/mime";

export class MediaClient extends BaseClient {
    constructor(
        accountID: string,
        credentials: TwitterCredentials,
        options?: ClientOptions
    ) {
        super(accountID, credentials, {
            pathPrefix: '/media',
            ...options
        });
    }
    
    async mediaUpload(
        params: {
            total_bytes?: number,
            media_type?: string,
            command: UploadCommand,
            media_id?: string,
            media_category?: MediaCategory,
            segment_index?: number,
            additional_owners?: string[],
        },
        media?: Blob
    ): Promise<TwitterResponse> {
        const keyCheckList = ['command'];
        if (params.command === UploadCommand.Init)
            keyCheckList.push('total_bytes', 'media_type');
        if (params.command === UploadCommand.Append)
            keyCheckList.push('media_id', 'segment_index');
        if (params.command === UploadCommand.Finalize)
            keyCheckList.push('media_id');
        checkKeyExists(params, keyCheckList);
        const url = this.getFullURL('/upload', params);
        
        const mediaFormData = new FormData();
        if (media)
            mediaFormData.append('media', media);
            
        const resp = await this.fetch(url, {
            method: 'POST',
            body: mediaFormData
        })

        return resp.json();
    }

    async uploadMedia(
        mediaData: Blob,
        options?: {
            category?: MediaCategory,
            additionalOwners?: string[]
        }
    ): Promise<TwitterResponse> {
        if (!mediaData)
            throw new TwitterClientUserException('mediaData is required');

        const mime = await detectMediaMimeExt(mediaData);

        /*--------------------- Init media ---------------------*/
        const initData = await this.mediaUpload({
            command: UploadCommand.Init,
            total_bytes: mediaData.size,
            media_type: mime,
            media_category: options?.category,
            additional_owners: options?.additionalOwners
        });

        const mediaID: string = initData.data.id

        /*--------------------- Append media ---------------------*/
        // TODO: slicing the media to 5MB chunks
        const appendData = await this.mediaUpload({
            command: UploadCommand.Append,
            media_id: mediaID,
            segment_index: 0
        }, mediaData);
        
        /*--------------------- Finalize media ---------------------*/
        const finalizedData = await this.mediaUpload({
            command: UploadCommand.Finalize,
            media_id: mediaID
        })

        return finalizedData;
    }

    async mediaUploadStatus(id: string): Promise<TwitterResponse> {
        const statusURL = this.getFullURL("/media/upload", {
            media_id: id,
            command: 'STATUS'
        });
        const statusResp = await this.fetch(statusURL);
        return statusResp.json();
    }

    /******************** Metadata API ********************/
    // TODO: Implement Metadata API
}