import { BaseClient } from "./_base";
import { TwitterResponse } from "../type/resp";
import { TwitterClientUserException } from "../exception";
import {
    detectMediaMimeExt
} from "../util/mime";

export class MediaClient extends BaseClient {
    async mediaUpload(
        mediaData: Blob,
        category: string,
    ): Promise<TwitterResponse> {
        if (!mediaData)
            throw new TwitterClientUserException('mediaData is required');

        const mime = await detectMediaMimeExt(mediaData);

        /*--------------------- Init media ---------------------*/
        const mediaAPIPath = "/media/upload";
        const initMediaURL = this.getFullURL(mediaAPIPath, {
            command: 'INIT',
            total_bytes: mediaData.size,
            media_type: mime,
            media_category: category
        });

        const initResp = await this.fetch(initMediaURL, {
            method: 'POST',
        })
        const initData = await initResp.json();
        const mediaID = initData.data.id

        /*--------------------- Append media ---------------------*/
        // TODO: slicing the media to 5MB chunks
        const appendMediaURL = this.getFullURL(mediaAPIPath, {
            command: 'APPEND',
            media_id: mediaID,
            segment_index: 0
        });
        const appendFormData = new FormData();
        appendFormData.append('media', mediaData);
        const appendResp = await this.fetch(appendMediaURL, {
            method: 'POST',
            body: appendFormData
        });
        
        /*--------------------- Finalize media ---------------------*/
        const finalizeMediaURL = this.getFullURL(mediaAPIPath, {
            command: 'FINALIZE',
            media_id: mediaID,
        });
        const finalizeResp = await this.fetch(finalizeMediaURL, {
            method: 'POST',
        })

        return finalizeResp.json();
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