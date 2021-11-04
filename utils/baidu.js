import { objToQuery } from './utils.js'

export function setBaiduUrl(keyword,page=1){
    console.log(keyword)
    let url_params={
        wd:keyword,
        pn:page,
        op:keyword,
        rn:20, // pageSize
        tn:"baiduhome_pg",
        ie:'utf-8',
        rsv_idx:2,
        rsv_spt:1, // 识别浏览器
    }
    return 'https://www.baidu.com/s?' + objToQuery(url_params)
}

export function getBaiduParams(text){
    let result = {}
    let parser = new DOMParser();
    let dom = parser.parseFromString(text, "text/html");
    let inputs = dom.querySelectorAll('input[type=hidden]')
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        result[input.name] = input.value
    }
    console.log(result)
}
