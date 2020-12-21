let vue = new Vue({
    el:'#app',
    data: function (){
        return {
            applicationInfo:'',
            invokeService:'',
            user:'',
            applicationOid:'',
            radioStyle: "Classic",
            testStep:{
                state:{
                    name:1,
                    desc:'this is a test step'
                }
            },
            loadDataVisible:false,
            testData:'',
            input:'Test Map Data',
            xml:'',
            parameters:'',
            dialogVisible:false,
            parameter:'',
            loading:false,
            resultData:'',
            outPutData:''

        }
    },
    methods:{
        dateFormat(date, format) {
            let dateObj = new Date(date);
            let fmt = format || "yyyy-MM-dd hh:mm:ss";
            //author: meizz
            var o = {
                "M+": dateObj.getMonth() + 1, //月份
                "d+": dateObj.getDate(), //日
                "h+": dateObj.getHours(), //小时
                "m+": dateObj.getMinutes(), //分
                "s+": dateObj.getSeconds(), //秒
                "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度
                S: dateObj.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length)
                );
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1
                            ? o[k]
                            : ("00" + o[k]).substr(("" + o[k]).length)
                    );
            return fmt;
        },
        goPersonCenter(oid) {
            window.open("/user/" + oid);
        },
        downLoadTestData(){
            window.location.href = this.testData[0].url;
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        invokeNow(){
            this.loading = true;
            let that = this;
            let formData = new FormData();
            formData.append("dataApplicationId", this.applicationOid);
            formData.append("serviceId",this.invokeService[0].serviceId);
            formData.append("params",this.parameter);

            $.ajax({
                url:"/dataApplication/invokeMethod",
                type:"POST",
                data:formData,
                // cache:false,
                processData: false,
                contentType: false,
                success:(json)=>{
                    console.log(json);
                    that.resultData = json.data;
                    that.outPutData = "OutData";
                    this.loading = false;
                    that.dialogVisible = false;
                }
            });
        },
        downloadResult(){
            window.location.href = this.resultData.cacheUrl;
        }
    },
    async mounted(){

        let that = this
        await axios.get("/user/getUserInfo")
            .then((res) => {
                if (res.status === 200) {
                    that.user = res.data.data.userInfo
                }

            })
        let str = window.location.href.split('/')
        this.applicationOid = str[str.length-1]
        await axios.get("/dataApplication/getApplication/" + this.applicationOid).then((res) => {
            if (res.status === 200) {
                that.applicationInfo = res.data.data
                that.testData = res.data.data.testData;
                that.invokeService = res.data.data.invokeServices;
            }
        })
        await axios.get("/dataApplication/getParemeter/" + this.applicationOid).then((res) => {
            if (res.status === 200) {
                that.parameters = res.data.data.parameters;
                that.xml = res.data.data.xml;
            }
        })

    }
})
