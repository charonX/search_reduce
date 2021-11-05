import { objToQuery } from '../utils/utils.js'

export function setBaiduUrl(keyword,page=1){
    let url_params={
        wd:encodeURIComponent(keyword),
        pn:page?page:1,
        op:encodeURIComponent(keyword),
        rn:20, // pageSize
        tn:"baiduhome_pg",
        ie:'utf-8',
        rsv_idx:2,
        rsv_spt:1, // 识别浏览器
    }
    return 'https://www.baidu.com/s?' + objToQuery(url_params)
}

export function getBaiduParams(dom){
    let result = {}
    let inputs = dom.querySelectorAll('input[type=hidden]')
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        result[input.name] = input.value
    }
}
