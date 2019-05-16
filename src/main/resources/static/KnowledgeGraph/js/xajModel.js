var app = new Vue({
  el: "#app",
  data: {
    active: 0,
    infoPanelShow: false,
    queryYear: 2018,
    nodeId: "",
    nodeName: "",
    nodeCategory: "",
    nodeLinks: [],
    table: null,
    historyChart: null,
    mapChart: null,
    histroyActive: 0,
    researcherOrder: [],
    agencyOrder: [],
    countryOder: [],
    worldData: null,
    locationGeojson: [],
    locationOfModel: [],
    color: ["#60B58B", "#FF7F24", "#FF4500", "#FF4500"],
    keywordChart: null
  },
  mounted() {
    this.loadPage();
  },
  methods: {
    loadPage() {
      let that = this;
      $("#datetimepicker")
        .datetimepicker({
          format: "yyyy ",
          autoclose: true,
          startView: "decade",
          maxView: "decade",
          minView: "decade",
          startDate: "1970-01-01",
          endDate: new Date()
        })
        .on("changeDate.datepicker.amui", function(event) {
          that.queryYear = event.date.getFullYear();
          that.getGraphData(that.queryYear);
        });

      this.getGraphData(2018);
    },
    indexChange(index) {
      // $("#d3Canvas").empty();
      this.active = index;
      switch (index) {
        case 1:
          this.createHistoryTrendGraph();
          break;
        case 2:
          this.prepareLeafletMap();
          break;
        case 3:
          this.createKeyWords();
          break;
      }
    },
    getGraphData(year) {
      let that = this;
      $.ajax({
        url:
          "http://222.192.7.75/Knowledge/GetModelGraphBySearchTextServlet",
        type: "get",
        data: {
          type: "model",
          text: "XINANJIANG MODEL",
          sTime: year,
          eTime: year
        },
        success: function(graph) {
          that.createGraph(graph);
        }
      });
    },
    createGraph(graph) {
      let that = this;
      let links = graph.links;
      let nodes = graph.nodes;
      let max = 1,
        min = 1;
      let categoriesSet = new Set();
      let countSet = new Set();
      for (let node of nodes) {
        categoriesSet.add(node.category);
        countSet.add(node.value);
        if (node.value > max) {
          max = node.value;
        }
        if (node.value < min) {
          min = node.value;
        }
      }
      let categories = Array.from(categoriesSet);
      let colorsObj = {};
      let colors = [
        "#dd6b66",
        "#759aa0",
        "#e69d87",
        "#8dc1a9",
        "#ea7e53",
        "#eedd78",
        "#73a373",
        "#73b9bc",
        "#7289ab",
        "#91ca8c",
        "#f49f42"
      ];
      $(".graphPanel .legend").empty();
      for (let i = 0; i < categories.length; i++) {
        colorsObj[categories[i]] = colors[i];
        let li = document.createElement("li");
        li.innerHTML =
          "<i class='fa fa-circle' style='color:" +
          colors[i] +
          ";margin-right:10px'></i>" +
          categories[i];
        $(".graphPanel .legend").append(li);
      }
      let countArray = Array.from(countSet);
      let kclass = that.getJenksBreaks(countArray, 4);
      nodes.forEach(function(node) {
        node.radius = that.getJenksBreaksIndex(kclass, node.value);
      });

      $("#d3Canvas").empty();
      $(".tooltip").remove();
      $(".closePanel").empty();
      let height = $("#d3Canvas").height();
      let width = $("#d3Canvas").width();
      let graphCanvas = d3
        .select("#d3Canvas")
        .append("canvas")
        .attr("width", width + "px")
        .attr("height", height + "px")
        .node();

      // window.addEventListener("resize", () => {simulationUpdate()});

      let radius = 5;
      let selectedNode = null;
      let selectedLink = null;
      let connected = { connectedNodes: [], connectedLinks: [] };
      let lockFlag = false;
      let timeout = null;

      let context = graphCanvas.getContext("2d");

      let color = function(key) {
        if (colorsObj.hasOwnProperty(key)) {
          return colorsObj[key];
        } else {
          return "#e4e5e5";
        }
      };

      let tooltip = d3
        .select(".graphPanel")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // let close = d3
      //   .select(".closePanel")
      //   .append("a")
      //   .attr("class", "el-icon-close")
      //   .on("click", function() {
      //     lockFlag = false;
      //     $("#rightPanel")
      //       .css("transform", "translate(400px,0)")
      //       .css("transition", "transform 0.5s ease-in-out");
      //     simulationUpdate();
      //   });

      // let strength = links.length - nodes.length;
      // if (strength < 0) {
      //   strength = -strength;
      // }
      let strength = nodes.length;
      if (strength < 500) {
        strength = 500;
      }
      let simulation = d3
        .forceSimulation()
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .force("charge", d3.forceManyBody().strength(-1 * strength))
        .force(
          "link",
          d3
            .forceLink()
            .strength(2)
            .id(function(d) {
              return d.id;
            })
          // .distance(60)
        )
        .alphaTarget(0)
        .alphaDecay(0.05);

      let transform = d3.zoomIdentity;

      function zoomed() {
        console.log("zooming");
        transform = d3.event.transform;
        simulationUpdate();
      }

      d3.select(graphCanvas)
        .on("mousemove", mouseMove)
        .on("click", mouseClick)
        .call(
          d3.drag().subject(dragsubject)
          // .on("start", dragstarted)
          // .on("drag", dragged)
          // .on("end", dragended)
        )
        .call(
          d3
            .zoom()
            .scaleExtent([1 / 10, 8])
            .on("zoom", zoomed)
        );

      function dragsubject() {
        var i,
          x = transform.invertX(d3.event.x),
          y = transform.invertY(d3.event.y),
          dx,
          dy;
        that.nodeLinks = [];
        for (i = nodes.length - 1; i >= 0; --i) {
          let node = nodes[i];
          dx = x - node.x;
          dy = y - node.y;
          if (dx * dx + dy * dy < radius * radius) {
            // node.x = transform.applyX(node.x);
            // node.y = transform.applyY(node.y);
            // return node;
            // console.log(node);
            that.nodeName = node.name;
            that.nodeCategory = node.category;
            that.infoPanelShow = true;
            for (let i = 0; i < links.length; i++) {
              let link = links[i];
              if (link.source.id === node.id) {
                that.nodeLinks.push(link.target);
              } else if (link.target.id === node.id) {
                that.nodeLinks.push(link.source);
              }
            }
            that.$nextTick(() => {
              if (that.table) {
                that.table.destroy();
                that.table = null;
              }
              that.table = $("#linkTable").DataTable({
                columns: [
                  { data: "name", name: "NAME" },
                  { data: "category", name: "TYPE" }
                ],
                bInfo: false,
                searching: false,
                bLengthChange: false,
                data: that.nodeLinks
              });
            });
            return false;
          }
        }
        that.infoPanelShow = false;
        if (that.table) {
          that.table.destroy();
        }
        that.table = null;

        console.log("dragsubject start +");
      }

      function dragstarted() {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d3.event.subject["lastFx"] = d3.event.subject.fx;
        d3.event.subject["lastFy"] = d3.event.subject.fy;
        d3.event.subject.fx = transform.invertX(d3.event.x);
        d3.event.subject.fy = transform.invertY(d3.event.y);
      }

      function dragged() {
        d3.event.subject.fx = transform.invertX(d3.event.x);
        d3.event.subject.fy = transform.invertY(d3.event.y);
      }

      function dragended() {
        if (!d3.event.active) simulation.alphaTarget(0);
        let currentNode = d3.event.subject;
        if (
          d3.event.subject.lastFx === d3.event.subject.fx &&
          d3.event.subject.lastFy === d3.event.subject.fy
        ) {
          setTimeout(function() {
            console.log(currentNode, "click");
            if (currentNode) {
              lockFlag = true;
              that.infoPanel.id = currentNode.id;
              that.infoPanel.title = currentNode.name;
              that.infoPanel.subType = currentNode.category.toUpperCase();
              that.infoPanel.color = color(currentNode.category);
              switch (currentNode.category.toUpperCase()) {
                case "MODEL":
                  that.infoPanel.class = "fa fa-globe fa-3x";
                  break;
                case "RESEARCHER":
                  that.infoPanel.class = "fa fa-user-circle-o fa-3x";
                  break;
                case "AGENCY":
                  that.infoPanel.class = "fa fa-institution fa-3x";
                  break;
                case "LOCATION":
                  that.infoPanel.class = "fa fa-map-marker fa-3x";
                  break;
              }
              that.infoPanel.connectedData = [];
              for (let i = 0; i < links.length; i++) {
                let link = links[i];
                if (link.source.id === currentNode.id) {
                  that.infoPanel.connectedData.push(link.target);
                } else if (link.target.id === currentNode.id) {
                  that.infoPanel.connectedData.push(link.source);
                }
              }
              $("#rightPanel")
                .css("transform", "translate(0,0)")
                .css("transition", "transform 0.5s ease-in-out");
              $("#rightPanel").scrollTop(0);
            }
          }, 200);
        }
        //d3.event.subject.fx = null;
        //d3.event.subject.fy = null;
      }

      simulation.nodes(nodes).on("tick", simulationUpdate);

      simulation.force("link").links(links);

      // simulation.on("end", settled);

      function settled() {
        nodes.forEach(function(d) {
          d.fx = d.x;
          d.fy = d.y;
        });
      }

      function simulationUpdate() {
        if (lockFlag) {
          return;
        }
        context.save();

        context.clearRect(0, 0, width, height);
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);

        for (let i = 0; i < links.length; i++) {
          let d = links[i];
          context.beginPath();
          context.moveTo(d.source.x, d.source.y);
          context.lineTo(d.target.x, d.target.y);
          if (
            connected.connectedLinks.length > 0 &&
            connected.connectedLinks.indexOf(d.index) < 0
          ) {
            context.strokeStyle = "rgba(0,0,0,0.1)"; //ColorToRgba(color(d.type), 0.1)
          } else {
            context.strokeStyle = color(d.label);
          }

          context.stroke();
        }

        for (let i = 0; i < nodes.length; i++) {
          let d = nodes[i];
          context.beginPath();

          context.arc(d.x, d.y, d.radius, 0, 2 * Math.PI, true);
          if (
            connected.connectedNodes.length > 0 &&
            connected.connectedNodes.indexOf(d.id) < 0
          ) {
            context.fillStyle = "#e4e5e5";
          } else {
            context.fillStyle = color(d.category);
          }

          context.fill();

          context.strokeStyle = "#fff";
          context.stroke();
        }
        context.restore();
      }

      function mouseMove() {
        let point = d3.mouse(this);
        if (timeout) {
          clearTimeout(timeout);
        }

        if (selectedNode) {
          let dx = selectedNode.x * transform.k + transform.x - point[0];
          let dy = selectedNode.y * transform.k + transform.y - point[1];
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > radius * transform.k) {
            tooltip
              .transition()
              .duration(100)
              .style("opacity", 0);
            selectedNode = null;
            selectedLink = null;
            connected = { connectedNodes: [], connectedLinks: [] };
            simulationUpdate();
          }
        } else {
          tooltip
            .transition()
            .duration(100)
            .style("opacity", 0);
        }

        timeout = setTimeout(function() {
          let minDistance = Infinity;

          for (let i = 0; i < nodes.length; i++) {
            let d = nodes[i];
            let dx = d.x * transform.k + transform.x - point[0];
            let dy = d.y * transform.k + transform.y - point[1];
            let distance = Math.sqrt(dx * dx + dy * dy);
            // console.log(d,point,dx,dy,distance,transform)

            if (distance < minDistance && distance <= radius * transform.k) {
              minDistance = distance;
              selectedNode = d;
            }
          }

          if (selectedNode) {
            connected = getConnected(selectedNode);
            // console.log(connected);
            simulationUpdate();
            tooltip
              .transition()
              .duration(100)
              .style("opacity", 0.8);
            tooltip
              .html(
                "Name:" +
                  selectedNode.name +
                  "<br/>Category:" +
                  selectedNode.category
              )
              .style(
                "left",
                selectedNode.x * transform.k +
                  transform.x +
                  radius * transform.k +
                  "px"
              )
              .style("top", selectedNode.y * transform.k + transform.y + "px");
          }
        }, 100);
      }

      function mouseClick() {
        let that = this;
        let point = d3.mouse(this);
        if (timeout) {
          clearTimeout(timeout);
        }

        if (selectedNode) {
          let dx = selectedNode.x * transform.k + transform.x - point[0];
          let dy = selectedNode.y * transform.k + transform.y - point[1];
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > radius * transform.k) {
            that.infoPanelShow = true;
            lockFlag = true;
          } else {
            lockFlag = false;
            simulationUpdate();
          }
        } else {
          lockFlag = false;
          simulationUpdate();
        }

        timeout = setTimeout(function() {
          let minDistance = Infinity;

          for (let i = 0; i < nodes.length; i++) {
            let d = nodes[i];
            let dx = d.x * transform.k + transform.x - point[0];
            let dy = d.y * transform.k + transform.y - point[1];
            let distance = Math.sqrt(dx * dx + dy * dy);
            // console.log(d,point,dx,dy,distance,transform)

            if (distance < minDistance && distance <= radius * transform.k) {
              minDistance = distance;
              selectedNode = d;
            }
          }

          if (selectedNode) {
            lockFlag = true;
          } else {
            lockFlag = false;
            simulationUpdate();
          }
        }, 100);
      }

      function judgePointInLine(point, link) {
        let target = link.target;
        let source = link.source;
        point[0] = point[0] * transform.k - transform.x;
        point[1] = point[1] * transform.k - transform.y;
        if (
          (point[0] - target.x) * (target.y - source.y) ==
            (target.x - source.x) * (point[1] - target.y) &&
          (point[0] >= Math.min(target.x, source.x) &&
            point[0] <= Math.max(target.x, source.x)) &&
          (point[1] >= Math.min(target.y, source.y) &&
            point[1] <= Math.max(target.y, source.y))
        )
          return true;
        return false;
      }

      function ColorToRgba(hex, fade) {
        var rgb = []; // 定义rgb数组
        if (/^\#[0-9A-F]{3}$/i.test(hex)) {
          //判断传入是否为#三位十六进制数
          let sixHex = "#";
          hex.replace(/[0-9A-F]/gi, function(kw) {
            sixHex += kw + kw; //把三位16进制数转化为六位
          });
          hex = sixHex; //保存回hex
        }
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
          //判断传入是否为#六位十六进制数
          hex.replace(/[0-9A-F]{2}/gi, function(kw) {
            rgb.push(eval("0x" + kw)); //十六进制转化为十进制并存如数组
          });
          rgb.push(fade);
          return `rgba(${rgb.join(",")})`; //输出RGB格式颜色
        } else {
          console.log(`Input ${hex} is wrong!`);
          return "rgba(0,0,0,0.8)";
        }
      }

      function getConnected(node) {
        let connectedNodes = [node.id],
          connectedLinks = [];
        for (let i = 0; i < links.length; i++) {
          let link = links[i];
          if (link.source.id === node.id) {
            connectedNodes.push(link.target.id);
            connectedLinks.push(link.index);
          } else if (link.target.id === node.id) {
            connectedNodes.push(link.source.id);
            connectedLinks.push(link.index);
          }
        }

        return { connectedNodes, connectedLinks };
      }
    },
    createHistoryTrendGraph() {
      if (this.historyChart) {
        this.historyChart.dispose();
      }
      let that = this;
      $.ajax({
        url: "/static/KnowledgeGraph/assets/xajModel/researchTrend.json",
        type: "get",
        dataType: "json",
        success: function(data) {
          that.historyChart = echarts.init(
            document.getElementById("historyGraph")
          );
          that.historyChart.showLoading();
          that.researcherOrder = data.researcher;
          that.agencyOrder = data.agency;
          let xAxisData = [];
          let seriesData = [];
          for (let i = 1970; i < 2019; i++) {
            xAxisData.push(i);
          }
          for (let obj of data.count) {
            seriesData.push(obj.count);
          }
          let option = {
            title: {
              text: "count by year",
              left: "center"
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                animation: false,
                label: {
                  backgroundColor: "#ccc",
                  borderColor: "#aaa",
                  borderWidth: 1,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  textStyle: {
                    color: "#222"
                  }
                }
              },
              formatter: function(params) {
                return params[0].name + "<br />" + params[0].value;
              }
            },
            grid: {
              left: "1%",
              right: "1%",
              bottom: "1%",
              top: "100",
              containLabel: true
            },
            xAxis: {
              type: "category",
              data: xAxisData
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: seriesData,
                type: "line",
                smooth: true
              }
            ]
          };

          that.historyChart.hideLoading();
          that.historyChart.setOption(option);
        }
      });
    },
    createHistoryCountryGraph() {
      if (this.historyChart) {
        this.historyChart.dispose();
      }
      let that = this;
      if (this.worldData == null) {
        $.ajax({
          url: "/static/KnowledgeGraph/assets/world.json",
          type: "get",
          async: false,
          success: function(world) {
            that.worldData = world;
            echarts.registerMap("world", that.worldData);
          }
        });
      }
      if (this.worldData) {
        this.$nextTick(() => {
          let countryFeatures = this.worldData.features;
          let countries = [];
          for (let feature of countryFeatures) {
            let name = feature.properties.name;
            if (countries.indexOf(name) < 0) {
              countries.push(name);
            }
          }
          this.historyChart = echarts.init(
            document.getElementById("countryGraph")
          );
          this.historyChart.showLoading();
          $.ajax({
            url: "/static/KnowledgeGraph/assets/xajModel/researchCountry.json",
            type: "get",
            dataType: "json",
            success: function(result) {
              let max = 0;
              let timeLineData = [],
                allYearData = [];
              for (let i = 1970; i <= 2019; i++) {
                timeLineData.push({
                  value: i + "",
                  tooltip: {
                    formatter: function(params) {
                      // console.log(params);
                      return params.name;
                    }
                  },
                  // symbol: "diamond",
                  symbolSize: 18
                });
              }
              for (let i = 0; i < result.length; i++) {
                let data = result[i];
                if (Object.keys(data).length > 0) {
                  for (let key in data) {
                    if (data[key] > max) {
                      max = data[key];
                    }
                  }
                }
              }
              for (let i = 0; i < result.length; i++) {
                let data = result[i];
                // if (Object.keys(data).length > 0) {

                // }
                let countryValue = [];
                for (let j = 0; j < countries.length; j++) {
                  let country = countries[j];
                  // if(country==="United States of America"){
                  //   country = "United States"
                  // }
                  let obj = { name: country, value: 0 };
                  if (data[country]) {
                    obj = { name: country, value: data[country] };
                  }
                  countryValue.push(obj);
                }

                let currentYearOption = {
                  visualMap: {
                    left: "right",
                    min: 0,
                    max: max,
                    inRange: {
                      color: ["#eeeeee", "#50a3ba", "#eac736", "#d94e5d"]
                    },
                    text: ["High", "Low"], // 文本，默认为数值文本
                    calculable: true
                  },
                  series: [
                    {
                      name: "world",
                      type: "map",
                      roam: true,
                      map: "world",
                      itemStyle: {
                        emphasis: { label: { show: true } }
                      },
                      // 文本位置修正
                      textFixed: {
                        Alaska: [20, -20]
                      },
                      data: countryValue
                    }
                  ]
                };
                allYearData.push(currentYearOption);
              }
              let option = {
                baseOption: {
                  title: {
                    subtext: "count by year",
                    left: "center"
                  },
                  timeline: {
                    axisType: "category",
                    autoPlay: true,
                    playInterval: 2000,
                    data: timeLineData
                  },
                  tooltip: {
                    trigger: "item",
                    showDelay: 0,
                    transitionDuration: 0.2,
                    formatter: function(params) {
                      var value = (params.value + "").split(".");
                      value = value[0].replace(
                        /(\d{1,3})(?=(?:\d{3})+(?!\d))/g,
                        "$1,"
                      );
                      return (
                        params.seriesName + "<br/>" + params.name + ": " + value
                      );
                    }
                  }
                },
                options: allYearData
              };
              that.historyChart.hideLoading();
              that.historyChart.setOption(option);
            }
          });
        });
      }
    },
    historyChange(active) {
      this.histroyActive = active;
      if (this.histroyActive === 0) {
        this.createHistoryTrendGraph();
      } else {
        this.createHistoryCountryGraph();
      }
    },
    prepareLeafletMap() {
      let that = this;
      if (this.locationOfModel.length === 0) {
        $.ajax({
          url: "/static/KnowledgeGraph/assets/xajModel/locationOfModel.json",
          type: "get",
          success: function(locations) {
            that.locationOfModel = locations;
            let countArray = that.locationOfModel.map(function(item) {
              return item.count;
            });
            let classNum = 5;
            if (countArray.length < 5) {
              classNum = countArray.length;
            }
            that.kclass = that.getJenksBreaks(countArray, classNum);
            let promises = [];
            for (let obj of that.locationOfModel) {
              let promise = that.getLocationGeojson(obj.id);
              promises.push(promise);
            }

            Promise.all(promises).then(result => {
              that.locationGeojson = result;
              that.$nextTick(function() {
                that.createLeafletMap();
              });
            });
          }
        });
      }
    },
    createLeafletMap() {
      let that = this;
      let map = L.map("leadletMap", { attributionControl: false }).setView(
        [0, 0],
        2
      );
      let landGeojson = null;
      $.ajax({
        url: "/static/KnowledgeGraph/assets/ne_50m_admin_0_countries.json",
        type: "get",
        async: false,
        success: function(world) {
          landGeojson = world;
        }
      });
      if (landGeojson) {
        L.geoJSON(landGeojson, {
          style: {
            color: "#333",
            weight: 0.3
          }
        }).addTo(map);
        var geojsonMarkerOptions = {
          radius: 2,
          fillColor: "#66b1ff",
          color: "#fff",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        };
        for (let obj of this.locationGeojson) {
          let weight = 0.3;
          let currentColor = that.color[0];
          for (let i = 0; i < this.locationOfModel.length; i++) {
            let location = this.locationOfModel[i];
            if (location.id === obj.id) {
              let weight = this.getWeight(location.count);

              currentColor = that.color[weight - 3];
              weight = weight / 10;
              break;
            }
          }
          let err = geojsonhint.hint(obj.geojson);
          if (err.length === 0) {
            L.geoJSON(obj.geojson, {
              style: {
                color: currentColor,
                weight: weight
              },
              pointToLayer: function(feature, latlng) {
                geojsonMarkerOptions.radius = weight * 10;
                geojsonMarkerOptions.fillColor = currentColor;
                return L.circleMarker(latlng, geojsonMarkerOptions);
              }
            })
              .addTo(map)
              .bindPopup(obj.name);
          }
        }
      }
    },
    getLocationGeojson(id) {
      let that = this;
      let promise = new Promise(function(resolve, reject) {
        $.ajax({
          url: "http://222.192.7.75//Knowledge/GetLocationByIdServlet",
          data: { id: id },
          type: "get",
          success: function(data) {
            resolve(data);
          }
        });
      });
      return promise;
    },
    getJenksBreaks(data, numclass) {
      function sortNumber(a, b) {
        //在javascript里，Array的sort方法，必须用这个函数，否则不是按数字大小排序
        return a - b;
      }
      // int numclass;
      var numdata = data.length;
      if (numdata <= 0) {
        return [];
      }
      data.sort(sortNumber); //先排序

      var mat1 = new Array();
      var mat2 = new Array();
      var st = new Array();

      for (var j = 0; j <= numdata; j++) {
        mat1[j] = new Array();
        mat2[j] = new Array();
        st[j] = 0;
        for (var i = 0; i <= numclass; i++) {
          mat1[j][i] = 0;
          mat2[j][i] = 0;
        }
      }

      for (var i = 1; i <= numclass; i++) {
        mat1[1][i] = 1;
        mat2[1][i] = 0;
        for (var j = 2; j <= numdata; j++) {
          mat2[j][i] = Number.MAX_VALUE;
        }
      }
      var v = 0;

      for (var l = 2; l <= numdata; l++) {
        var s1 = 0;
        var s2 = 0;
        var w = 0;
        var i3 = 0;
        for (var m = 1; m <= l; m++) {
          i3 = l - m + 1;

          var val = parseInt(data[i3 - 1]);

          s2 += val * val;
          s1 += val;

          w++;
          v = s2 - (s1 * s1) / w;
          var i4 = i3 - 1;
          if (i4 != 0) {
            for (var j = 2; j <= numclass; j++) {
              if (mat2[l][j] >= v + mat2[i4][j - 1]) {
                mat1[l][j] = i3;
                mat2[l][j] = v + mat2[i4][j - 1];

                if (l == 200 && j == 5)
                  console.log(
                    "l=" +
                      200 +
                      ",j=" +
                      5 +
                      ";mat2[200][5]=" +
                      mat1[l][j] +
                      "i3=" +
                      i3
                  );
              }
            }
          }
        }

        mat1[l][1] = 1;
        mat2[l][1] = v;
      }

      var k = numdata;
      var kclass = new Array();

      /* int[] kclass = new int[numclass]; */
      kclass[numclass - 1] = parseInt(data[data.length - 1]);
      /* kclass[numclass - 1] = (Integer) data.get(data.size() - 1); */

      for (var j = numclass; j >= 2; j--) {
        var id = parseInt(mat1[k][j]) - 2;
        kclass[j - 2] = parseInt(data[id]);
        k = parseInt(mat1[k][j] - 1);
      }

      return kclass;
    },
    getJenksBreaksIndex(kclass, value) {
      for (let i = 0; i < kclass.length; i++) {
        if (value <= kclass[i]) {
          return (i + 1) * 5;
        }
      }
    },
    getWeight(count) {
      let len = this.kclass.length;
      if (len === 1) {
        return 3;
      } else {
        for (let i = 1; i < len; i++) {
          if (count <= this.kclass[i]) {
            return 3 + (i - 1) * 1;
          }
        }
      }
    },
    createKeyWords() {
      let that = this;
      this.$nextTick(() => {
        if (this.keywordChart === null) {
          $.ajax({
            url:
              "http://222.192.7.75/Knowledge/GetKeywordsByIdDivideInYearServlet",
            data: { id: "0bf2a302-6081-47e2-9c9e-82b0dc0b0a30" },
            type: "get",
            success: function(data) {
              that.createD3StreamGraph(data);
            }
          });
        }
      });
    },
    createD3StreamGraph(data) {
      // console.log(data);
      let colorrange = [
        "#045A8D",
        "#2B8CBE",
        "#74A9CF",
        "#A6BDDB",
        "#D0D1E6",
        "#F1EEF6"
      ];
      let strokecolor = colorrange[0];
      var format = d3.timeFormat("%Y-%m-%d");
      var margin = { top: 20, right: 40, bottom: 30, left: 30 };
      let height = $("#keywordChart").height();
      let width = $("#keywordChart").width();
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;
      // let tooltip = d3
      //   .select(".keywordsPanel")
      //   .append("div")
      //   .attr("class", "remove")
      //   .style("position", "absolute")
      //   .style("z-index", "20")
      //   .style("visibility", "hidden")
      //   .style("top", "30px")
      //   .style("left", "55px");
      let tooltip = d3
        .select(".keywordsPanel")
        .append("div")
        .attr("class", "streamInfo")
        .style("opacity", 0);
      let svg = d3
        .select("#keywordChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      let legendSet = new Set(),
        yearSet = new Set();
      //   min = -10,
      //   max = 0;
      for (let obj of data) {
        legendSet.add(obj["name"]);
        if (obj["time"] * 1 > 1969) {
          yearSet.add(obj["time"]);
        }else{
          console.log(obj["time"])
        }
      }
      // console.log(min,max)
      let legends = Array.from(legendSet);
      let years = Array.from(yearSet);
      years.sort(function(a, b) {
        return a - b;
      });
      // console.log(legends)
      let newData = [];
      for (let i = 0; i < years.length; i++) {
        let year = years[i];
        let obj = {};
        obj["year"] = year;
        for (let j = 0; j < legends.length; j++) {
          let legend = legends[j];
          let count = this.getCountFromData(data, year, legend);
          // console.log(count);
          obj[legend] = count;
        }
        newData.push(obj);
      }
      // console.log(newData);
      let legendCount = [];
      for (let legend of legends) {
        let obj = {};
        obj["name"] = legend;
        obj["count"] = 0;
        for (let newD of newData) {
          obj["count"] = obj["count"] + newD[legend];
        }
        legendCount.push(obj);
      }

      legendCount.sort(function(a, b) {
        return b.count - a.count;
      });

      // console.log(legendCount);

      let keys = [];
      let num = legendCount.length > 100 ? 100 : legendCount.length;
      for (let i = 0; i < num; i++) {
        keys.push(legendCount[i].name);
      }

      let x = d3
        .scaleLinear()
        .domain(
          d3.extent(newData, function(d) {
            return d["year"];
          })
        )
        .range([0, width]);

      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));

      let y = d3
        .scaleLinear()
        .domain([-legendCount[0].count*2, legendCount[0].count*2])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      let color = d3
        .scaleOrdinal()
        .domain(keys)
        .range([
          "#60B58B",
          "#FF7F24",
          "#FF4500",
          "#FF4500",
          "#e41a1c",
          "#377eb8",
          "#4daf4a",
          "#984ea3",
          "#ff7f00",
          "#ffff33",
          "#a65628",
          "#f781bf"
        ]);

      //stack the data?
      let stackedData = d3
        .stack()
        .offset(d3.stackOffsetSilhouette)
        .keys(keys)(newData);
      // Show the areas
      // console.log(stackedData)

      svg
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .style("fill", function(d) {
          return color(d.key);
        })
        .attr(
          "d",
          d3
            .area()
            .x(function(d, i) {
              return x(d.data.year);
            })
            .y0(function(d) {
              return y(d[0]);
            })
            .y1(function(d) {
              return y(d[1]);
            })
        )
        .on("mousemove", function(d, i) {
          let mouse = d3.mouse(this);
          let mouseX = mouse[0];
          let invertedx = x.invert(mouseX);
          invertedx = Math.ceil(invertedx);

          let count = 0;
          for (let key in d) {
            let obj = d[key];
            if (Array.isArray(obj)) {
              let currentData = obj.data;
              if (currentData.year * 1 === invertedx) {
                count = currentData[d.key];
                break;
              }
            }
          }

          tooltip
            .transition()
            .duration(100)
            .style("opacity", 0.8);
          tooltip.html(
            "Name:" + d.key + "<br/>Year:" + invertedx + "<br/>Count:" + count
          );
          // .style("left", mouse[0] + "px")
          // .style("top", mouse[1] + "px");
        })
        .on("mouseout", function(d, i) {
          tooltip
            .transition()
            .duration(100)
            .style("opacity", 0);
        });
    },
    getCountFromData(data, year, legend) {
      for (let obj of data) {
        if (obj.time === year && obj.name === legend) {
          return obj.count;
        }
      }
      return 0;
    }
  }
});

