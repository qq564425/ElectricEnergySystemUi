/**
 * js工具类
 */

/*
 * 时间日期格式化
 * @param time 时间字符串
 * @param format 要输出的格式
 */
export function format(time, format){
    if(time==''||time==undefined||time==null)
        return '';
    var t = new Date(Date.parse(time.toString().replace(/-/g,"/")));
    var tf = function(i){return (i < 10 ? '0' :'') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a)
    {
        switch(a)
        {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}


/*
 * 获取cookie
 * @param cname cookie名称
 */
export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}


/*
 * 设置cookie
 * @param cname cookie名称
 * @param cvalue cookie值
 */
export function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + "; ";
}