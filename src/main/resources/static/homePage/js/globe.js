
var dom = document.getElementById("container_globe");
var globeChart = echarts.init(dom);
var pause = false;
var nodes = [
    [],
    [],
    []
];
var links = [
    [],
    [],
    []
];
var shine = [
    [],
    [],
    []
];
var currentItem = undefined;
let scatterData = [];
let shineScatter = [];
let region = [
    [-82, -80],
    [112, 115],
    [116, 122]
];

function loadGlobe() {
    $.getJSON('../static/homePage/data/globe.json', (jsonData) => {
        let series = [];
        let NJNU = [118.916, 32.114];

        jsonData.points.forEach((point, index) => {

            let name = point[0];
            let des = point[1];
            let link = point[2];
            let longitude = point[3];
            let latitude = point[4];
            let height = point[5];
            let position = point[6];
            let img = point[7];
            let agency = point[8];

            scatterData.push({
                value: [longitude, latitude, height],
                name: point[0],
            });

            vue.findItem.push({
                value: [longitude, latitude],
                name,
                des,
                link,
                height,
                position,
                img,
                agency
            })

        });

        //获取屏幕宽度，设置球体大小。
        var distance = setGlobeInstance();


        series.push({
            type: 'scatter3D',
            coordinateSystem: 'globe',
            data: scatterData,
            symbol: "circle",
            symbolSize: 8,
            blendMode: 'lighter',
            emphasis: {
                label: {
                    show: false
                }
            }
        })



        vue.findItem.forEach(el => {
            if (region[0][0] < el.value[0] && el.value[0] < region[0][1]) {
                nodes[0].push({
                    name: el.name,
                    symbolSize: [100, 90],
                    symbol: el.img,
                    x: 0,
                    y: 0,
                    category: 0
                });
                shine[0].push({
                    value: el.value,
                    name: el.agency,
                    label: {
                        position: el.position !== undefined ? el.position : "right",

                    }

                });

            } else if (region[1][0] < el.value[0] && el.value[0] < region[1][1]) {
                if (el.name === "Wenping Yuan") {
                    nodes[1].push({
                        name: el.name,
                        symbolSize: [80, 70],
                        symbol: el.img,
                        symbolOffset: ['30%', '60%'],
                        x: 4,
                        y: 1,
                        category: 0
                    });

                } else if (el.name === "Bo Huang") {
                    nodes[1].push({
                        name: el.name,
                        symbolSize: [80, 70],
                        symbol: el.img,
                        symbolOffset: ['-10%', '60%'],
                        x: 4.5,
                        y: 1,
                        category: 0
                    });
                }

                shine[1].push({
                    value: el.value,
                    name: el.agency,
                    label: {
                        position: el.position !== undefined ? el.position : "right",
                        distance: 50
                    }
                })
            } else if (region[2][0] < el.value[0] && el.value[0] < region[2][1]) {
                nodes[2].push({
                    name: el.name,
                    symbolSize: 50,
                    symbol: el.img,
                    category: 0
                });
                shine[2].push({
                    value: el.value,
                    name: el.agency,
                    label: {
                        position: el.position !== undefined ? el.position : "right",

                    }
                })
            } else {
                ;
            }
        })



        //现在graph是一个grpah,里面有两种布局,没法准确定位坐标的BUG存在
        //后面考虑分为多个graph,应该就没有BUG了
        series.push({
            type: 'graph',
            layout: 'none',
            width: 400,
            data: [],
            links: [],
            roam: false,
            lineStyle: {
                normal: {
                    color: 'source',
                    curveness: 0.3
                }
            }
        });


        series.push({
            type: 'scatter3D',
            coordinateSystem: 'globe',
            data: shineScatter,
            symbolSize: 15,
            symbol: "diamond",
            blendMode: 'source-over',
            silent: true,
            itemStyle: {
                opacity: 1,
                color: "#FFFF00",
                borderWidth: 0.5
            },
            label: {
                show: true,
                formatter: (params) => {
                    return params.data.name
                },
                textStyle: {
                    color: '#000',
                    borderWidth: 0.2,
                    borderColor: "#fff",
                    fontSize: 18,
                    fontWeight: "bold"
                }
            }
        })

        option = {
            globe: {
                baseTexture: '../static/homePage/data-gl/asset/data-1491890179041-Hkj-elqpe.jpg',
                // heightTexture: 'data-gl/asset/data-1491889019097-rJQYikcpl.jpg',

                light: { // 光照阴影
                    main: {
                        color: '#fff', // 光照颜色
                        intensity: 1.2, // 光照强度
                        // shadowQuality: 'high', //阴影亮度
                        shadow: false, // 是否显示阴影
                        alpha: 40,
                        beta: -30
                    },
                    ambient: {
                        intensity: 0.5
                    }
                },
                viewControl: {
                    autoRotate: true,
                    rotateSensitivity: [0, 0], //x,y方向旋转灵敏度，为零则为禁止旋转
                    zoomSensitivity: 0, //缩放灵敏度，为零则为禁止缩放
                    alpha: 35,
                    animationDurationUpdate: 2000,
                    distance: distance,
                    autoRotateSpeed: 20,
                    autoRotateAfterStill: 0.5,
                    // targetCoord: [116.46, 39.92],
                },
                // layers: [{
                //     type: 'blend', //与baseTexture混合
                //     blendTo: 'albedo',
                //     texture: worldMapChart //支持图片，canvas对象，  也可以直接支持echarts实例对象，此时地球上的鼠标动作会和纹理上的echarts产生联动
                // }],
            },
            series: series
        }

        globeChart.setOption(option);

        let interval = setInterval(function () {
            if (!pause) {
                bus.$emit("getNowBeta");
            }
        }, 100);
    })
}