// function getLinksByYear(sYear, eYsar, links) {
//   let resultLink = [];
//   for (let link of links) {
//     let time = link.time * 1;
//     if (time >= sYear && time <= eYsar) {
//       resultLink.push(link);
//     }
//   }
//   return resultLink;
// }

// function getNodesByLink(links, nodes) {
//   let resultNodes = new Set();
//   for (let link of links) {
//     let sourceId = link.source;
//     let targetId = link.target;
//     for (let node of nodes) {
//       if (node.id === sourceId || node.id === targetId) {
//         resultNodes.add(node);
//       }
//     }
//   }
//   return Array.from(resultNodes);
// }

/**
 * 
  function createGraph(graph) {
    let links = getLinksByYear(2018, 2019, graph.links);
    let nodes = getNodesByLink(links, graph.nodes);
    let categoriesSet = new Set();
    let countSet = new Set();
    for (let obj of nodes) {
      categoriesSet.add(obj.category);
      countSet.add(obj.value);
    }
    let categories = Array.from(categoriesSet);
    let countArray = Array.from(countSet);
    let kclass = getJenksBreaks(countArray, 4);
    let categoriesArray = [];
    for (let categorie of categories) {
      let obj = { name: categorie };
      categoriesArray.push(obj);
    }

    nodes.forEach(function(node) {
      if (nodes.length > 500) {
        node.x = null;
        node.y = null;
      }
      node.emphasis = {
        label: {
          show: false
        }
      };
      node.symbolSize = getJenksBreaksIndex(kclass, node.value);
      if (node.value > 5000) {
        node.label = {
          show: true
        };
      }
    });
    let myChart = echarts.init(document.getElementById("echarts"));
    console.log(nodes, links);
    if (nodes.length > 500) {
      let option = {
        title: {
          text: "xajModel Knowledge Graph",
          top: "bottom",
          left: "right"
        },
        color: [
          "#dd6b66",
          "#759aa0",
          "#e69d87",
          "#8dc1a9",
          "#ea7e53",
          "#eedd78",
          "#73a373",
          "#73b9bc",
          "#7289ab",
          "#91ca8c",
          "#f49f42"
        ],
        tooltip: {},
        legend: [
          {
            // selectedMode: 'single',
            data: categories,
            textStyle: {
              color: "#eee"
            }
          }
        ],
        series: [
          {
            name: "xajModel Knowledge Graph",
            type: "graphGL",
            data: nodes,
            edges: links,
            categories: categoriesArray,
            roam: true,
            lineStyle: {
              color: "rgba(255,255,255,1)",
              opacity: 0.05
            },
            itemStyle: {
              opacity: 1
              // borderColor: '#fff',
              // borderWidth: 1
            },
            focusNodeAdjacency: false,
            focusNodeAdjacencyOn: "click",
            label: {
              textStyle: {
                color: "#fff"
              }
            },
            emphasis: {
              label: {
                show: false
              },
              lineStyle: {
                opacity: 0.5,
                width: 4
              }
            },
            forceAtlas2: {
              steps: 5,
              stopThreshold: 20,
              jitterTolerence: 10,
              edgeWeight: [0.2, 1],
              gravity: 5,
              edgeWeightInfluence: 0
              // preventOverlap: true
            }
          }
        ]
      };
      myChart.setOption(option);
    } else {
      let option = {
        title: {
          text: "xajModel Knowledge Graph",
          top: "bottom",
          left: "right"
        },
        color: [
          "#dd6b66",
          "#759aa0",
          "#e69d87",
          "#8dc1a9",
          "#ea7e53",
          "#eedd78",
          "#73a373",
          "#73b9bc",
          "#7289ab",
          "#91ca8c",
          "#f49f42"
        ],
        tooltip: {},
        legend: [
          {
            // selectedMode: 'single',
            data: categories,
            textStyle: {
              color: "#eee"
            }
          }
        ],
        animationDuration: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            name: "xajModel Knowledge Graph",
            type: "graph",
            layout: "force",
            data: nodes,
            links: links,
            categories: categoriesArray,
            roam: true,
            focusNodeAdjacency: true,
            force: {
              repulsion: 100
            },
            itemStyle: {
              normal: {
                borderColor: "#fff",
                borderWidth: 1,
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.3)"
              }
            },
            label: {
              position: "right",
              formatter: "{b}"
            },
            lineStyle: {
              color: "source",
              curveness: 0.3
            },
            emphasis: {
              lineStyle: {
                width: 10
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    }
  }
 */
