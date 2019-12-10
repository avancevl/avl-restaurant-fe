
export enum BootRouteName {
    Info = 'info',
    ConfigServer = 'config-server',
    Logger = 'logger',
    MetricsWatch = 'metrics-watch',
    CacheManage = 'cache-manage'
}

export interface BootRoute {
    Info: string[];
    ConfigServer: string[];
    Logger: string[];
    MetricsWatch: string[];
    CacheManage: string[];
}
