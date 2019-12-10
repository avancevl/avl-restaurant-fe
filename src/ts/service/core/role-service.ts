import {
	AjaxMethod,
	AjaxTryCatch,
	AjaxUtil,
	Combobox,
	ComboboxCallback,
	ComboboxData,
	CUI
} from '@cui/core';
import { ApiPath } from '../../constant/api';
import { Asserts } from '../../util/asserts';
import { Global } from '../../globle';

export interface RoleCombobox extends Combobox {
	level: number;
	platformId: string;
}


export interface RoleComboboxData extends ComboboxData<RoleCombobox> {
	levelMap: any;
}
/**
 * 角色
 */
export class RoleService {

	/**
	 * 查詢
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static page(formData, callback) {
		Global.ajaxManager.request({
			url: ApiPath.GetRolePage,
			data: formData,
			callback: callback
		});
	}

	/**
	 * 新增
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static add(formData, callback) {
		Asserts.notEmpty(formData.name, 'name' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.level, 'level' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PostRole,
			method: AjaxMethod.POST,
			headers: AjaxUtil.ContentTypeJson,
			data: JSON.stringify(formData),
			callback: callback
		});
	}

	/**
	 * 修改
	 * @param {Object} formData
	 * @param {Function} callback
	 */
	@AjaxTryCatch(1)
	public static modify(formData, callback) {
		Asserts.notEmpty(formData.id, 'id' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.name, 'name' + Asserts.NotEmptyMessage);
		Asserts.notEmpty(formData.level, 'level' + Asserts.NotEmptyMessage);
		Global.ajaxManager.request({
			url: ApiPath.PutRole,
			method: AjaxMethod.PUT,
			headers: AjaxUtil.ContentTypeJson,
			data: JSON.stringify(formData),
			callback: callback
		});
	}

	/**
	 * 查詢角色等級下拉選單
	 * @param {Function} callback
	 */
	@AjaxTryCatch(0)
	public static combobox(callback: ComboboxCallback<RoleComboboxData>) {
		Global.ajaxManager.request({
			url: ApiPath.GetRoleCombobox,
			callback: function (result) {
				if (!result.success) {
					alert(AjaxUtil.getMessage(result));
					callback({ array: [], map: {}, levelMap: {} });
					return;
				}
				let array: RoleCombobox[] = result.data;
				let data: RoleCombobox;
				let valueNames = {};
				let valueLevels = {};
				for (let i in array) {
					data = array[i];
					data.name = data.name + '(' + data.level + ')';
					valueNames[data.value] = data.name;
					valueLevels[data.value] = data.level;
				}
				callback({ array: array, map: CUI.comboboxToValueName(array), levelMap: valueLevels });
			}
		});
	}
}
