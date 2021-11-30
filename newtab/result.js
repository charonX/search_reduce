import Icon from '../engine/icon.js'
import Universal from '../engine/universal.js'
import { Config } from '../engine/config.js'
import { changeTitle, changeURLParams, unique } from '../utils/utils.js'

const DEFAULT_SEARCH = ['bing', 'google', 'baidu','github', 'segmentfault']
// const DEFAULT_SITE_SEARCH = ['stackoverflow.com', 'segmentfault.com', 'github', 'zhihu.com']
let engineInterface = {}
let icon_catch = {}
let searchResult = new Map()
let ssrsResult = []
let kw = new URL(window.location.href).searchParams.get('kw')

const icon = new Icon()

async function init(){
    await initIcon(DEFAULT_SEARCH)
    initEngines(DEFAULT_SEARCH)
    batchFetchSearch(kw, 1)

    
    let searchBtn = document.getElementById('serach')
    let searchInput= document.getElementById('searchInput')
    searchInput.value = kw

    searchBtn.addEventListener('click',()=>{
        window.location = changeURLParams("kw",searchInput.value)
    })
    document.addEventListener('keyup', (e)=>{
        if(e.key == 'Enter'){
            window.location = changeURLParams("kw",searchInput.value)
        }
    })
}

async function initIcon(engines){
    const wrap = document.getElementById('search_status')
    let content = ''
    for (let i = 0; i < engines.length; i++) {
        const engineName = engines[i];
        const config = Config[engineName]
        let ico = await icon.getFavicon(config.baseUrl)
        icon_catch[config.name] = ico
        content += __renderIconStatus({
            ico,
            status:'loading avatar-icon',
            name:config.name,
            url:config.baseUrl + config.keyword + '=' + kw
        })
    }
    wrap.innerHTML = content
}

function __renderIconStatus(info){
    let content = `<div class="one"><a href="${info.url}"><figure class="avatar">
        <img src="${info.ico}">
        <span class="${info.status}" icon-status="${info.name}"></span>
        </figure></a></div>`
    return content
}

function initEngines(engines){
    let site_tab = []
    for (let i = 0; i < engines.length; i++) {
        const engineName = engines[i];
        engineInterface[engineName] = new Universal(Config[engineName])
        if(Config[engineName].type == 'site'){
            site_tab.push(engineName)
        }
    }
    __initSiteTab(site_tab)
}

function __initSiteTab(list){
    let dom = document.getElementById('site_tab')
    let content = ''
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        content += `<li class="tab-item ${i==0?'active':''}">
                  <a href="#">${item}</a>
                </li>`
    }
    dom.innerHTML = content
}


// 渲染结果到页面
function __renderResult(){
    let contentWrap= document.getElementById('result')
    let contentHTML = ''
    searchResult.forEach((item)=>{
        contentHTML += item.content
    })
    contentWrap.innerHTML = contentHTML
}

function __renderRRSRContent(){
    let rrsrWrap= document.getElementById('rrsr')
    let rrsrHTML = ''
    for (let i = 0; i < ssrsResult.length; i++) {
        const item = ssrsResult[i];
        rrsrHTML += `<a href="#">${item}</a>`
    }
    rrsrWrap.innerHTML = rrsrHTML
}

function renderSiteResult(){
}

function __updateEngineStatus(engine, status){
    const { name } = engine.config
    let dom = document.querySelector(`[icon-status='${name}']`)
    let class_status = 'loading avatar-icon'
    switch(status){
        case 'error':
            class_status = 'avatar-presence busy'
            break;
        case 'success':
            class_status = 'avatar-presence online'
            break;
        case 'loading':
            class_status = 'loading avatar-icon'
            break;
    }
    dom.className = class_status
}

function __renderResultContent(item ,origin){
    let orgign_content = ''
    for (let i = 0; i < origin.length; i++) {
        const site = origin[i];
        const ico = icon_catch[site]
        orgign_content += `<img src="${ico}">`
    }
    let result = `<div class="result_block">
        <div class="title"><a href="${item.link}" target="_blank">${item.title}</a></div>
        <div class="content">${item.content}</div>
        <div class="link">${orgign_content}<span>${item.link}</span></div>
    </div>
    <div class="divider"></div>`
    return result
}

function __handleResultContent(content, rrsr, config){
    console.log('content, rrsr: ', content, rrsr);
    for (let i = 0; i < content.length; i++) {
        const item = content[i]
        if(searchResult.has(item.link)){
            let t = searchResult.get(item.link)
            t.origin.push(config.name)
            t.content = __renderResultContent(item,t.origin)
        }else{
            searchResult.set(item.link,{
                'origin':[config.name],
                'content':__renderResultContent(item,[config.name])
            })
        }   
    }

    ssrsResult = ssrsResult.concat(rrsr)
    ssrsResult = unique(ssrsResult)
    __renderResult()
    __renderRRSRContent()
}

function __handleSiteContent(content, config){
    console.log('config: ', config);
    console.log('content: ', content);

}

// 检查返回结果
function __checkResult(result, engine){
    const { config } = engine
    const {content, rrsr} = result
    console.log(config.type)
    switch(config.type){
        case 'site':
            __handleSiteContent(content,config)
            break;
        case 'search':
            __handleResultContent(content, rrsr, config)
            break;
    }
}

// 发送搜索请求
function batchFetchSearch(keyword, page){
    changeTitle(keyword)
    let keys = Object.keys(engineInterface)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let engine = engineInterface[key]
        engine.getSearchResult(keyword, page).then((res)=>{
            __updateEngineStatus(engine, 'success')
            __checkResult(res, engine)
        }).catch((e) => {
            console.log(e)
            __updateEngineStatus(engine, 'error')
        })
    }
}

init()