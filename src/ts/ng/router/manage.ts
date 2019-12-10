
export enum ManageRouteName {
    Role = 'role',
    User = 'user',
    AccessLog = 'access-log',
    AccessLogGroup = 'access-log-group',
    Api = 'api',
    Route = 'route',
    ExceptionLog = 'exception-log',
    Session = 'session',
}

export interface ManageRoute {
    Role: string[];
    User: string[];
    AccessLog: string[];
    AccessLogGroup: string[];
    Api: string[];
    Route: string[];
    ExceptionLog: string[];
    Session: string[];
}
