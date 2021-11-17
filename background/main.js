// 获取URL内容
function fetchUrl(url,sendResponse,sender){
    fetch(url)
    .then(response => response.text())
    .then(text => sendResponse({
        success:true,
        data:text
    }))
    .catch(error => {
        sendResponse({
            success:false,
            err:error
        })
    })
}

// 获取图片Base64格式
function getImgData(url, sendResponse, sender){
    fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
        sendResponse({
            success:true,
            data:btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
        })
    })
    .catch(error => {
        sendResponse({
            success:false,
            err:error
        })
    })
}

// 跳转文件路径
function jumpURL(data, sendResponse, sender){
    const {tabUrl,tab,value} = data
    chrome.tabs.update(tab,{
        url:tabUrl
    })
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.messageType == 'fetch') {
        fetchUrl(request.url,sendResponse)
        return true;
      }

      if (request.messageType == 'img') {
        getImgData(request.url,sendResponse)
        return true;
      }

      if (request.messageType == 'changeURL') {
        jumpURL(request.data,sendResponse)
        return true;
      }
});