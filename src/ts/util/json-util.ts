export abstract class JsonUtil {

    private static isJson(content: string): boolean {
        if (content) {
            return /^(\s|\r|\n)*\{(\s|\r|\n)*.*(\s|\r|\n)*\}(\s|\r|\n)*$/.test(content);
        }
        return false;
    }

    /**
     * 字串移除換行空白，讓JSON格式正常
     * @param content 
     */
    public static cleanFormat(content: string): string {
        if (!JsonUtil.isJson(content)) {
            return content;
        }
        let array = [];
        let s, re = true;
        for (let i = 0, l = content.length; i < l; i++) {
            s = content[i];
            switch (s) {
                case '\\':
                    array.push(s);
                    if ((s = content[i + 1]) == '"') {
                        array.push(s);
                        i++;
                    }
                    break;
                case '\n':
                case '\r':
                case ' '://空白
                case ' '://&emsp;
                    if (!re) {
                        array.push(s);
                    }
                    break;
                case '"':
                    re = !re;
                default:
                    array.push(s);
            }
        }
        return array.join('');
    }
}