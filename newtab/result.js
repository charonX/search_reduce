import Icon from '../engine/icon.js'
import Universal from '../engine/universal.js'
import { Config } from '../engine/config.js'
import { changeTitle, changeURLParams, unique } from '../utils/utils.js'

const DEFAULT_SEARCH = ['bing', 'google', 'baidu']
const DEFAULT_SITE_SEARCH = ['stackoverflow.com', 'segmentfault.com', 'github', 'zhihu.com']
let engineInterface = {}
let icon_catch = {}
let searchResult = new Map()
let ssrsResult = []

const icon = new Icon()

async function init(){
    await initIcon(DEFAULT_SEARCH)
    initEngines(DEFAULT_SEARCH)
    let kw = new URL(window.location.href).searchParams.get('kw')
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
        content += __renderIconStatus({ico,status:'loading',name:config.name})
    }
    wrap.innerHTML = content
}

function __renderIconStatus(info){
    let content = `<div class="one"><figure class="avatar">
        <img src="${info.ico}">
        <span class="avatar-icon ${info.status}" icon-status="${info.name}"></span>
        </figure></div>`
    return content
}

function initEngines(engines){
    for (let i = 0; i < engines.length; i++) {
        const engineName = engines[i];
        engineInterface[engineName] = new Universal(Config[engineName])
    }
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
    console.log("🚀 ~ file: result.js ~ line 91 ~ __updateEngineStatus ~ dom", dom)
    switch(status){
        case 'error':
            break
        case 'success':
            break
    }
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

// 检查返回结果
function __checkResult(result, engine){
    const {content, rrsr} = result;
    console.log('content, rrsr: ', content, rrsr);
    for (let i = 0; i < content.length; i++) {
        const item = content[i];
        if(searchResult.has(item.link)){
            let t = searchResult.get(item.link)
            t.origin.push(engine.config.name)
            t.content = __renderResultContent(item,t.origin)
        }else{
            searchResult.set(item.link,{
                'origin':[engine.config.name],
                'content':__renderResultContent(item,[engine.config.name])
            })
        }   
    }

    ssrsResult = ssrsResult.concat(rrsr)
    ssrsResult = unique(ssrsResult)
    __renderResult()
    __renderRRSRContent()
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