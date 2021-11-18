import { Set, Get} from '../utils/storage.js'

export default class Shortcut{
    constructor(icon){
        this.name = 'shortcut'
        this.shortcuts = []
        this.icon = icon
        this.dom = document.getElementById('topViews')
        this.__addEvent()
        this.__init()
    }
    async __init(){
        try{
            let storage = await Get(this.name)
            if(storage[this.name]){
                this.shortcuts = storage[this.name]
                this.__renderTopSites()
            }else{
                this.__getTopSites()
            }
        }
        catch(e){
            console.log('e: ', e)
        }
    }
    async __renderTopSites(){
        let list = this.shortcuts
        let result = ''
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            let img_url = await this.icon.getFavicon(item.url)
            let src = img_url
            let li = `<div class="chip">
                    <img src="${src}" class="avatar avatar-sm">
                    <a href="${item.url}">${item.title}</a>
                    <span data-index="${i}" class="btn btn-clear" aria-label="Close"></span>
                </div>`
            result+=li
        }
        this.dom.innerHTML = result
    }

    __getTopSites(){
        chrome.topSites.get((urls)=>{
            this.shortcuts = urls
            this.__renderTopSites()
        })
    }

    __addEvent(){
        this.dom.addEventListener('click',(e)=>{
            let target = e.target
            if(target.className == 'btn btn-clear'){
                this.remove(+target.dataset.index)
                this.__renderTopSites()
            }
        })
    }
    add(){

    }
    remove(index){
        console.log(index)
        this.shortcuts.splice(index,1)
        this.__setStorage()
    }

    __setStorage(){
        Set(this.name, this.shortcuts)
    }
}

