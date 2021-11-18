import Icon from '../engine/icon.js'
import Shortcut from '../engine/shortcut.js'
import Background from '../engine/bg.js'

// chrome.storage.local.clear()

const icon = new Icon()
const shortcut = new Shortcut(icon)
const background = new Background()

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

init()