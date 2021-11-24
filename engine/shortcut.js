import { Set, Get} from '../utils/storage.js'

export default class Shortcut{
    constructor(icon){
        this.name = 'shortcut'
        this.shortcuts = []
        this.icon = icon
        this.dom = document.getElementById('topViews')
        this.modelDom = document.getElementById('addShortCut')
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
            let img_url = ''
            try{
                let icon = await this.icon.getFavicon(item.url)
                img_url = `<img src="${icon}" class="avatar avatar-sm">`
            }catch(e){
                console.log(e)
                img_url = `<figure class="avatar" data-initial="${item.title.substring(0,1)}" style="background-color: #5755d9;"></figure>`
            }
            let li = `<a href="${item.url}" class="tile">
                    <i class="icon icon-delete" data-index="${i}" aria-label="delete" title="删除"></i>
                    <i class="icon icon-edit" data-index="${i}" aria-label="edit" title="编辑"></i>
                    <div class="tile-icon">${img_url}</div>
                    <div class="tile-title"><span>${item.title}</span></div>
                </a>`
            result+=li
        }
        if(list.length < 10){
            result += `<a href="#" class="tile" aria-label="new">
            <div class="tile-icon"><i class="icon icon-plus"></i></div>
            <div class="tile-title"><span>添加快捷方式</span></div>
        </a>`
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
            let type = target.getAttribute('aria-label')
            switch(type){
                case 'delete':
                    e.preventDefault();
                    this.remove(+target.dataset.index)
                    return
                case 'edit':
                    e.preventDefault();
                    this.add(+target.dataset.index)
                    return
                case 'new':
                    e.preventDefault();
                    this.add()
                    return
            }
        })

        this.modelDom.addEventListener('click',(e)=>{
            let target = e.target
            let type = target.getAttribute('aria-label')
            switch(type){
                case 'Close':
                    this.modelDom.classList.remove("active");
                    return
                case 'Submit':
                    this.submit()
                    this.modelDom.classList.remove("active");
                    return
            }

        })
    }
    add(index){
        let data = this.shortcuts[index]
        let contentDom = document.getElementById('modal-content')
        let title = this.modelDom.querySelector('.modal-title')

        if(!!data){
            title.innerText = '编辑'
            this.modelDom.setAttribute('data-index',index)
        }else{
            title.innerText = '新建'
            data = {}
        }

        let content = `<div class="form-group">
            <label class="form-label" for="input-example-7">名称</label>
            <input class="form-input" id="input-example-7" type="text" placeholder="Name" value="${data.title || ''}">
        </div>
        <div class="form-group">
            <label class="form-label" for="input-example-7">网址</label>
            <input class="form-input" id="input-example-7" type="text" placeholder="URL" value="${data.url || ''}">
        </div>`
        contentDom.innerHTML = content
        this.modelDom.classList.add("active");
    }
    remove(index){
        this.shortcuts.splice(index,1)
        this.__setStorage()
    }

    submit(){
        let index = this.modelDom.getAttribute('data-index')
        let input = this.modelDom.querySelectorAll('input')
        let name = input[0].value
        let url = input[1].value
        if (!!name && !!url){
            if(index == ''){
                this.shortcuts.push({
                    title:name,
                    url,
                })
            }else{
                this.shortcuts[index] = {
                    title:name,
                    url,
                }
            }
            this.__setStorage()
        }

    }

    __setStorage(){
        Set(this.name, this.shortcuts)
        this.__renderTopSites()
    }
}

