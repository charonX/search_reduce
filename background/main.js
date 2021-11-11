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

function getImgData(url,sendResponse,sender){
    let data = chrome.runtime.getURL(url)
    console.log(data)
    sendResponse(data)
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
});