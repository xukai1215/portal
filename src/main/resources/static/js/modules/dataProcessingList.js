Vue.component("dataProcessingList",
    {
        template: '#dataProcessingList',
        props: {
            singleSelect:{
                type:Boolean,
                default:false
            }
        },

        components: {
            'avatar': VueAvatar.Avatar
        },

        data() {
            return {
                dataProcessings:[

                ],

                selectedDataProcessings:[],

                cardContainerWidth:0,

                searchText:'',
            }
        },

        computed: {
            cardSpan(){
                if(this.cardContainerWidth>760)
                    return 6
                else if(this.cardContainerWidth>400)
                    return 8
                else return 12
            }
        },

        methods: {
            search(){

            },

            refreshDataService(e){

                this.getAllDataProcessings()
            },

            getAllDataProcessings(){
                $.ajax({
                    url:'/task/getDataProcessings',
                    async:true,
                    success:(result) => {
                        if(result.code!=-1){
                            this.dataProcessings = result.data
                        }
                    },
                    }
                )
            },

            isSelected(list,item){
                for(let i=0;i < list.length;i++){
                    if(list[i].id===item.id)
                        return true
                }
                return false
            },

            cancelMutiSelect(eval) {
                for (var i = 0; i < this.selectedDataProcessings.length; i++) {
                    if (this.selectedDataProcessings[i] === eval) {
                        //删除
                        this.selectedDataProcessings.splice(i, 1)
                        break
                    }
                }
            },

            select(item){
                if(this.isSelected(this.selectedDataProcessings,item)){
                    this.cancelMutiSelect(item)

                    this.removeItem(item)
                }else{
                    if(this.singleSelect){
                        this.selectedDataProcessings = []

                        this.selectedDataProcessings.push(item)
                    }
                    this.selectItem(item)
                }
            },

            selectItem(item){
                this.$emit('select-data-processing',item)
            },

            removeItem(item){
                this.$emit('remove-data-processing',item)
            },
        },

        created() {

        },

        mounted() {
            this.getAllDataProcessings()

            this.$nextTick(()=>{
                this.cardContainerWidth = this.$refs.cardContainer.offsetWidth;
            })

            window.onresize= () =>{
                this.cardContainerWidth = this.$refs.cardContainer.offsetWidth
            }
        }
    }
)