import { Set, Get} from '../utils/storage.js'
import { getImgDataURI } from '../utils/utils.js'
// import Options from './options.js'

export default class Background{
    constructor(){
        this.name = 'background'
        this.dom = document.getElementById('bg')
        this.btnRefresh = document.getElementById('refreshBg')
        this.config = {}
        this.option = {
            type:'random'
        }
        this.Loading = false
        this.__init()
        this.__addEvent()
    }

    __addEvent(){
        
        this.btnRefresh.addEventListener('click',()=>{
            if(this.Loading) return
            
            this.__checkBackground()
        })
    }
    async __init(){
        let storage = await Get(this.name)
        this.now = this.__getTime()

        if(!!storage[this.name]){
            this.config = storage[this.name]
        }

        if(this.now != this.config['time']){
            this.__checkBackground()
        }else{
            this.__setDom(this.config.data)
        }
    }

    __setDom(imgData){
        this.Loading = false
        this.dom.className = 'animate__animated animate__fadeIn'
        this.dom.style.backgroundImage = `url(${imgData})`
    }

    __setStorage(imgData){
        this.config = {
            time:this.now,
            data:imgData
        }
        Set(this.name,this.config)
    }

    __getTime(){
        let now = new Date()
        return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
    }

    async __checkBackground(){
        this.Loading = true
        let url = ''
        switch(this.option.type){
            case 'bing':
                url =await this.__getBingBG()
                break
            case 'random':
                url = await this.__getRandomBG()
                break
        }

        this.__getBackground(url)
       
    }

    async __getBackground(url){
        try{
            let imgData = await getImgDataURI(url)
            this.__setDom(imgData)
            this.__setStorage(imgData)
        }catch(e){
            
        }
    }
    __getRandomBG(){
        let url = 'https://wallhaven.cc/search?categories=110&purity=100&ratios=16x9%2C21x9%2C16x10&sorting=random&order=desc'
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    messageType: 'fetch',
                    url,
                },
                (res) => {
                    if(res.success){
                        let parser = new DOMParser();
                        let doc_dom = parser.parseFromString(res.data, "text/html");
                        let img_wrap = doc_dom.querySelector('.thumb-listing-page figure')
                        let img_min_url = img_wrap.querySelector('img').getAttribute('data-src')
                        img_min_url = img_min_url.replace('https://th.wallhaven.cc/small/', '')
                        img_min_url = img_min_url.replace('.jpg', '')
                        const [space,name] = img_min_url.split('/')
                        let isPng = img_wrap.querySelector('.png')

                        let imgUrl =  `https://w.wallhaven.cc/full/${space}/wallhaven-${name}${!!isPng ? '.png' : '.jpg'}`
                        if(imgUrl){
                            resolve(imgUrl)
                        }else{
                            reject('dom未找到')
                        }
                        
                    }else{
                        reject(res.err)
                    }
                }
            );
        })
    }
    __getBingBG(){
        let url = 'https://www.bing.com'
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
                        let d = dom.querySelector('.img_cont')
                        let imgUrl =  d.style.backgroundImage
                        if(imgUrl){
                            resolve(url + imgUrl.replace('url("','').replace('")', ''))
                        }else{
                            reject('dom未找到')
                        }
                        
                    }else{
                        reject(res.err)
                    }
                }
            );
        })
    }
}