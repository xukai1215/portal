var distributedNode = Vue.extend({
    template:"#distributedNode",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data:function () {
        return {
            // tableData: [{
                // date: '',
                // userName: '',
                // ip: '',
                // onlineStatus: ''
            // }],
            tableData:[],
            ScreenMaxHeight: "0px",
            ScreenMinHeight: "0px",
            dataItemList:[],
            dialogVisible: false,
        }
    },
    methods:{
        handleClick(row) {
            console.log(row);
            let data= row.ip;
            $.ajax({
                url:"/dataItem/getDataItemList",
                type:"POST",
                contentType:"application/json",
                data:data,
                success:(json)=>{
                    this.dataItemList = json;
                }
            })
        },
        handleClick1(row){
          console.log(row);
          let id = row.id;
          window.open("/dataItem/" + id);
        },
        resetDateFilter() {
            this.$refs.filterTable.clearFilter('date');
        },
        clearFilter() {
            this.$refs.filterTable.clearFilter();
        },
        formatter(row, column) {
            return row.address;
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        initTableData(){
            $.ajax({
                url: "/dataItem/mangeNodes",
                type: "GET",
                success: (json) => {
                    console.log(json);
                    this.tableData = json;
                }
            });
        },
        handleClose(done) {
            this.$confirm('Confirm close？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
    },
    mounted(){
        let that= this;
        $(() => {
            let height = document.documentElement.clientHeight;
            this.ScreenMinHeight = (height) + "px";
            this.ScreenMaxHeight = (height) + "px";
            window.onresize = () => {
                console.log('come on ..');
                height = document.documentElement.clientHeight;
                this.ScreenMinHeight = (height) + "px";
                this.ScreenMaxHeight = (height) + "px";
            };
            $.ajax({
                type: "GET",
                url: "/user/load",
                data: {},
                cache: false,
                async: false,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: (data) => {
                    data = JSON.parse(data);
                    console.log(data);
                    if (data.oid == "") {
                        alert("Please login");
                        window.location.href = "/user/login";
                    } else {
                        this.userId = data.oid;
                        this.userName = data.name;
                        console.log(this.userId)
                        $("#author").val(this.userName);
                        var index = window.sessionStorage.getItem("index");
                        this.itemIndex=index
                        if (index != null && index != undefined && index != "" && index != NaN) {
                            this.defaultActive = index;
                            this.handleSelect(index, null);
                            window.sessionStorage.removeItem("index");
                            this.curIndex=index
                        } else {
                        }
                        window.sessionStorage.removeItem("tap");
                        this.load = false;
                    }
                }
            })
        });
        that.initTableData();
    }
})