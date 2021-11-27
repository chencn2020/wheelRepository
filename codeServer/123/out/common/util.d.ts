export interface Options {
    base: string;
    commit: string;
    logLevel: number;
    pid?: number;
}
/**
 * Split a string up to the delimiter. If the delimiter doesn't exist the first
 * item will have all the text and the second item will be an empty string.
 */
export declare const split: (str: string, delimiter: string) => [string, string];
export declare const plural: (count: number) => string;
export declare const generateUuid: (length?: number) => string;
/**
 * Remove extra slashes in a URL.
 */
export declare const normalize: (url: string, keepTrailing?: boolean) => string;
/**
 * Get options embedded in the HTML or query params.
 */
export declare const getOptions: <T extends Options>() => T;
