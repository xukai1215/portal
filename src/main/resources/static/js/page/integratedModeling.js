var vue = new Vue({
    el: "#app",
    data:{
        models:[],

        runVisible: false,

        activeName: "",
        formData: new FormData(),

        currentEvent:{},

    },
    methods:{
        run(){
            let iframeWindow=$("#ModelEditor")[0].contentWindow;
            this.models = iframeWindow.getModels();

            this.runVisible = true;
            this.activeName = this.models[0].name;

            for (var i = 0; i<this.models.length; i++){
                for(var j = 0; j<this.models[i].inputEvents.length; j++){
                    var event = this.models[i].inputEvents[j];
                    var nodes = event.data[0].nodes;

                    if (nodes != undefined) {
                        let children = [];
                        for (k = 0; k < nodes.length; k++) {
                            let node = nodes[k];
                            let child = {};
                            child.dataId = node.text;
                            child.event = node.text;
                            child.description = node.desc;
                            switch (node.dataType) {
                                case "DTKT_INT":
                                    child.eventType = "int";
                                    break;
                                case "DTKT_REAL":
                                    child.eventType = "real";
                                    break;
                                case "DTKT_INT | DTKT_LIST":
                                    child.eventType = "int_array";
                                    break;
                            }
                            child.child = true;
                            children.push(child);
                        }
                        event.children = children;
                    }
                }
            }
        },

        upload(event) {
            $('#uploadInputData').click();
            this.currentEvent=event;

        },

        runModels(){
            var xml = "";
            // var str = "<TaskConfiguration uid='d3f91907-f5ac-4170-b54b-cf7aadd8654d' name='SAGA_DEMO' version='1.0'>"+
            //                 "<Models>"+
            //                     "<Model name='"+this.models[0].name+"' pid='"+this.models[0].pid+"' description='"+this.models[0].description+"'>"+
            //                         "<InputData>"+
            //                             "<DataTemplate state='"+this.models[0].inputEvents[0].state+"' event='"+this.models[0].inputEvents[0].event+"' value='"+this.models[0].inputEvents[0].url+"' dataId='"+this.models[0].inputEvents[0].dataId+"' type='"+this.models[0].inputEvents[0].type+"'/>"+
            //                         "</InputData>"+
            //                         "<OutputData>"+
            //                             "<DataTemplate state='"+this.models[0].outputEvents[0].state+"' event='"+this.models[0].outputEvents[0].event+"' value='"+this.models[0].inputEvents[0].url+"' dataId='"+this.models[0].outputEvents[0].dataId+"' type='"+this.models[0].outputEvents[0].type+"'/>"+
            //                         "</OutputData>"+
            //                     "</Model>"+
            //                 "</Models>"+
            //             "</TaskConfiguration>";

            xml += "<TaskConfiguration uid='d3f91907-f5ac-4170-b54b-cf7aadd8654d' name='SAGA_DEMO' version='1.0'>" +
                "<Models>";
            for (var i = 0; i<this.models.length; i++){
                xml += "<Model name='"+this.models[i].name+"' pid='"+this.models[i].pid+"' description='"+this.models[i].description+"'>";
                for(var j = 0; j<this.models[i].inputEvents.length; j++){
                   xml +=  "<InputData>"+
                                "<DataTemplate state='"+this.models[i].inputEvents[j].state+"' event='"+this.models[i].inputEvents[j].event+"' value='"+this.models[i].inputEvents[j].value+"' dataId='"+this.models[i].inputEvents[j].dataId+"' type='"+this.models[i].inputEvents[j].type+"'/>"+
                            "</InputData>";
                }

                for(var k = 0; k<this.models[i].outputEvents.length; k++){
                    xml += "<OutputData>"+
                                "<DataTemplate state='"+this.models[i].outputEvents[k].state+"' event='"+this.models[i].outputEvents[k].event+"' value='"+this.models[i].outputEvents[k].value+"' dataId='"+this.models[i].outputEvents[k].dataId+"' type='"+this.models[i].outputEvents[k].type+"'/>"+
                            "</OutputData>";
                }
                xml += "</Model>";
            }
            xml += "</Models>"+"</TaskConfiguration>";

            console.log(xml);
            let file = new File([xml],'test.xml',{
                type: 'text/xml',
            });
            var formData = new FormData();
            formData.append("file",file);
            formData.append("name","test");

            $.ajax({
                url:"/task/runIntegratedTask",
                data:formData,
                type: "POST",
                processData: false,
                contentType: false,
                success:(result) =>{
                    var taskId = result.data;
                    let interval=setInterval(()=>{
                        $.ajax({
                            url:"/task/checkIntegratedTask/"+taskId,
                            data:{},
                            type: "GET",
                            success: (obj)=> {
                                let status=obj.data.status;
                                if (status == 0){

                                }
                                else if(status==-1){
                                    clearInterval(interval);
                                    this.$alert('Integrated model run failed!', 'Error', {
                                        confirmButtonText: 'OK',
                                        callback: action => {
                                            this.$message({
                                                type: 'danger',
                                                message: `action: ${ action }`
                                            });
                                        }
                                    });
                                }
                                else{
                                    clearInterval(interval);
                                    this.$alert('Integrated model run Success', 'Success', {
                                        confirmButtonText: 'OK',
                                        callback: action => {
                                            this.$message({
                                                type: 'success',
                                                message: `action: ${ action }`
                                            });
                                        }
                                    });

                                    let models=data.models;
                                    console.log(models)
                                }
                            }
                        })
                    },3000)

                }
            })


        },


        download(event) {
            //下载接口
            if (event.url != undefined) {
                this.eventChoosing = event;
                window.open("/dispatchRequest/download?url=" + this.eventChoosing.url);
            }
            else {
                this.$message.error("No data can be downloaded.");
            }
        },

    },
    mounted(){

        $("#uploadInputData").change(()=> {
            var file = $('#uploadInputData')[0].files[0];
            var formData = new FormData();
            formData.append("file",file);
            $.ajax({
                type:"post",
                url: "http://111.229.14.128:8082/file/upload/store_dataResource_files",
                data: formData,
                async:false,
                processData: false,
                contentType: false,
                success: (result)=>{
                    if (result.code == 0){
                        var data = result.data;
                        var dataName = data.file_name.match(/.+(?=\.)/)[0];
                        var dataSuffix = data.file_name.match(/(?=\.).+/)[0];
                        var dataId = data.source_store_id;
                        var dataUrl = "http://111.229.14.128:8082/dataResource";
                        var form = {
                            "author":"njgis",
                            "fileName":dataName,
                            "sourceStoreId":dataId,
                            "suffix":dataSuffix,
                            "type":"OTHER",
                            "fromWhere":"PORTAL"
                        };

                        $.ajax({
                            type:"post",
                            url: dataUrl,
                            data: JSON.stringify(form),
                            processData: false,
                            async:false,
                            contentType:'application/json',
                            success:(result) => {
                                if(result.code == 0){

                                    this.currentEvent.value = "http://111.229.14.128:8082/dataResource/getResource?sourceStoreId="+result.data.sourceStoreId;
                                    this.currentEvent.fileName = result.data.fileName;
                                    this.currentEvent.suffix = result.data.suffix;

                                }
                            }
                        })



                    }
                }
            })
        });

        $(".number").click(()=>{
            console.log("aa");
        })

    }

});