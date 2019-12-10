export interface Apis {
    get: string[];
    post: string[];
    put: string[];
    delete: string[];
}

/**
 * 登錄後使用者物件
 */
export interface AuthUser {
    /**PK */
    id: number;
    /**帳號 */
    account: string;
    /**密碼 */
    password: string;
    /**名稱 */
    name: string;
    /**平台 */
    platformId: string;
    /**登錄錯誤次數 */
    loginFailCount: number;
    /**凍結 */
    locked: boolean;
    /**啟用 */
    enabled: boolean;
    /**權限等及 */
    level: number;
    /** 角色*/
    authId: number;
    /**選單 */
    routes: AuthRoute[];
    /**訪問權限 */
    apis: Apis;
}

/**
 * 登錄後使用者選單物件
 */
export interface AuthRoute {
    /** test */
    id: number;
    parentId: number;
    name: string;
    type: number;
    className: string;
    path: string;
    sort: number;
    active?: boolean;
}


/**
 * RequestSession
 */
export interface RequestSession {
    id: string;
    maxInactiveInterval: number;
    createTime: number;
    lastAccessedTime: number;
    username: string;
    attributes: string;
}
