import { objToQuery, getHiddenParams } from '../utils/utils.js'
import { getContentWithRule } from '../utils/utils.js'

export default class Universal{
    constructor(config){
        this.config = config
        this.searchResult = ''
        this.params = this.config.params
    }

    getSearchResult(keyword, page = 1){
        return new Promise((resolve, reject) => {
            const url = this.getSearchUrl(keyword, page)
            this.fetchUrl(url).then((res)=>{
                resolve(this.getContent(res))
            }).catch((res)=>{
                reject(res)
            })
        })
    }

    getSearchUrl(keyword, page){
        let p = {
            [this.config.keyword]:encodeURIComponent(keyword),
        }
        let url_params = Object.assign(p, this.params)
        console.log('url_params: ', url_params);
        let result = this.config.baseUrl + objToQuery(url_params)
        console.log('result: ', result);

        return result
    }

    fetchUrl(url){
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    messageType: 'fetch',
                    url,
                },
                (res) => {
                    if(res.success){
                        resolve(res.data)
                    }else{
                        reject(res.err)
                    }
                }
            );
        })
        
    }
    getContent(res){
        let parser = new DOMParser();
        let dom = parser.parseFromString(res, "text/html");

        this.searchResult = dom
        console.log('dom: ', dom);

        let result = getContentWithRule(dom, this.config.rule)
        // this.__updateSearchParams(dom)

        return result
    }

    __updateSearchParams(dom){
        let newParams = getHiddenParams(dom)
        this.params = Object.assign({}, this.config.params, newParams) 
    }
}