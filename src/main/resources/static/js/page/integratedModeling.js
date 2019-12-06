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

            this.runVisible = true;

            let iframeWindow=$("#ModelEditor")[0].contentWindow;
            var xml = iframeWindow.getCXml();

            if(iframeWindow.currentXml != xml){
                this.models = iframeWindow.getModels();

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
                            child.eventType = node.dataType;

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
            var uid = this.generateGUID();
            var name = "TEST";
            var version = "1.0";

            xml += "<TaskConfiguration uid='"+uid+"' name='"+name+"' version='"+version+"'>" +
                "<Models>";
            for (var i = 0; i<this.models.length; i++){
                xml += "<Model name='"+this.models[i].name+"' pid='"+this.models[i].md5+"' description='"+this.models[i].description+"'>"+
                    "<InputData>";
                for(var j = 0; j<this.models[i].inputEvents.length; j++){
                   xml +=  "<DataTemplate state='"+this.models[i].inputEvents[j].state+"' event='"+this.models[i].inputEvents[j].event+"' value='"+this.models[i].inputEvents[j].value+"' dataId='"+this.models[i].inputEvents[j].dataId+"' type='"+this.models[i].inputEvents[j].type+"'/>";
                }
                xml += "</InputData>"+
                     "<OutputData>";
                for(var k = 0; k<this.models[i].outputEvents.length; k++){
                    xml +="<DataTemplate state='"+this.models[i].outputEvents[k].state+"' event='"+this.models[i].outputEvents[k].event+"' value='"+this.models[i].outputEvents[k].value+"' dataId='"+this.models[i].outputEvents[k].dataId+"' type='"+this.models[i].outputEvents[k].type+"'/>";
                }
                xml += "</OutputData>"+
                    "</Model>";
            }
            xml += "</Models>"+
                "</TaskConfiguration>";

            console.log(xml);

            var xml2 = "<TaskConfiguration uid=\"d3f91907-f5ac-4170-b54b-cf7aadd8654d\" name=\"SAGA_DEMO\" version=\"1.0\">\n" +
            "<Models>\n" +
            "\t\t<Model name=\"shapes_polygons_3-Convert_Lines_to_Polygons\" pid=\"926895554c5552b1429031242ecaf517\" description=\"shapes_polygons_3-Convert_Lines_to_Polygons\">\n" +
            "\t\t\t<InputData>\n" +
            "\t\t\t\t<DataTemplate state=\"RUNSTATE\" event=\"LINES\" value=\"http://172.21.212.64:8082/dataResource/getResource?sourceStoreId=f3a7f532-6a7b-4196-a693-29e8653564b4\" dataId=\"802aa210-44af-4f46-8f41-4f65d9003289\" type=\"url\" />\n" +
            "\t\t\t</InputData>\n" +
            "\t\t\t<OutputData>\n" +
            "\t\t\t\t<DataTemplate state=\"RUNSTATE\" event=\"POLYGONS\" value=\"\" dataId=\"4caf0d8a-f71a-48b7-a99f-d82fc44837bb\" type=\"url\" />\n" +
            "\t\t\t</OutputData>\n" +
            "\t\t</Model>\n" +
            "\t\t<Model name=\"shapes_tools_18-Shapes_Buffer\" pid=\"9096db4dc61ec3f9987de55ba6666503\" description=\"shapes_tools_18-Shapes_Buffer\">\n" +
            "\t\t\t<InputData>\n" +
            "\t\t\t\t<DataTemplate state=\"RUNSTATE\" event=\"SHAPES\" value=\"4caf0d8a-f71a-48b7-a99f-d82fc44837bb\" dataId=\"a5d2950b-8c1d-40da-ae6d-9bf33d812ee8\" type=\"link\" />\n" +
            "\t\t\t</InputData>\n" +
            "\t\t\t<OutputData>\n" +
            "\t\t\t\t<DataTemplate state=\"RUNSTATE\" event=\"BUFFER\" value=\"\" dataId=\"1cf2fa21-68ff-42d8-a34f-b4c55649de59\" type=\"url\" />\n" +
            "\t\t\t</OutputData>\n" +
            "\t\t</Model>\n" +
            "\t</Models>\n" +
            "</TaskConfiguration>";


            console.log(xml2);
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
                                    console.log(status);
                                }
                                else if(status==-1){
                                    console.log(status);
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
                                    console.log(status);
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

                                    let models=obj.data.models;
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
            if (event.value != undefined) {
                this.eventChoosing = event;
                window.open("/dispatchRequest/download?url=" + this.eventChoosing.url);
            }
            else {
                this.$message.error("No data can be downloaded.");
            }
        },

        generateGUID () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        }
    },
    mounted(){

        $("#uploadInputData").change(()=> {

            $('#datainput'+this.currentEvent.dataId).addClass("spinner");

            var file = $('#uploadInputData')[0].files[0];
            var formData = new FormData();
            formData.append("file",file);
            $.ajax({
                type:"post",
                url: "http://111.229.14.128:8082/file/upload/store_dataResource_files",
                data: formData,
                async:true,
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
                            async:true,
                            contentType:'application/json',
                            success:(result) => {
                                if(result.code == 0){

                                    this.currentEvent.value = "http://111.229.14.128:8082/dataResource/getResource?sourceStoreId="+result.data.sourceStoreId;
                                    this.currentEvent.fileName = result.data.fileName;
                                    this.currentEvent.suffix = result.data.suffix;

                                }

                                $("#uploadInputData").val("");

                                $('#datainput'+this.currentEvent.dataId).removeClass("spinner");

                            }
                        })



                    }
                }
            })
        });

    }

});