import { objToQuery, getHiddenParams } from '../utils/utils.js'


export default class Baidu{
    constructor(){
        this.rule = {
            result:'.result.c-container.new-pmd',
            title:'h3 > a',
            content:'.c-abstract',
            link:'h3 > a'
        }
        this.params = {
            rn :20, // pageSize
            tn:"baiduhome_pg",
            ie:'utf-8',
            rsv_idx:2,
            rsv_spt:1, // 识别浏览器
        }

        this.baseUrl = 'https://www.baidu.com/s?'
    }

    updateBaiduParams(dom){
        let newParams = getHiddenParams(dom)
        this.params = Object.assign({},DEFAULT_PARAMS,newParams) 
    }

    getSearchUrl(keyword, page = 1){
        let url_params = Object.assign({
            wd:encodeURIComponent(keyword),
            op:encodeURIComponent(keyword),
            pn:( page - 1 ) * this.params.rn
        }, this.params)

        let result = this.baseUrl + objToQuery(url_params)

        return result
    }
}