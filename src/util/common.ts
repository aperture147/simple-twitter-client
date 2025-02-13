import { TwitterClientUserException } from '../exception';

export function checkKeyExists(
    object: Record<string, any>,
    requiredKeys: Iterable<string>
): void {
    const missingParamSet = new Set(requiredKeys).difference(new Set(Object.keys(object)));
    if (!missingParamSet.size)
        return
    throw new TwitterClientUserException(`Missing required parameter: ${[...missingParamSet].join("")}`);
}