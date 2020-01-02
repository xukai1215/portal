ELEMENT.locale(ELEMENT.lang.en)
var vue = new Vue(
    {
        el: "#app",
        data(){
            return{
                //页面样式控制
                loading: 'false',
                load: true,
                ScreenMinHeight: "0px",
                ScreenMaxHeight: "0px",

                //显示控制
                curIndex:6,

                //
                userInfo:{

                },


            }
        },

        methods:{
            //公共功能
            changeRter(index){
                this.curIndex = index;
                var urls={
                    1:'/user/userSpace',
                    2:'/user/userSpace/model',
                    3:'/user/userSpace/data',
                    4:'/user/userSpace/server',
                    5:'/user/userSpace/task',
                    6:'/user/userSpace/community',
                    7:'/user/userSpace/theme',
                    8:'/user/userSpace/account',
                    9:'/user/userSpace/feedback',
                }

                this.setSession('curIndex',index)
                window.location.href=urls[index]

            },

            setSession(name, value) {
                window.sessionStorage.setItem(name, value);
                // this.editOid = sessionStorage.getItem('editItemOid');
            },

            creatItem(index){
                var urls={
                    1:'./community/createConcept',
                    2:'./community/createSpatialReference',
                    3:'./community/createTemplate',
                    4:'./community/createUnit',
                }
                window.sessionStorage.removeItem('editOid');
                window.location.href=urls[index]
            },

            manageItem(index){
                //此处跳转至统一页面，vue路由管理显示
                var urls={
                    1:'/user/userSpace/community/#/concept&semantic',
                    2:'/user/userSpace/community/#/spatialReference',
                    3:'/user/userSpace/community/#/dataTemplate',
                    4:'/user/userSpace/community/#/unit&metric',
                }
                window.sessionStorage.setItem('itemIndex',index)

                window.location.href=urls[index]

            },

            //create chart map
            createChartMap(chartInfo) {
                var myChart = echarts.init(document.getElementById('echartMap'));
                myChart.showLoading();
                var chartdata = [];
                for (var i = 0; i < chartInfo.cityCount.length; i++) {
                    let cityObj = {
                        name: '',
                        value: 0
                    };
                    let city = chartInfo.cityCount[i];
                    let geoCoord = chartInfo.geoCoord[city.name];
                    geoCoord.push(city.value);
                    cityObj.name = city.name;
                    cityObj.value = geoCoord;
                    chartdata.push(cityObj);
                }
                myChart.hideLoading();
                var MapOptions = {
                    backgroundColor: "transparent",
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}'
                    },
                    geo: {
                        show: true,
                        map: 'world',
                        label: {
                            normal: {
                                show: false,
                                textStyle: {
                                    color: 'rgba(0,0,0,0.4)'
                                }
                            },
                            emphasis: {
                                show: true,
                                backgroundColor: '#2c3037',
                                color: '#fff',
                                padding: 5,
                                fontSize: 14,
                                borderRadius: 5
                            }

                        },
                        roam: false,
                        itemStyle: {
                            normal: {
                                areaColor: '#b6d2c8',
                                borderColor: '#404a59',
                                borderWidth: 0.5
                            },
                            emphasis: {
                                areaColor: '#b6d2c8'
                            }

                        },

                    },
                    series: [
                        {
                            name: '点',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            symbol: 'pin', //气泡
                            symbolSize: 40
                            ,
                            label: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 9,
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#00c0ff', //标志颜色
                                }
                            },
                            zlevel: 6,
                            data: chartdata
                        },
                        {
                            name: 'Top 5',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: chartdata,
                            symbolSize: 20,
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#3daadb',
                                    shadowBlur: 0,
                                    shadowColor: '#3daadb'
                                }
                            },
                            zlevel: 1
                        },
                    ]
                };
                this.computerNodesMapOptions = MapOptions;
                myChart.setOption(MapOptions);
                console.log('wait to load');

                window.onresize = () => {
                    height = document.documentElement.clientHeight;
                    this.ScreenMinHeight = (height) + "px";
                    myChart.resize();
                };

                //添加地图点击事件
                myChart.on('click', function (params) {
                    if (params.componentType == "series") {
                        {
                            $("#pageContent").stop(true);
                            $("#pageContent").animate({scrollTop: $("#" + params.name).offset().top}, 500);
                        }
                    }
                })

            },

        },

        created() {
        },

        mounted() {

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
                            // this.addAllData()

                            // axios.get("/dataItem/amountofuserdata",{
                            //     params:{
                            //         userOid:this.userId
                            //     }
                            // }).then(res=>{
                            //     that.dcount=res.data
                            // });

                            $("#author").val(this.userName);

                            var index = window.sessionStorage.getItem("index");
                            if (index != null && index != undefined && index != "" && index != NaN) {
                                this.defaultActive = index;
                                this.handleSelect(index, null);
                                window.sessionStorage.removeItem("index");
                                this.curIndex=index

                            } else {
                                // this.changeRter(1);
                            }

                            window.sessionStorage.removeItem("tap");
                            //this.getTasksInfo();
                            this.load = false;
                        }
                    }
                })


                //this.getModels();
            });
        },

    }
)