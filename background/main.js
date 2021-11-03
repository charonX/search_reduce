chrome.webRequest.onCompleted.addListener(
    (detail)=>{
        console.log(detail)
        return true
    },
    {urls: ["<all_urls>"]},
    []
)
