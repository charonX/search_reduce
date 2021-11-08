import Universal from '../engine/universal.js'
import { Config } from '../engine/config.js'

const DEFAULT = ['google', 'baidu']
let engineInterface = {}
let searchResult = {}

function init(){
    initEngines(DEFAULT)

    let searchBtn = document.getElementById('serach')
    let inputValue= document.getElementById('searchValue')

    searchBtn.addEventListener('click',()=>{
        if(!inputValue.value) return
        batchFetchSearch(inputValue.value, 1)
    })
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
    for (const key in searchResult) {
        if (Object.hasOwnProperty.call(searchResult, key)) {
            const result = searchResult[key];
            for (let i = 0; i < result.length; i++) {
                const item = result[i];
                let c = `<div>
                    <div>${item.title}</div>
                    <div>${item.content}</div>
                </div>`

                a+=c
            }
        }
    }
    wrap.innerHTML = a
}

function batchFetchSearch(keyword, page){
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