/**
 * series 可以添加
 *           modularity: true,

          // Specify resolution. Higher resolution will produce less communities
          modularity: {
            resolution: 5,
            // If sort the communities
            sort: false
          }
 */

/**
  * 普通
  * {
          name: "xajModel Knowledge Graph",
          type: "graph",
          layout: "force",
          data: graph.nodes,
          links: graph.links,
          categories: categoriesArray,
          roam: true,
          focusNodeAdjacency: true,
          itemStyle: {
            normal: {
              borderColor: "#fff",
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.3)"
            }
          },
          label: {
            position: "right",
            formatter: "{b}"
          },
          lineStyle: {
            color: "source",
            curveness: 0.3
          },
          emphasis: {
            lineStyle: {
              width: 10
            }
          }
        }
  */

/**
  * webgl
  * {
          name: "xajModel Knowledge Graph",
          type: "graphGL",
          layout: "force",
          data: nodes,
          edges: links,
          categories: categoriesArray,
          roam: true,
          lineStyle: {
            // color: "source",
            color: '#aaa',
            curveness: 0.3
          },
          itemStyle: {
            opacity: 1
            // borderColor: '#fff',
            // borderWidth: 1
          },
          focusNodeAdjacency: true,
          focusNodeAdjacencyOn: "click",
          label: {
            show:false,
            textStyle: {
              color: "#fff"
            }
          },
          emphasis: {
            label: {
              show: false
            },
            lineStyle: {
              opacity: 0.5,
              width: 4
            }
          },
          forceAtlas2: {
            steps: 5,
            stopThreshold: 20,
            jitterTolerence: 10,
            edgeWeight: [0.2, 1],
            gravity: 5,
            edgeWeightInfluence: 0
            // preventOverlap: true
          }
        }
  */
