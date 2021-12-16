import { Set, Get} from '../utils/storage.js'

const DEFAULT = {
    search:{
        'baidu':{
            'name':'baidu',
            'type': 'search',
            'searchType':'dom',
            'baseUrl':'https://www.baidu.com/s?',
            'keyword':'wd',
            'laseSearch':'op',
            'page':'pn',
            'space':' ',
            'params':{
                rn :10, // pageSize
                // tn:"baiduhome_pg",
                ie:'utf-8',
                // rsv_idx:2,
                // rsv_spt:1, // 识别浏览器
            },
            'rule':{
                result:'.result.c-container.new-pmd',
                title:'h3 > a',
                content:'.c-abstract',
                link:'h3 > a',
                rrsr:'#rs_new td a'
            }
        },
        'google':{
            'name':'google',
            'type': 'search',
            'searchType':'dom',
            'baseUrl':'https://www.google.com/search?',
            'keyword':'q',
            'laseSearch':'aq',
            'page':'start',
            'space':' ',
            'params':{
                num :10,
                ie:'UTF-8'
            },
            'rule':{
                result:'.g .tF2Cxc',
                title:'h3',
                content:'.VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf',
                link:'a',
                rrsr:'.y6Uyqe .s75CSd.OhScic.AB4Wff'
            }
        },
        'bing':{
            'name':'bing',
            'type': 'search',
            'searchType':'dom',
            'baseUrl':'https://www.bing.com/search?',
            'keyword':'q',
            'laseSearch':'pq',
            'page':'first',
            'space':' ',
            'params':{},
            'rule':{
                result:'.b_algo',
                title:'.b_title h2 a',
                content:'.b_caption p',
                link:'a',
                rrsr:'.b_rrsr .b_vList li div'
            }
        },
        'github':{
            'name':'github',
            'type': 'site',
            'searchType':'dom',
            'baseUrl':'https://github.com/search?',
            'keyword':'q',
            'page':'p',
            'space':' ',
            'params':{
                'type': 'Repositories'
            },
            'rule':{
                result:'.repo-list .repo-list-item',
                title:'.f4 a',
                content:'p',
                link:'.f4 a'
            }
        },
        'github_issues':{
            'name':'github_issues',
            'type': 'site',
            'searchType':'dom',
            'baseUrl':'https://github.com/search?',
            'keyword':'q',
            'page':'p',
            'space':' ',
            'params':{
                'type': 'issues'
            },
            'rule':{
                result:'#issue_search_results .issue-list-item',
                title:'.f4 a',
                content:'p',
                link:'.f4 a'
            }
        },
    
        'segmentfault':{
            'name':'segmentfault',
            'type': 'site',
            'searchType':'dom',
            'baseUrl':'https://segmentfault.com/search?',
            'keyword':'q',
            'page':'page',
            'space':' ',
            'params':{},
            'rule':{
                result:'.list-group .list-group-item',
                title:'a h5',
                content:'.text-secondary',
                link:'a'
            }
        },
        'stackoverflow':{
            'name':'stackoverflow',
            'type': 'site',
            'searchType':'dom',
            'baseUrl':'https://stackoverflow.com/search?',
            'keyword':'q',
            'page':'page',
            'space':' ',
            'params':{},
            'rule':{
                result:'.js-search-results .search-result',
                title:'.result-link h3 a',
                content:'.excerpt',
                link:'.result-link h3 a'
            }
        }
    },
    background:{
        type:'bing',
        image:''
    }
}
export default class Options{
    constructor(){
        if(!Options.instance) {
            this.name = 'options'
            this.__init()
            Options.instance = this
        }

        return Options.instance
    }

    async __init(){
        let storage = await Get(this.name)
        console.log('storage: ', storage);

        if(!!storage[this.name]){
            this.config = storage[this.name]
        }else{
            Set(this.name, DEFAULT)
        }

        console.log(111)
    }

    getConfig(name){
        console.log(222)
        if(this.config[name]){
            return this.config[name]
        }
    }
}