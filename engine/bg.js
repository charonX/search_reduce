import { Set, Get} from '../utils/storage.js'
import { getImgDataURI } from '../utils/utils.js'

export default class Background{
    constructor(){
        this.name = 'background'
        this.dom = document.getElementById('bg')
        this.btnRefresh = document.getElementById('refreshBg')
        this.config = {}
        this.__init()
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

    __checkBackground(){
        // 未来判断背景图类型设置用
        // 背景图网站
        // https://wallhaven.cc/latest?page=2
        this.__getBackground()
    }

    async __getBackground(){
        try{
            let url = await this.__getBingBG()
            let imgData = await getImgDataURI(url)
            this.__setDom(imgData)
            this.__setStorage(imgData)
        }catch(e){
            console.error(e)
        }
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