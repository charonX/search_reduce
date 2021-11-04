import { setBaiduUrl, getBaiduParams} from '../utils/baidu.js'
let searchBtn = document.getElementById('serach')
let inputValue= document.getElementById('searchValue')

searchBtn.addEventListener('click',()=>{
    let url = setBaiduUrl('python',inputValue.value)
    chrome.runtime.sendMessage(
        {
            contentScriptQuery: 'fetch',
            url,
        },
        (res)=>{
            getBaiduParams(res)
        }
    );
})
