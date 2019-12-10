import { AjaxTryCatch, IAjaxManagerResultCallback } from "@cui/core";
import { Global } from "ts/globle";
import { ApiPath } from "ts/constant/api";


interface EurekaServiceInstance {
    instanceId: string;
    serviceId: string;
    host: string;
    port: string;
    secure: string;
    uri: string;
    metadata: any;
    scheme: any;
}

/**
 * 註冊在 Eureka 的微服務
 */
export class DiscoveryService {

	/**
	 * 查詢服務列表
	 * @param {Function} callback
	 */
    @AjaxTryCatch(0)
    public static service(callback: IAjaxManagerResultCallback<string[]>) {
        Global.ajaxManager.request({
            url: ApiPath.GetDiscoveryService
            , callback: callback
        });
    }

	/**
	 * 查詢服務詳情
	 * @param {Function} callback
	 */
    @AjaxTryCatch(1)
    public static instance(id: string, callback: IAjaxManagerResultCallback<EurekaServiceInstance[]>) {
        Global.ajaxManager.request({
            url: ApiPath.GetDiscoveryInstance
            , data: { id: id }
            , callback: callback
        });
    }
}