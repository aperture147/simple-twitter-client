import { TwitterCredentials } from './schema';
export type TwitterCredentialsUpdateFunction = (accountID: string, credentials: TwitterCredentials) => Promise<void>