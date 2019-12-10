import { AjaxMethod, AjaxTryCatch, CUI } from '@cui/core';
import { ApiPath } from '../../constant/api';
import { Asserts } from '../../util/asserts';
import { Global } from '../../globle';
import { JSEncrypt } from 'jsencrypt';

/**
 * 基本服務
 */
export class BasicService {
	/**
	 * 初始化
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static init(callback?) {
		Global.ajaxManager.request({
			url: ApiPath.GetPublicInit
			, callback: callback
			, background: true
		});
	}

	/**
	 * 透過特徵key取得公鑰
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static wow(callback) {
		Global.ajaxManager.request({
			url: ApiPath.PostPublicWow
			, method: AjaxMethod.POST
			, background: true
			, callback: callback
		});
	}


	/**
	 * 登錄
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static login(formData, callback) {
		Asserts.notEmpty(formData.account, 'account' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.password, 'password' + Asserts.NotEmptyMessage);
		let _formData = CUI.deepClone(formData);
		// 先取得公鑰
		BasicService.wow((result) => {
			if (result.success) {
				let jsencrypt = new JSEncrypt();
				jsencrypt.setPublicKey(result.data);
				_formData.password = jsencrypt.encrypt(_formData.password);
				Global.ajaxManager.request({
					url: ApiPath.PostPublicLogin
					, method: AjaxMethod.POST
					, data: _formData
					, callback: callback
				});
			} else {
				callback(result);
			}
		});
	}

	/**
	 * 登出
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static logout(callback?) {
		Global.ajaxManager.request({
			url: ApiPath.DeletePublicLogout
			, method: AjaxMethod.DELETE
			, callback: callback
		});
	}

	/**
	 * 刷新
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static refresh(callback?) {
		Global.ajaxManager.request({
			url: ApiPath.PutPublicRefresh
			, method: AjaxMethod.PUT
			, callback: callback
		});
	}
}
