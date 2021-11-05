import { objToQuery } from './utils.js'

export function setGoogleUrl(keyword,page=1){
    let url_params={
        q:keyword,
        start:page ? ( page - 1 ) * num : 0,
        num:20, // pageSize
        aq:f,
    }
    return 'https://www.google.com/search?' + objToQuery(url_params)
}