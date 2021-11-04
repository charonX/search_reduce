export function objToQuery(data){
    let str = [];
    for (var p in data)
        if (data.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
        }
    return str.join("&");
}


export function getContent(dom, querySelectRule){

}

