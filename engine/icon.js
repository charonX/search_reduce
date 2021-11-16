import { getUrlDomain } from '../utils/utils.js'
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
            this.favicon = await Get(this.name)
            const configKeys = Object.keys(Config)
            for (let i = 0; i < configKeys.length; i++) {
                const key = configKeys[i];
                const item = Config[key]
                const domain = getUrlDomain(item.baseUrl)
                if(!this.favicon[domain.host]){
                    let ico = await this.getIcon(domain.origin)
                    this.favicon[domain.host] = ico
                }
            }
        }catch(e){
            console.log(e)
        }

        console.log(this.favicon)
    }
    getFavicon(url){
        return ''
        return this.favicon[getUrlDomain(url).host]
    }
    getIcon(url){
        console.log('url: ', url);
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
}


// export default async function getFavicon(url){
//     let domain = getUrlDomain(url)
//     let fav_storage = await Get(favicon)
//     console.log('fav_storage: ', fav_storage);
//     let result = ''
//     if(fav_storage){
//          result = fav_storage[domain.host]
//          console.log('result: ', result);
//          return result
//     }else{
//         result = await getIcon(domain.origin)
//         console.log('result-get: ', result);
//         return result
//     }
// }