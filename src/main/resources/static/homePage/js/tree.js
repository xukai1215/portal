

var relationChart = echarts.init(document.getElementById("container_contributors"));
var container_contributors = document.getElementById("container_contributors");
var treeShow = [
    [],
    [],
    []
];


function loadTree() {

    $.get('../static/homePage/data/tree.json', function (webkitDep) {
        echarts.util.each(webkitDep.children, (datum, index) => {
            if (datum.children.length === 0) {
                datum.collapsed = true
                datum.label = {
                    position: 'right',
                    align: 'right',
                    fontStyle: "oblique",
                    fontWeight: 'bolder',
                    fontSize: 18
                };
            }
        });
        let option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
            },
            series: [ 
            ]
        };

        let series = [{
            type: 'tree',
            expandAndCollapse: false,
            data: [webkitDep],
            top: '1%',
            left: '30%',
            bottom: '1%',
            right: '15%',
            symbolSize: 5,
            itemStyle: {
                borderColor: "#330000",
                borderWidth: 0,
            },
            lineStyle: {
                curveness: 0.4
            },
            label: {
                position: 'right',
                align: 'right',
                fontStyle: "oblique",
                fontWeight: 'bolder',
                fontSize: 12
            },
            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left',
                    fontStyle: "oblique",
                    fontSize: 10
                }
            },
        }];
        relationChart.setOption(option);



        let children = series[0].data[0].children;
        children.forEach((I, indexI) => {
            if (I.children.length !== 0) {
                I.children.forEach((J, indexJ) => {
                    if (J.region === 0) {
                        treeShow[0].push({
                            i: indexI,
                            j: indexJ
                        })
                    } else if (J.region === 1) {
                        treeShow[1].push({
                            i: indexI,
                            j: indexJ
                        })
                    } else if (J.region === 2) {
                        treeShow[2].push({
                            i: indexI,
                            j: indexJ
                        })
                    }
                })
            }
        })


        relationChart.on('click', (params) => {
            if (params.data.value !== "") {
                window.open(params.data.value);
            }
        }); 
        relationChart.setOption({
            series: series
        });
    })

}


bus.$on("showContributors", e => {
    loadTree();
})


bus.$on("resize", e => {
    console.log(1);
    relationChart.resize();
})