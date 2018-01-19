declare module 'reqwest';
declare module '*.png';

declare function reqwest ({}: { [index: string]: any }): Promise<any>;

declare interface WebClient {
    [index: string]: any;
}

declare interface RtmClient {
    [index: string]: any;
}
