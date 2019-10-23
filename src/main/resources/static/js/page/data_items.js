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
            users:[],
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

                    axios.post("/dataItem/searchByName/",that.findDto)
                        .then((res)=>{
                            console.log(res)
                            setTimeout(()=>{
                                that.list=res.data.data.list;
                                that.progressBar=false;
                                that.datacount=res.data.data.total;
                                that.users=res.data.data.users;
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
                axios.get("/dataItem/items/"+this.theDefaultCate+"&"+this.findDto.page)
                    .then(res=>{
                        setTimeout(()=>{
                            window.history.pushState(null,null,"?category="+that.theDefaultCate+"&page="+that.findDto.page)


                            that.list=res.data.data.content;
                            that.datacount=res.data.data.totalElements;
                            that.users=res.data.data.users;

                            that.classclick=true;
                            that.progressBar=false
                        },500)
                        // console.log(res)
                    });
            }else {

                axios.post("/dataItem/searchByName/",that.findDto)
                    .then((res)=>{
                        setTimeout(()=>{

                            that.list=res.data.data.list;
                            that.progressBar=false;
                            that.datacount=res.data.data.total;
                            that.users=res.data.data.users;
                            that.loading=false;
                        },500)

                        // this.list=res.data.data;

                    });

            }


        },


        getclasslist(val){
            this.classlist=val;
        },
        chooseCate(item){

            this.theDefaultCate=item
            this.findDto.page=1
            // window.history.pushState(null,null,"?dataItem/items/"+this.theDefaultCate+"&"+this.findDto.page)
            window.history.pushState(null,null,"?category="+this.theDefaultCate+"&page="+this.findDto.page)


            this.getParams()

            var this_button=$('#'+item)

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

                axios.get("/dataItem/items/"+this.theDefaultCate+"&"+this.findDto.page)
                    .then(res=>{
                        setTimeout(()=>{
                            console.log(res)

                            that.list=res.data.data.content;
                            that.datacount=res.data.data.totalElements;
                            that.users=res.data.data.users;



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



            // //todo 默认第一个按钮被选中
            // $('.el-collapse-item .el-button:first').css('color','green');
            //
            // this.ca="Hydrosphere";


            var this_button=$('#'+this.theDefaultCate)

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
            this.ca=this_button[0].innerText

            var that=this
            axios.get("/dataItem/items/"+this.theDefaultCate+"&"+this.findDto.page)
                .then(res=>{
                    setTimeout(()=>{

                        if(res.data.data!=null){
                            that.list=res.data.data.content;
                            that.datacount=res.data.data.totalElements;
                            that.users=res.data.data.users;
                        }


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
        },
        getParams(){

            // let url=window.location.href.split("/")
            //
            // if(url[url.length-1].indexOf("&")<0){
            //     // this.theDefaultCate="5cb83fd0ea3cba3224b6e24e"
            //     // this.findDto.page=1
            //
            //
            // }else {
            //     let par=url[url.length-1]
            //     let p=par.split("&")
            //     let id=p[0]
            //     let page=p[1]
            //
            //     this.theDefaultCate=id
            //     this.findDto.page=page
            // }

            let category=this.GetQueryString("category");
            let page=this.GetQueryString("page");

            this.theDefaultCate=category
            this.findDto.page=page

        },
        GetQueryString(name) {

            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");

            var r = window.location.search.substr(1).match(reg);

            if(r!=null)return  unescape(r[2]); return null;

        }

    }
    ,
    mounted(){

        let u=window.location.href
        let f=u.split("/")

        if(f[f.length-1]==="repository"){
            this.datacount=741;
            this.progressBar=false;
            this.loading=false
            this.list=[{"image":"","keywords":["general physical geography"],"createTime":"2019-05-06T12:00:24.604+0000","author":"NNU_Group","name":"DIVA-GIS Country Data","description":"A collection of data collected from a number of the sources below - includes administrative areas, inland water, roads and railways, elevation, land cover, population and climate. Probably the easiest place to get a simple set of data for a specific country.","id":"5cd021d86af45610b4b19572","viewCount":169},{"image":"","keywords":[" watershed boundaries"," drainage directions and flow accumulations for the globe"," river networks"],"createTime":"2019-05-07T15:24:32.490+0000","author":"NNU_Group","name":"HydroSHEDS","description":"Hydrological data and maps based on the STRM elevation data. Includes river networks, watershed boundaries, drainage directions and flow accumulations for the globe.","id":"5cd1a3306af45609247f6ecb","viewCount":51},{"image":"","keywords":[" catchments and rivers","European Union area","river basins"],"createTime":"2019-05-07T15:27:50.341+0000","author":"NNU_Group","name":"Catchment Characterisation and Modelling","description":"Data on river basins, catchments and rivers for the European Union area.","id":"5cd1a3f66af45609247f6ecc","viewCount":4},{"image":"","keywords":["outlines of major watersheds","Vector data"],"createTime":"2019-05-07T15:30:27.191+0000","author":"NNU_Group","name":"Major Watersheds of the World Deliniation","description":"Vector data showing the outlines of major watersheds (river basins) across the world.","id":"5cd1a4936af45609247f6ecd","viewCount":5},{"image":"","keywords":["environmental waters","hydrogen and oxygen isotope composition of precipitation"],"createTime":"2019-05-07T15:33:16.607+0000","author":"NNU_Group","name":"Water Isotopes","description":"Global grids of hydrogen and oxygen isotope composition of precipitation and environmental waters in ArcGRID format. Data can be downloaded for whole globe or individual continents.","id":"5cd1a53c6af45609247f6ece","viewCount":2},{"image":"","keywords":["EC Joint Research Centre"],"createTime":"2019-05-07T15:35:58.694+0000","author":"NNU_Group","name":"JRC Water Portal","description":"European water data from the EC Joint Research Centre, including data on quantity, quality, price, use, exploitation and irrigation.","id":"5cd1a5de6af45609247f6ecf","viewCount":1},{"image":"","keywords":["gridded bathymetric datasets"],"createTime":"2019-05-07T15:38:51.446+0000","author":"NNU_Group","name":"General Bathymetric Chart of the Oceans","description":"A range of gridded bathymetric datasets compiled by a group of experts.","id":"5cd1a68b6af45609247f6ed0","viewCount":1},{"image":"","keywords":["environmental information for freshwater ecosystems","climate"," land-cover"," soil and geology","1km-resolution"],"createTime":"2019-05-07T15:41:08.883+0000","author":"NNU_Group","name":"EarthEnv Freshwater Ecosystems Environmental Information","description":"1km-resolution environmental information for freshwater ecosystems, covering almost the whole globe. Information includes climate, land-cover, soil and geology.","id":"5cd1a7146af45609247f6ed1","viewCount":2},{"image":"","keywords":["1998 and 2007","chlorophyll concentrations from SeaWIFS satellite"],"createTime":"2019-05-09T13:47:45.321+0000","author":"NNU_Group","name":"Coastal Water Quality","description":"Quality of coastal waters across the globe measured by chlorophyll concentrations from SeaWIFS satellite. Data for 1998 and 2007.","id":"5cd42f816af4560a78eff7fb","viewCount":2},{"image":"","keywords":["data from the AGIV"],"createTime":"2019-05-09T16:30:11.726+0000","author":"NNU_Group","name":"Agency for Geographical Information of Flanders","description":"A wide range of data from the AGIV, including land cover, aerial photographs, hydrographic data, administrative data and DEMs.","id":"5cd455936af4560a78eff832","viewCount":5}];
            this.users=[{"image":"","name":"NNU_Group","oid":"42"},{"image":"","name":"NNU_Group","oid":"42"},{"image":"","name":"NNU_Group","oid":"42"},{"image":"","name":"NNU_Group","oid":"42"},{"image":"","name":"NNU_Group","oid":"42"},{"image":"","name":"NNU_Group","oid":"42"},{"image":"","name":"NNU_Group","oid":"42"},{"image":"","name":"NNU_Group","oid":"42"},{"image":"","name":"NNU_Group","oid":"42"},{"image":"","name":"NNU_Group","oid":"42"}];

            var this_button=$('#5cb83fd0ea3cba3224b6e24e')

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
            this.ca="Hydrosphere";



        }else{
            this.getParams();
            this.defaultlist();
        }


        // this.chooseCate(this.theDefaultCate)

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
