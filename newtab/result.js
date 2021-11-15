import Universal from '../engine/universal.js'
import { Config } from '../engine/config.js'

const DEFAULT = ['google', 'bing', 'baidu']
let engineInterface = {}
let searchResult = {}

function init(){
    initEngines(DEFAULT)
    let kw = new URL(window.location.href).searchParams.get('kw')
    batchFetchSearch(kw, 1)

    
    let searchBtn = document.getElementById('serach')
    let searchInput= document.getElementById('searchInput')
    searchInput.value = kw

    searchBtn.addEventListener('click',()=>{
        batchFetchSearch(searchInput.value, 1)
    })
    document.addEventListener('keyup', (e)=>{
        if(e.key == 'Enter'){
            batchFetchSearch(searchInput.value, 1)
        }
    })
}

function chengePageTitle(text){
    document.title = `${text} - Search Reduce` 
}

function initEngines(engines){
    for (let i = 0; i < engines.length; i++) {
        const engineName = engines[i];
        engineInterface[engineName] = new Universal(Config[engineName])
    }
}


// 渲染结果到页面
function renderResult(){
    let wrap= document.getElementById('result')
    let a = ''
    let cc = []
    for (const key in searchResult) {
        if (Object.hasOwnProperty.call(searchResult, key)) {
            const result = searchResult[key];
            for (let i = 0; i < result.length; i++) {
                const item = result[i];
                cc.push(item)
                let c = `<div class="result_block">
                    <div class="title"><a href="${item.link}" target="_blank">${item.title}</a></div>
                    <div class="content">${item.content}</div>
                </div>`

                a+=c
            }
        }
    }
    console.log(cc)
    wrap.innerHTML = a
}

function batchFetchSearch(keyword, page){
    chengePageTitle(keyword)
    let keys = Object.keys(engineInterface)
    let promise_all = []
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let engine = engineInterface[key]
        promise_all.push(engine.getSearchResult(keyword, page))
    }
    Promise.all(promise_all).then((ress)=>{
        for (let i = 0; i < DEFAULT.length; i++) {
            const key = DEFAULT[i];
            searchResult[key] = ress[i]
        }
        renderResult()
    }).catch((e)=>{
        console.log(e)
    })
}

init()