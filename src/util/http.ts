import {
    TwitterClientUserException,
    TwitterClientAPIException
} from '../exception';

/**
 * Check for the response from fetch
 * 
 * @param resp Response object from fetch
 * 
 * @throws {TwitterClientAPIException}
 * This exception is thrown if the response is not ok, embed the status code and the response body
 */
export async function checkTwitterResponse(resp: Response) {
    if (!resp.ok) {
        const jsonData = await resp.json()
        let errorList = []
        if ('errors' in jsonData) {
            for (const error of jsonData.errors) {
                errorList.push(`${error.title} (${error.detail})`)
            }
        } else if ('title' in jsonData) {
            errorList.push(`${jsonData.title} (${jsonData.detail})`)
        } else {
            errorList.push('Unknown error')
        }
        const errorMsg = `Twitter API error: ` + errorList.join(', ')
        
        throw new TwitterClientAPIException(
            resp.status,
            errorMsg,
            new URL(resp.url).pathname,
            jsonData
        );
    }
}

export function setQueryParams(
    searchParams: URLSearchParams,
    params?: Record<string, any>,
    requiredParams?: Iterable<string>
): void {
    // If there are no params, exit now
    if (!params) return;
    const missingParamSet = new Set(requiredParams).difference(new Set(Object.keys(params)));
    if (missingParamSet.size)
        throw new TwitterClientUserException(`Missing required parameter: ${[...missingParamSet].join("")}`);
    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            searchParams.append(key, value.join(','));
            continue;
        }
        searchParams.append(key, value.toString());
    }
}