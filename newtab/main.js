import { setBaiduUrl, getBaiduParams} from '../engine/baidu.js'
import { getContent } from '../utils/utils.js'
import { BadiduSelect } from '../options/config.js'
import Baidu from '../engine/baidu.js'


function init(){
    let engines = {
        'baidu' : new Baidu()
    }

    let searchBtn = document.getElementById('serach')
    let inputValue= document.getElementById('searchValue')


    searchBtn.addEventListener('click',()=>{
        if(!inputValue.value) return
        batchFetchSearch(batchConfig)
    })
}


// 渲染结果到页面
function renderResult(result){
    let wrap= document.getElementById('result')
    let a = ''
    for (let i = 0; i < result.length; i++) {
        const item = result[i];
        let c = `<div>
            <div>${item.title}</div>
            <div>${item.content}</div>
        </div>`

        a+=c
    }
    wrap.innerHTML = a
}

function getContentWithRule(rule){
    let rule = rule
    return (dom) => {
        return getContent(dom, rule)
    }
}

// 处理搜索的返回结果
function getAllResult(res){
    let parser = new DOMParser();
    let dom = parser.parseFromString(res, "text/html");

    getBaiduParams(dom)
    renderResult(getContent(dom,BadiduSelect))
}

function batchFetchSearch(config){
    return []
    chrome.runtime.sendMessage(
        {
            contentScriptQuery: 'fetch',
            url,
        },
        (res)=>{
            getAllResult(res)
        }
    );
}



init()