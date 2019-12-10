
export enum ToolRouteName {
    Api = 'api',
    Date = 'date',
    Proxy = 'proxy',
}

export interface ToolRoute {
    Api: string[];
    Date: string[];
    Proxy: string[];
}
