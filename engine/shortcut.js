import { Set, Get} from '../utils/storage.js'

export default class Shortcut{
    constructor(icon){
        this.name = 'shortcut'
        this.shortcuts = []
        this.icon = icon
        this.__init()
    }
    async __init(){
        try{
            let storage = await Get(this.name)
            if(storage[this.shortcuts]){
                return storage[this.shortcuts]
            }else{
                this.__getTopSites()
            }
        }
        catch(e){
            console.log('e: ', e)
        }
    }
    async __renderTopSites(list){
        let wrap = document.getElementById('topViews')
        let result = ''
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            let img_url = await this.icon.getFavicon(item.url)
            let src = img_url
            let li = `<div class="chip" data-url="${item.url}"">
                <img src="${src}" class="avatar avatar-sm">
                ${item.title}
                <a href="#" class="btn btn-clear" aria-label="Close" role="button"></a>
                </div>`
            result+=li
        }
        wrap.innerHTML = result
    }

    __getTopSites(){
        chrome.topSites.get((urls)=>{
            console.log('urls: ', urls);
            this.__renderTopSites(urls)
        })
    }
    get(){}
    add(){}
    remove(){}
}

