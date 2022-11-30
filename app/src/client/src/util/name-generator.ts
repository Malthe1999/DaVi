import {uniqueNamesGenerator} from 'unique-names-generator';
import * as names from 'unique-names-generator';

export const randomNameAdj = (seed: string) => {
    return uniqueNamesGenerator({
        dictionaries: [names.adjectives],
        separator: '-',
        seed: seed,
    });
}
export const randomNameCol = (seed: string) => {
    return uniqueNamesGenerator({
        dictionaries: [names.colors],
        separator: '-',
        seed: seed,
    });
}
export const randomNameAni = (seed: string) => {
    return uniqueNamesGenerator({
        dictionaries: [names.animals],
        separator: '-',
        seed: seed,
    });
}
export const randomNameStarWars = (seed: string) => {
    return uniqueNamesGenerator({
        dictionaries: [names.starWars],
        separator: '-',
        seed: seed,
    });
}
