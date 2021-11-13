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
export function getContentWithRule(dom, querySelectRule){
    let result = []
    // let parser = new DOMParser();
    // let dom = parser.parseFromString(doc, "text/html");

    let list = dom.querySelectorAll(querySelectRule['result'])
    for (let i = 0; i < list.length; i++) {
        const one = list[i];
        let title = one.querySelector(querySelectRule['title'])
        let content = one.querySelector(querySelectRule['content'])
        let link = one.querySelector(querySelectRule['link'])
        if(!title || !content) continue
        result.push({
            title:title.innerText,
            content:content.innerText,
            link:link.href
        })
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

export function getUrlDomain(url){
    let dom = document.createElement('a');
    dom.href = url;
    
    const {href,protocol,host,hostname,prot,pathname,search,hash,origin} = dom

    return {
        href,protocol,host,hostname,prot,pathname,search,hash,origin
    }
}