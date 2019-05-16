var data_items = new Vue({
    el:"#data_items",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: function () {
        return {
            activeIndex: '3',
            searchText: new Array(),
            progressBar: true,
            currentPage: 1,
            viewCount:-1,



            defaultProps: {
                children: 'children',
                label: 'label'
            },
            findDto: {
                page: 1,
                pageSize: 10,
                asc: true,
                classifications:[],
                category:'',
                searchContent:[]
            },
            list:new Array(),
            classlist:[],
            datacount: '',
            classclick:false,
            activeNames:["1"],
            category:[],
            ca:'',
            hubnbm:'',
            tObj:new Object(),
            categoryTree:[],
            theDefaultCate:'5cb83fd0ea3cba3224b6e24e',
            loading:false,
            useroid:''


        }
    },
    methods: {
        handleChange(){

        },

        startinput(){
            $('.el-collapse-item .el-button').css('color','#2b305b')
            this.ca=''
        },
        //文本检索
        search(){

            this.startinput()
            this.searchText=$('#searchBox').tagsinput('items')

            // console.log("es "+this.searchText);

            this.loading=true;


            var that=this
            that.progressBar=true

            let li=that.list;
            let slist=new Array();

            if(this.searchText.length!=0){



                    this.findDto.searchContent=this.searchText;
                    this.findDto.page=1

                    axios.post("/dataItem/listBySearch/",that.findDto)
                        .then((res)=>{
                            setTimeout(()=>{
                                that.list=res.data.data.content;
                                that.progressBar=false;
                                that.datacount=res.data.data.totalElements;
                                that.loading=false;

                            },100)

                    });


            }else{
                this.datacount=0;
                this.list=[]
                this.list.push("no content");
                that.progressBar=false;

            }

        },

        //页码点击翻页
        handleCurrentChange(currentPage) {
            //把当前页码给dto
            this.findDto.page=currentPage;

            var that=this
            if(this.ca!=''){
                axios.post('/dataItem/categorys',this.findDto)
                    .then(res=>{
                        setTimeout(()=>{
                            that.list=res.data.data.content;
                            that.datacount=res.data.data.totalElements;

                            that.classclick=true;
                            that.progressBar=false
                        },500)
                        // console.log(res)
                    });
            }else {

                axios.post("/dataItem/listBySearch/",that.findDto)
                    .then((res)=>{
                        setTimeout(()=>{
                            that.list=res.data.data.content;
                            that.progressBar=false;
                            that.datacount=res.data.data.totalElements;
                        },500)

                        // this.list=res.data.data;

                    });

            }


                // axios.get("/dataItem",
                //     {
                //         params:this.findDto
                //     }
                // ).then((res)=>{
                //     //取得当前页码的内容
                //     this.list=res.data.data.content;
                //     this.progressBar=false
                //     // console.log(res.data.data.content)
                // })

        },


        getclasslist(val){
            this.classlist=val;
        },
        chooseCate(item){
            // console.log(e)
            var this_button=$('#'+item)
            // console.log($('#'+item))

            this.datacount=-1
            this.loading=true


            $('.manyhub').css('display','none');
            $('.maincontnt').css('display','block');



            // e.target.style.color="green";
            this_button[0].style.color="green";
            this_button[0].style.fontWeight="bold";

            var all_button=$('.el-button')

            for (let i = 0; i < all_button.length; i++) {
                if(all_button[i]!=this_button[0]){
                    all_button[i].style.color="";
                    all_button[i].style.fontWeight="";
                }
            }

            // console.log($('.el-button'))


            // this.ca=e.target.innerText;
            this.ca=this_button[0].innerText;



            this.findDto={
                categoryId:item,
                asc:true,
                page:1
            }

            this.progressBar=true;

            var that=this
            if(this.ca==="Hubs"){
                this.hubs();
            }else {
                axios.post('/dataItem/categorys',this.findDto)
                    .then(res=>{
                        setTimeout(()=>{
                            that.list=res.data.data.content;
                            that.datacount=res.data.data.totalElements;

                            that.classclick=true;
                            that.progressBar=false
                            that.loading=false;
                        },100)

                    });
            }



            // console.log(e)

        },
        defaultlist(){
            this.progressBar=true;
            this.loading=true;



            //todo 默认第一个按钮被选中
            $('.el-collapse-item .el-button:first').css('color','green');

            this.ca="Hydrosphere";


            this.findDto={
                categoryId:this.theDefaultCate,
                page:1,
                asc:true
            }
            var that=this
            axios.post('/dataItem/categorys',this.findDto)
                .then(res=>{
                    setTimeout(()=>{
                        that.list=res.data.data.content;
                        that.datacount=res.data.data.totalElements;

                        that.classclick=true;
                        that.progressBar=false
                        that.loading=false;
                    },200)

                });

        },
        goto(id){



            return "/dataItem/"+id;
        },
        view(id){
            axios.get("/dataItem/viewplus",{
                params:{
                    id:id
                }
            })
        },
        //格式化时间
        formatDate(date){
            var dateee=new Date(date).toJSON();
            var da = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
            return da
        },
        hubs(){

            this.progressBar=false;

            this.ca="We collect data from public hubs..";

            document.body.scrollTop=document.documentElement.scrollTop=0;

            $('.maincontnt').css('display','none');




            $('.manyhub').css('display','block');
            this.list=[]

            this.hubnbm=10
            var that=this
            axios.get("/dataItem/hubs",{params:{hubnbm:this.hubnbm}})
                .then(res=>{
                    that.list=res.data.data;
                    that.datacount=that.list.length;
                })




        },
        addmorehubs(){
            console.log($("#addmore"))
            this.loading=true
            this.datacount=-1
            this.hubnbm=this.hubnbm+10;
            var that=this
            axios.get("/dataItem/hubs",{params:{hubnbm:this.hubnbm}})
                .then(res=>{
                    setTimeout(()=>{
                        if(that.list.length===res.data.data.length ){
                            $("#addmore")[0].innerText="no more data"

                        }else{
                            that.list=res.data.data;
                            that.datacount=that.list.length;
                            //todo 这里的33是hubs总量，暂时写死，后期根据总量改
                            if(that.list.length===33){
                                $("#addmore")[0].style.display="none"
                            }


                        }
                        that.loading=false
                    },500)


                })

        },
        contribute(){
            if(this.useroid==''){
                alert("Please login");
                window.location.href = "/user/login";
            }else{
                window.location.href="user/userSpace";

            }
        }

    },
    created(){
        // this.defaultlist()
    },

    mounted(){
        this.defaultlist();
        var tha=this;


        axios.get("/user/load")
            .then((res)=>{
                that.userName=res.data.name;
                that.useroid=res.data.oid;
            })
        // axios.get("/dataItem/createTree")
        //     .then(res=>{
        //         tha.tObj=res.data;
        //         for(var e in tha.tObj){
        //             var a={
        //                 key:e,
        //                 value:tha.tObj[e]
        //             }
        //             tha.categoryTree.push(a);
        //
        //         }
        //         tha.theDefaultCate=tha.categoryTree[0].value[0].id;
        //     })
        //     .then(()=>{
        //     that.defaultlist();
        // });


        $('.manyhub').css('display','none');





        let that=this;



        // $('.el-collapse-item .el-button:not(.el-collapse-item__header,.hubs)').on('click',function (e) {
        //
        //     $('.manyhub').css('display','none');
        //     $('.maincontnt').css('display','block');
        //
        //
        //     $('.el-collapse-item .el-button').css('color','#2b305b')
        //         $(this).css('color','green')
        //
        //         that.ca=$(this)[0].innerText
        //
        //         // console.log(cate)
        //
        //
        //     that.findDto={
        //         category:that.ca,
        //         asc:true,
        //         page:1
        //     }
        //
        //     this.progressBar=true;
        //
        //     if($(this)[0].innerText==="Hubs"){
        //         that.hubs();
        //     }else {
        //         axios.post('/dataItem/categorys',that.findDto)
        //             .then(res=>{
        //                 setTimeout(()=>{
        //                     that.list=res.data.data.content;
        //                     that.datacount=res.data.data.totalElements;
        //
        //                     that.classclick=true;
        //                     that.progressBar=false
        //                 },500)
        //
        //             });
        //     }
        //
        //
        //
        //
        //
        //
        // });


        $('.el-collapse-item .el-button').on('hover',function () {
            // $('.el-collapse-item .el-button').css('color','#2b305b')
            $(this).css('color','green')
        })

        $('.el-collapse-item .el-button').mouseout(function () {
            clicked=false;
        });

        $("#searchBox").focus(function(){
            that.startinput()
        })







    }
});
// $(function () {
//     $('.el-collapse-item .el-button').click(function () {
//         $(this).css('color','green')
//     })
// })
