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

function getImgData(url, sendResponse, sender){
    let data = chrome.runtime.getURL(url)
    sendResponse(data)
}

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
        console.log('request: ', request);
        jumpURL(request.data,sendResponse)
        return true;
      }
});