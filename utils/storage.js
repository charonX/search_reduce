export function Set(key, value, sync=false){
    return new Promise((resolve,reject)=>{
        try{
            if(!key){
                reject('key is empty')
            }
            if(sync){
                chrome.storage.sync.set({[key]: value}, function(res) {
                    console.log('res: ', res);
                    resolve(res)
                });
            }else{
                key,value
                chrome.storage.local.set({[key]: value}, function(res) {
                    console.log('res: ', res);
                    resolve(res)
                });
            }
        }catch(e){
            reject(e)
        }
    })
}

export function Get(key, sync=false){
    return new Promise((resolve,reject)=>{
        try{
            if(!key){
                reject('key is empty')
            }
            if(sync){
                chrome.storage.sync.get(key, function(res) {
                    console.log('res: ', res);
                    resolve(res)
                });
            }else{
                chrome.storage.local.get(key, function(res) {
                    console.log('res: ', res);
                    resolve(res)
                });
            }
        }catch(e){
            reject(e)
        }
    })
}


export function Remove(key, sync=false){
    return new Promise((resolve,reject)=>{
        try{
            if(!key){
                reject('key is empty')
            }
            if(sync){
                chrome.storage.sync.remove(key, function(res) {
                    console.log('res: ', res);
                    resolve(res)
                });
            }else{
                chrome.storage.local.remove(key, function(res) {
                    console.log('res: ', res);
                    resolve(res)
                });
            }
        }catch (e){
            reject(e)
        }
    })
}