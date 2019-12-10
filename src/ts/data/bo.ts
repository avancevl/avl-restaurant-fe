export interface HttpRequestBO {
    url: string;
    method: string;
    headers: string;
    params: string;
    body: string;
    connectionTimeout: number;
    readTimeout: number;
}