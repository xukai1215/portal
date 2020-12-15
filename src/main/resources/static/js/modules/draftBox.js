/**
 *组件说明：
 *  Attributes：itemType 标识是何种条目的草稿箱，默认‘modelitem’
 *  method:insert-draft 插入草稿到父组件 参数：草稿的内容
 *         get-content 获得父组件填写内容 参数 回调获得草稿需要保存内容
 */

Vue.component("draft-box",
    {
        template: '#draftBox',
        props: {
            itemType: {
                type: String,
                default: 'modelItem'
            }
        },
        data() {
            return {

                itemName: '',

                draft: {
                    oid: '',
                },
                savingDraft: false,

                editType:'create',//create,edit

                draftList: [],

                draftListDialog:false,

                matchedDraft: {},

                matchedCreateDraft: {},

                matchedCreateDraftDialog:false,

                cancelDraftDialog:false,

                draftLoading: false,

                backUrl:'',

                pageOption: {
                    paginationShow: false,
                    progressBar: true,
                    sortAsc: false,
                    currentPage: 1,
                    pageSize: 10,

                    total: 11,
                    searchResult: [],
                },

                inSearch: 0,
            }
        },
        computed: {},
        methods: {
            //公共功能
            formatDate(value,callback) {
                const date = new Date(value);
                y = date.getFullYear();
                M = date.getMonth() + 1;
                d = date.getDate();
                H = date.getHours();
                m = date.getMinutes();
                s = date.getSeconds();
                if (M < 10) {
                    M = '0' + M;
                }
                if (d < 10) {
                    d = '0' + d;
                }
                if (H < 10) {
                    H = '0' + H;
                }
                if (m < 10) {
                    m = '0' + m;
                }
                if (s < 10) {
                    s = '0' + s;
                }

                const t = y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s;
                if(callback == null||callback == undefined)
                    return t;
                else
                    callback(t);
            },


            initDraftType(type){
                this.editType = type
            },

            initDraft(editType,backUrl,oidFrom,oid){
                this.draft={oid:'',}
                this.initDraftType(editType)
                this.backUrl=backUrl

                if(oidFrom=='item'){
                    this.loadMatchedDraft(oid)
                }else if(oidFrom=='draft'){
                    this.loadDraftByOid(oid)
                }
            },

            loadDraftByOid(oid){
                axios.get('/draft/getByOid',{
                    params:{
                        oid:oid
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        this.insertDraft(res.data.data)
                    }
                })
            },

            loadMatchedDraft(oid){//匹配edit对应的
                this.matchedDraft={}
                axios.get('/draft/getByItemAndUser',{
                    params:{
                        itemOid:oid
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        this.matchedDraft=res.data.data;
                        if(this.matchedDraft!={}&&this.matchedDraft!=null){
                            this.$confirm('You have a existed draft about this Item, do you want to load it? If not, this draft will be overwrited.', 'Tips', {
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No',
                                type: 'warning'
                            }).then(() => {
                                this.insertDraft(this.matchedDraft)
                            }).catch(() => {
                                this.draft.oid=this.matchedDraft.oid
                            });
                        }
                    }

                })
            },

            loadMatchedCreateDraft(){
                this.loadCreateDraft()
            },

            loadCreateDraft(){//
                this.matchedCreateDraft={}
                axios.get('/draft/getCreateDraftByUserByType',{
                    params:{
                        itemType:this.itemType,
                        editType:'create',
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        if(res.data.data.length>=1){
                            this.matchedCreateDraft=res.data.data;
                            this.matchedCreateDraftDialog=true
                        }
                    }


                })
            },

            handlePageChange(val) {
                this.pageOption.currentPage = val;

                if(this.inSearch==0)
                    this.loadDraft();
                else
                    this.searchDraft()
            },

            searchDraft(){

            },

            loadDraftListClick(){
                this.draftListDialog=true;

                this.pageOption.currentPage = 1;
                this.loadDraft()
            },

            loadDraft(){
                this.draftLoading = true
                axios.get('/draft/pageByUser',{
                    params:{
                        asc:0,
                        page:this.pageOption.currentPage-1,
                        size:6,
                        itemType:this.itemType
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        let data=res.data.data
                        this.draftList=data.content
                        this.pageOption.total = data.total;
                        setTimeout(()=>{
                            this.draftLoading = false;
                        },150)
                    }else if(res.data.code==1){
                        this.$alert('Please login first!', 'Error', {
                            type:"error",
                            confirmButtonText: 'OK',
                            callback: action => {
                                window.location.href = "/user/login";
                            }
                        });
                    }else{
                        this.$alert('Please try again','Warning', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.draftLoading = false;
                            }
                        })
                    }
                })
            },

            createDraft(draft){
                this.savingDraft=true
                let obj={
                    content:draft.content,
                    editType:this.editType,
                    itemType:this.itemType,
                    user:draft.user,
                    oid:this.draft.oid,
                    itemName:draft.itemName,
                    itemOid:draft.itemOid,
                }
                obj.itemOid=draft.itemOid?draft.itemOid:null

                axios.post('/draft/init',obj
                ).then(
                    res=>{
                        if(res.data.code==0){
                            this.draft=res.data.data;
                            setTimeout(()=>{
                                this.savingDraft=false
                            },1005)
                        }
                    }
                )
            },

            updateDraft(draft){
                this.createDraft(draft)
            },

            loadDraftClick(draft){
                this.insertDraft(draft)

                this.draftListDialog=false;
                this.matchedCreateDraftDialog=false;
            },

            cancelEdit() {
                this.deleteDraft()
                setTimeout(() => {
                    this.$emit('draft-jump')
                }, 608)
            },

            saveEdit(){
                this.saveDraft()
                setTimeout(() => {
                    this.$emit('draft-jump')
                }, 608)
            },

            saveDraft(){
                this.savingDraft=true
                let content
                this.$emit('get-content','draft',(val)=>{content=val;console.log(this)})//通过回调return了content
                let obj={
                    content:content,
                    oid:this.draft.oid,

                }
                axios.post('/draft/update',obj
                ).then(
                    res=>{
                        if(res.data.code==0){
                            this.$message({message: 'Save draft successfully',type: 'success'})
                        }
                        setTimeout(()=>{
                            this.savingDraft=false
                        },895)
                        setTimeout(()=>{
                            this.$emit('draftJump')
                        },905)
                    }
                ).catch(()=>{
                    this.$message({message: 'Something wrong',type: 'warning'})
                    setTimeout(()=>{
                        this.savingDraft=false
                    },195)
                })
            },

            insertDraft(draft){
                this.draft = draft
                this.$emit('insert-draft',draft.content)
            },

            getDraft(){
                if(this.draft.oid!=''&&this.draft.oid!=undefined&&this.draft.oid!=null){
                    return this.draft
                }else{
                    return null
                }
            },

            deleteDraft(){
                axios.delete('/draft/deleteByOid?oid='+this.draft.oid)
            },

            checkItem(item){
                let itemType = item.itemType
                window.open('/'+itemType+'/'+item.itemOid)
            },
        },
        created() {},
        mounted() {}
    }
)