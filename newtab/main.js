import Icon from '../engine/icon.js'
import Shortcut from '../engine/shortcut.js'
import Background from '../engine/bg.js'
import Options from '../engine/options.js'

// chrome.storage.local.clear()



function initOptions(){
    const options = Options.getInstance()
    document.addEventListener('inited',()=>{
        console.log('inited')
        const icon = new Icon()
        new Shortcut(icon)
        new Background()
        init()
    })
}


function init(){
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

initOptions()