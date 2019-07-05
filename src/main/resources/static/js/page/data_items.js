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

            loading:false,
            useroid:'',

            categoryId:' '

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


        },


        getclasslist(val){
            this.classlist=val;
        },
        chooseCate(item){
            this.categoryId=item
            window.location.href="/dataItem/items/"+this.categoryId+"&page=0.html";


            let that=this




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


            this.ca=this_button[0].innerText;





            this.progressBar=true;



            // var that=this
            // if(this.ca==="Hubs"){
            //     this.hubs();
            // }else {
            //     axios.get('/dataItem/categorys',{
            //         params:{
            //             categoryId:this.categoryId
            //         }
            //     })
            //         .then(res=>{
            //             setTimeout(()=>{
            //
            //
            //                 that.classclick=true;
            //                 that.progressBar=false
            //                 that.loading=false;
            //             },100)
            //
            //         });
            // }


        },
        defaultlist(){
            this.progressBar=true;
            this.loading=true;


            // if(this.categoryId==='5cb83fd0ea3cba3224b6e24e'){
            //     //todo 默认第一个按钮被选中
            //     $('.el-collapse-item .el-button:first').css('color','green');
            //
            //     this.ca="Hydrosphere";
            // }





            var that=this
            axios.get('/dataItem/dataCount',{
                params:{
                    categoryId:this.categoryId
                }
            })
                .then(res=>{
                    setTimeout(()=>{

                        if(res.data!=null){

                            that.datacount=res.data.data
                        }


                        that.classclick=true;
                        that.progressBar=false
                        that.loading=false;
                    },200)

                });



        },

        view(id){
            axios.get("/dataItem/viewplus",{
                params:{
                    id:id
                }
            })
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
        //获得category类id
        let  url=window.location.href
        let cateid=url.split("/")
        let id=cateid[cateid.length-1].split("&")
        this.categoryId=id[0]


        //当前类按钮样式
        let this_button=$('#'+this.categoryId)
        this_button[0].style.color="green";
        this_button[0].style.fontWeight="bold";
        let all_button=$('.el-button')
        for (let i = 0; i < all_button.length; i++) {
            if(all_button[i]!=this_button[0]){
                all_button[i].style.color="";
                all_button[i].style.fontWeight="";
            }
        }


        //拿到总数
        this.defaultlist();

        var tha=this;




        axios.get("/user/load")
            .then((res)=>{
                that.userName=res.data.name;
                that.useroid=res.data.oid;
            })



        $('.manyhub').css('display','none');





        let that=this;





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
