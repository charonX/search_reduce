import { Set, Get} from '../utils/storage.js'

export default class Shortcut{
    constructor(){
        this.name = 'shortcut'
        this.shortcuts = []
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

    __getTopSites(){
        chrome.topSites.get((urls)=>{
            console.log('urls: ', urls);
        })
    }
    get(){}
    add(){}
    remove(){}
}