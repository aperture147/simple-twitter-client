import { TwitterCredentials } from './resp';
export type TwitterCredentialsUpdateFunction = (
    accountID: string,
    credentials: TwitterCredentials
) => Promise<void>