import { TwitterCredentials } from './resp';
export type OnTwitterCredentialsUpdateFunction = (
    accountID: string,
    credentials: TwitterCredentials
) => Promise<void>