export function objToQuery(data){
    let str = [];
    for (var p in data)
        if (data.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
        }
    return str.join("&");
}


export function getContent(doc, querySelectRule){
    let result = []
    let parser = new DOMParser();
    let dom = parser.parseFromString(doc, "text/html");

    let list = dom.querySelectorAll(querySelectRule['result'])
    for (let i = 0; i < list.length; i++) {
        const one = list[i];
        let title = one.querySelector(querySelectRule['title']).outerHTML
        let content = one.querySelector(querySelectRule['content']).outerHTML
        result.push({
            title,
            content,
        })
    }
    return result
}

