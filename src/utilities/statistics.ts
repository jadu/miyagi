import { SentimentExtract } from '../interfaces/SentimentExtract';
import { UserMap, SortableUserMap } from '../interfaces/Users';

export function createSortableUserObject (
    input: UserMap
): SortableUserMap {
    return Object.keys(input).map((key: string) => {
        return [ key, input[key] ];
    }).sort((a: number[], b: number[]) => b[1] - a[1]);
}

export function createUserObject (
    extracts: SentimentExtract[]
): UserMap {
    return extracts.reduce((userMap, extract) => {
        extract.suggestions.forEach(suggestion => {
            if (!userMap.hasOwnProperty(suggestion.user_id)) {
                userMap[suggestion.user_id] = 0;
            } else {
                userMap[suggestion.user_id] += 1;
            }
        })
        return userMap;
    }, {});
}

export function countSortableObjectValues (
    input: SortableUserMap
): number {
    return input.reduce((total, key) => {
        return total += key[1];
    }, 0);
}
