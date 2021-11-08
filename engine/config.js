export const Config = {
    'baidu':{
        'name':'baidu',
        'baseUrl':'https://www.baidu.com/s?',
        'keyword':'wd',
        'laseSearch':'op',
        'page':'pn',
        'params':{
            rn :20, // pageSize
            // tn:"baiduhome_pg",
            ie:'utf-8',
            // rsv_idx:2,
            // rsv_spt:1, // 识别浏览器
        },
        'rule':{
            result:'.result.c-container.new-pmd',
            title:'h3 > a',
            content:'.c-abstract',
            link:'h3 > a'
        }
    },
    'google':{
        'name':'google',
        'baseUrl':'https://www.google.com/search?',
        'keyword':'q',
        'laseSearch':'aq',
        'page':'start',
        'params':{
            num :20,
            ie:'UTF-8'
        },
        'rule':{
            result:'.g',
            title:'h3',
            content:'.VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf',
            link:'a'
        }
    }
}
