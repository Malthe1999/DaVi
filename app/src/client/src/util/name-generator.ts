import {uniqueNamesGenerator} from 'unique-names-generator';
import * as names from 'unique-names-generator';

export const randomName = (seed: string) => {
    return uniqueNamesGenerator({
        dictionaries: [names.adjectives, names.colors, names.animals],
        separator: '-',
        seed: seed,
    });
}
