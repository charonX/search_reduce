import { objToQuery, getHiddenParams } from '../utils/utils.js'
import { getContentWithRule, getRRSRWithRUle } from '../utils/utils.js'

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
            [this.config.keyword]:this.checkkw(keyword),
        }
        let url_params = Object.assign(p, this.params)
        let result = this.config.baseUrl + objToQuery(url_params)

        return result
    }

    checkkw(keyword){
        return keyword.replaceAll(' ',this.config.space)
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

        let result = {
            content:getContentWithRule(dom, this.config.rule),
            rrsr : this.__getRRSR(dom)
        }

        return result
    }

    __getRRSR(dom){
        const rule = this.config.rule['rrsr']
        let result=  getRRSRWithRUle(dom, rule)
        return result
    }

    __updateSearchParams(dom){
        let newParams = getHiddenParams(dom)
        this.params = Object.assign({}, this.config.params, newParams) 
    }
}