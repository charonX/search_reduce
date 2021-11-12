import {getUrlDomain} from '../utils/utils.js'
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
    chrome.tabs.getCurrent((tab)=>{
        chrome.runtime.sendMessage(
            {
                messageType: 'changeURL',
                data:{
                    tabUrl:'../newtab/result.html?kw=' + value,
                    tab:tab.id
                }
            },
        )
    })
}

function renderTopSites(list){
    let wrap = document.getElementById('topViews')
    let result = ''
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        let img_url = getUrlDomain(item.url).origin + '/favicon.ico'
        let src = img_url
        let li = `<li><a href="${item.url}" target="_blank" ><img src="${src}" alt="${item.title}" /></a></li>`
        result+=li
    }
    wrap.innerHTML = result
}

// 获取 访问最高的页面
function getTopSites(){
    chrome.topSites.get((urls)=>{
        renderTopSites(urls)

    })
}

init()