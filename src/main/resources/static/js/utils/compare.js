/**
 * 【文本比较插件】
 * 传递两个参数dom1、dom2，以dom1为基准进行比较。
 * 0）dom1和dom2不能都为空；
 * 1）如果dom1不存在，则dom2为新增效果
 * 2）如果dom2不存在，则dom1为删除效果
 * 3）如果dom1和dom2存在，则进行文本差异比较
 *
 */
(function(window,document){
    function MyCompare(dom1,dom2){
        if(!dom1&&!dom2){
            console.log('参数错误：dom1、dom2不能为空。');
            return;
        }
        else if(!dom1){
            //dom1为空：新增
            dom2.style.color = '#90EE90';
        }else if(!dom2){
            //dom2为空：删除
            dom1.style.color = '#FF6347';
            dom1.style.textDecoration = 'line-through';
        }else{
            //进行差异比较
            var result = _eq({value1:dom1.innerText||dom1.innerHTML,value2:dom2.innerText||dom2.innerHTML});
            dom1.innerHTML = result.value1;
            dom2.innerHTML = result.value2;
        }
    }
    function _eq(op) {
        if(!op){
            return op;
        }
        if(!op.value1_style){
            op.value1_style="background-color:#FEC8C8;";
        }
        if(!op.value2_style){
            op.value2_style="background-color:#FEC8C8;";
        }
        if(!op.eq_min){
            op.eq_min=3;
        }
        if(!op.eq_index){
            op.eq_index=5;
        }
        if (!op.value1 || !op.value2) {
            return op;
        }
        var ps = {
            v1_i: 0,
            v1_new_value: "",
            v2_i: 0,
            v2_new_value: ""
        };
        while (ps.v1_i < op.value1.length && ps.v2_i < op.value2.length) {
            if (op.value1[ps.v1_i] == op.value2[ps.v2_i]) {
                ps.v1_new_value += op.value1[ps.v1_i].replace(/</g,"<").replace(">",">");
                ps.v2_new_value += op.value2[ps.v2_i].replace(/</g,"<").replace(">",">");
                ps.v1_i += 1;
                ps.v2_i += 1;
                if (ps.v1_i >= op.value1.length) {
                    ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i).replace(/</g,"<").replace(">",">") + "</span>";
                    break;
                }
                if (ps.v2_i >= op.value2.length) {
                    ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i).replace(/</g,"<").replace(">",">") + "</span>";
                    break;
                }
            } else {
                ps.v1_index = ps.v1_i + 1;
                ps.v1_eq_length = 0;
                ps.v1_eq_max = 0;
                ps.v1_start = ps.v1_i + 1;
                while (ps.v1_index < op.value1.length) {
                    if (op.value1[ps.v1_index] == op.value2[ps.v2_i + ps.v1_eq_length]) {
                        ps.v1_eq_length += 1;
                    } else if (ps.v1_eq_length > 0) {
                        if (ps.v1_eq_max < ps.v1_eq_length) {
                            ps.v1_eq_max = ps.v1_eq_length;
                            ps.v1_start = ps.v1_index - ps.v1_eq_length;
                        }
                        ps.v1_eq_length = 0;
                        break;//只寻找最近的
                    }
                    ps.v1_index += 1;
                }
                if (ps.v1_eq_max < ps.v1_eq_length) {
                    ps.v1_eq_max = ps.v1_eq_length;
                    ps.v1_start = ps.v1_index - ps.v1_eq_length;
                }

                ps.v2_index = ps.v2_i + 1;
                ps.v2_eq_length = 0;
                ps.v2_eq_max = 0;
                ps.v2_start = ps.v2_i + 1;
                while (ps.v2_index < op.value2.length) {
                    if (op.value2[ps.v2_index] == op.value1[ps.v1_i + ps.v2_eq_length]) {
                        ps.v2_eq_length += 1;
                    } else if (ps.v2_eq_length > 0) {
                        if (ps.v2_eq_max < ps.v2_eq_length) {
                            ps.v2_eq_max = ps.v2_eq_length;
                            ps.v2_start = ps.v2_index - ps.v2_eq_length;
                        }
                        ps.v1_eq_length = 0;
                        break;//只寻找最近的
                    }
                    ps.v2_index += 1;
                }
                if (ps.v2_eq_max < ps.v2_eq_length) {
                    ps.v2_eq_max = ps.v2_eq_length;
                    ps.v2_start = ps.v2_index - ps.v2_eq_length;
                }
                if (ps.v1_eq_max < op.eq_min && ps.v1_start - ps.v1_i > op.eq_index) {
                    ps.v1_eq_max = 0;
                }
                if (ps.v2_eq_max < op.eq_min && ps.v2_start - ps.v2_i > op.eq_index) {
                    ps.v2_eq_max = 0;
                }
                if ((ps.v1_eq_max == 0 && ps.v2_eq_max == 0)) {
                    ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1[ps.v1_i].replace(/</g,"<").replace(">",">") + "</span>";
                    ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2[ps.v2_i].replace(/</g,"<").replace(">",">") + "</span>";
                    ps.v1_i += 1;
                    ps.v2_i += 1;

                    if (ps.v1_i >= op.value1.length) {
                        ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i).replace(/</g,"<").replace(">",">") + "</span>";
                        break;
                    }
                    if (ps.v2_i >= op.value2.length) {
                        ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i).replace(/</g,"<").replace(">",">") + "</span>";
                        break;
                    }
                } else if (ps.v1_eq_max > ps.v2_eq_max) {
                    ps.v1_new_value += "<span style='" + op.value1_style + "'>" + op.value1.substr(ps.v1_i, ps.v1_start - ps.v1_i).replace(/</g,"<").replace(">",">") + "</span>";
                    ps.v1_i = ps.v1_start;
                } else {
                    ps.v2_new_value += "<span style='" + op.value2_style + "'>" + op.value2.substr(ps.v2_i, ps.v2_start - ps.v2_i).replace(/</g,"<").replace(">",">") + "</span>";
                    ps.v2_i = ps.v2_start;
                }
            }
        }
        op.value1 = ps.v1_new_value;
        op.value2 = ps.v2_new_value;
        return op;
    }
    window.CompareTxt = MyCompare;
})(window,document);