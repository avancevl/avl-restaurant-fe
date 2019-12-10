import { CUI, Combobox } from '@cui/core';

export class CommonUtil {
    /**
     * 清除前後換行空白
     * @param obj
     */
    public static trimStrValue(obj: any) {
        if (!obj) { return obj; }
        if (CUI.isObject(obj)) {
            let value;
            for (let id in obj) {
                value = obj[id];
                if (value && typeof value === 'string') {
                    obj[id] = value.trim();
                }
            }
            return obj;
        } else if (typeof obj === 'string') {
            return obj.trim();
        }
    }

    public static sortStringOrNumber(array: Combobox[]) {
        if (array) {
            array.sort((a, b) => {
                if (isNaN(a.value) || isNaN(b.value)) {
                    return String(a.value).localeCompare(String(b.value));
                } else {
                    return Number(a.value) > Number(b.value) ? 1 : Number(a.value) == Number(b.value) ? 0 : -1;
                }
            });
        }
    }
}
