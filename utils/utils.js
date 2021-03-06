// 把 Object 转换为 Query text
export function objToQuery(data){
    let str = [];
    for (var p in data)
        if (data.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
        }
    return str.join("&");
}

// 根据选择器规则，从 Dom 中查找出 html 块
export function getContentWithRule(dom, querySelectRule, baseUrl){
    let result = []

    let list = dom.querySelectorAll(querySelectRule['result'])
    for (let i = 0; i < list.length; i++) {
        const one = list[i];
        let title = one.querySelector(querySelectRule['title'])
        let content = one.querySelector(querySelectRule['content'])
        let link = one.querySelector(querySelectRule['link'])
        let url = link.getAttribute('href')
        baseUrl = getUrlDomain(baseUrl).origin
        
        if(url.search(/http:\/\/|https:\/\//g) == -1){
            url = baseUrl + url
        }
        if(!title || !content) continue
        result.push({
            title:title.innerHTML,
            content:content.innerHTML,
            link:url
        })
    }
    return result
}

// 根据规则获取相关搜索
export function getRRSRWithRUle(dom ,rule){
    let result = []
    let list = dom.querySelectorAll(rule)
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        result.push(item.innerText.trim())
    }
    return result
}


// 获取 dom 内 type 为 hidden 的 input 的 name 和 value 组成的 Object
export function getHiddenParams(dom){
    let result = {}
    // let parser = new DOMParser();
    // let dom = parser.parseFromString(text, "text/html");
    let inputs = dom.querySelectorAll('input[type=hidden]')
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        result[input.name] = input.value
    }
    return result
}

// 获取 URL 的相关内容
export function getUrlDomain(url){
    let dom = document.createElement('a');
    dom.href = url;
    
    const {href,protocol,host,hostname,prot,pathname,search,hash,origin} = dom

    return {
        href,protocol,host,hostname,prot,pathname,search,hash,origin
    }
}

// 获取图片 base64
export function getImgDataURI(imgUrl){
    return new Promise((resolve, reject)=>{
        chrome.runtime.sendMessage(
            {
                messageType: 'img',
                url:imgUrl,
            },
            (res) => {
                if(res.success){
                    let bufferString = ''
                    // 不一次性使用 String.fromCharCode(...res.data)处理数据, 是为了兼容处理溢出错误
                    for (let i = 0; i < res.data.length; i++) {
                        const val = res.data[i];
                        bufferString += String.fromCharCode(val)
                    }
                    let btoas = btoa(bufferString)
                    let base = `data:image/png;base64,${btoas}`
                    resolve(base)
                }else{
                    reject(res.err)
                }
            }
        )
    })
}

// 改变网站title
export function changeTitle(text){
    document.title = `${text} - Search Reduce` 
}

// 改变网址参数
export function changeURLParams(key, value){
    let location = window.location
    let params = new URLSearchParams(location.search)

    params[key] = value

    let url = location.origin + location.pathname + '?' + objToQuery(params)

    return url

}

// 数组去重
export function unique(arr, key){
    let result = []
    let obj = {}
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        let value = key ? item[key] : item
        if(obj[value]){
            continue
        }else{
            obj[value] = true
            result.push(item)
        }
    }

    return result
}