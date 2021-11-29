import { getUrlDomain, getImgDataURI } from '../utils/utils.js'
import { Config } from '../engine/config.js'
import { Set, Get} from '../utils/storage.js'


export default class Icon{
    constructor(){
        this.name = 'favicon'
        this.favicon = {}
        this.initIcon()
    }
    async initIcon(){
        try{
            let storage = await Get(this.name)
            if(!!storage[this.name]){
                this.favicon = storage[this.name]
                return
            }
            Set(this.name, this.favicon)
            
            const configKeys = Object.keys(Config)
            for (let i = 0; i < configKeys.length; i++) {
                const key = configKeys[i];
                const item = Config[key]
                const domain = getUrlDomain(item.baseUrl)
                let ico = await this.__getIcon(domain.origin)
                this.__updateFavicon(domain.host, ico)
            }

        }catch(e){
            console.log(e)
        }
    }
    async getFavicon(url){
        let domain = getUrlDomain(url)
        const result = this.favicon[domain.host]
        if (result) return result
        
        let ico = await this.__getIcon(domain.origin)
        let imgData = await getImgDataURI(ico)
        this.__updateFavicon(domain.host, imgData)
        return ico
    }
    __getIcon(url){
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    messageType: 'fetch',
                    url,
                },
                (res) => {
                    if(res.success){
                        let parser = new DOMParser();
                        let dom = parser.parseFromString(res.data, "text/html");
                        let d = dom.querySelector('link[rel="shortcut icon"]')
                        if(d){
                            let d_url = new URL(d.href)
                            if(d_url.protocol.includes('http')){
                                resolve(d.href)
                            }else{
                                resolve(url + d_url.pathname)
    
                            }
                        }else{
                            resolve(url + '/favicon.ico')
                        }
                    }else{
                        reject(res.err)
                    }
                }
            );
        })
    }
    __updateFavicon(name,value){
        this.favicon[name] = value
        Set(this.name, this.favicon)
    }
}