import Universal from '../engine/universal.js'
import { Config } from '../engine/config.js'


function init(){
    getTopSites()
    let searchBtn = document.getElementById('serach')
    let searchInput= document.getElementById('searchInput')

    searchBtn.addEventListener('click',()=>{
        sendToSearch(searchInput.value)
    })
    document.addEventListener('keyup', (e)=>{
        if(e.key == 'Enter'){
            sendToSearch(searchInput.value)
        }
    })
}

function sendToSearch(value){
    if(!value) return
    console.log('value: ', value);

}

function renderTopSites(list){
    let wrap = document.getElementById('topViews')
    let result = '<ul>'
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        console.log(item)
        let src = `chrome://favicon2/?size=24&scale_factor=1x&show_fallback_monogram=&page_url=${item.url}`
        let li = `<li>
                <img src="${src}" />
                <p>${item.title}</p>
                </li>`
        result+=li
    }
    result += '</ul>'
    console.log(result)
    wrap.innerHTML = result
}

// 获取 访问最高的页面
function getTopSites(){
    chrome.topSites.get((urls)=>{
        renderTopSites(urls)

    })
}

init()