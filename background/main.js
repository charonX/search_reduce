chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.messageType == 'fetch') {
        fetch(request.url)
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
        return true;
      }
});