bus.$on("showContributors", e => {
    loadGlobe();
}); 

bus.$on("getNowBeta", () => {
    vue.nowBeta = globeChart.getOption().globe[0].viewControl.beta % 360;
    let nowSeris = globeChart.getOption().series
    let graphSeries = nowSeris[1];
    let shineScatterSeries = nowSeris[2];


    let relationSeries = relationChart.getOption().series[0];
    let children = relationSeries.data[0].children;


    if (region[0][0] < vue.nowBeta - 90 && vue.nowBeta - 90 < region[0][1]) {
        if (currentItem !== 1) {
            graphSeries.links = [];
            graphSeries.data = nodes[0];
            graphSeries.layout = 'none';
            shineScatterSeries.data = shine[0];

            treeShow[0].forEach(({
                i,
                j
            }) => {
                children[i].children[j].symbolSize = 25
            })


            relationChart.setOption({
                series: relationSeries
            })

            globeChart.setOption({
                globe: {
                    viewControl: {
                        autoRotate: false
                    }
                },
                series: nowSeris
            });
            pause = true;
            setTimeout(() => {
                globeChart.setOption({
                    globe: {
                        viewControl: {
                            autoRotate: true
                        }
                    },
                });
                relationChart.setOption({
                    series: relationSeries
                })
                pause = false;
            }, 3000)
        }
        currentItem = 1;

    } else if (region[1][0] < vue.nowBeta - 90 && vue.nowBeta - 90 < region[1][1]) {
        if (currentItem !== 2) {
            graphSeries.links = [];
            graphSeries.data = nodes[1];
            graphSeries.layout = 'none';
            shineScatterSeries.data = shine[1];
            treeShow[1].forEach(({
                i,
                j
            }) => {
                children[i].children[j].symbolSize = 25
            })

            relationChart.setOption({
                series: relationSeries
            })

            globeChart.setOption({
                globe: {
                    viewControl: {
                        autoRotate: false
                    }
                },
                series: nowSeris
            });
            pause = true;
            setTimeout(() => {
                globeChart.setOption({
                    globe: {
                        viewControl: {
                            autoRotate: true
                        }
                    },
                });
                pause = false;
            }, 3000)
        }
        currentItem = 2;
    } else if (region[2][0] < vue.nowBeta - 90 && vue.nowBeta - 90 < region[2][1]) {
        if (currentItem !== 3) { //未考虑links的问题
            graphSeries.links = [];
            graphSeries.data = nodes[2];
            graphSeries.layout = 'circular';
            shineScatterSeries.data = shine[2];
            treeShow[2].forEach(({
                i,
                j
            }) => {
                children[i].children[j].symbolSize = 25
            });

            relationChart.setOption({
                series: relationSeries
            });

            globeChart.setOption({
                globe: {
                    viewControl: {
                        autoRotate: false
                    }
                },
                series: nowSeris
            });
            pause = true;
            setTimeout(() => {
                globeChart.setOption({
                    globe: {
                        viewControl: {
                            autoRotate: true
                        }
                    },
                });
                pause = false;
            }, 5000)

        }
        currentItem = 3;
    } else {
        if (currentItem !== undefined) {
            graphSeries.links = [];
            graphSeries.data = [];
            shineScatterSeries.data = [];
            treeShow[0].forEach(({
                i,
                j
            }) => {
                children[i].children[j].symbolSize = 10
            })
            treeShow[1].forEach(({
                i,
                j
            }) => {
                children[i].children[j].symbolSize = 10
            })

            treeShow[2].forEach(({
                i,
                j
            }) => {
                children[i].children[j].symbolSize = 10
            })


            relationChart.setOption({
                series: relationSeries
            })
            globeChart.setOption({
                globe: {
                    viewControl: {
                        autoRotate: true
                    }
                },
                series: nowSeris
            });

        }
        currentItem = undefined;
    }

});

function setGlobeInstance(){
    var width = document.body.clientWidth;
    if(width>=1500){
        return 140;
    }else if(width>=1300){
        return 180;
    }else if(width>=1100){
        return 230;
    }else{
        return 250;
    }
}

bus.$on("resize", () => {
    vue.carouselHeight = $(".el-carousel__item img")[0].offsetHeight + "px"; 
    globeChart.resize({});
    pause = true;
    distance = setGlobeInstance();
    option = {
        globe: {
            viewControl: {
                distance: distance,
            },
        },
    }
    globeChart.setOption(option); 
    pause = false;
})