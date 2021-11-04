import { setBaiduUrl, getBaiduParams} from '../utils/baidu.js'
import { getContent } from '../utils/utils.js'
import { BadiduSelect } from '../options/config.js'

let searchBtn = document.getElementById('serach')
let inputValue= document.getElementById('searchValue')

searchBtn.addEventListener('click',()=>{
    if(!inputValue.value) return
    let url = setBaiduUrl(inputValue.value,inputValue.value)
    chrome.runtime.sendMessage(
        {
            contentScriptQuery: 'fetch',
            url,
        },
        (res)=>{
            getBaiduParams(res)
            renderResult(getContent(res,BadiduSelect))
        }
    );
})

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
