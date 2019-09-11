new Vue({
    el: '#app',
    data: function () {
        return {
            modelItemFormVisible:false,
            activeIndex:'3-1',
            activeNameGraph: 'Image',
            activeName: 'Conceptual Model',

            form:{
                name:"",
            },
            graphVisible:"none"
        }
    },
    methods: {
        edit(){
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
                    if (data.oid == "") {
                        alert("Please login first");
                        this.setSession("history",window.location.href);
                        window.location.href = "/user/login";
                    }
                    else {
                        let href=window.location.href;
                        let hrefs=href.split('/');
                        let oid=hrefs[hrefs.length-1].split("#")[0];
                        $.ajax({
                            type: "GET",
                            url: "/conceptualModel/getUserOidByOid",
                            data: {
                                oid:oid
                            },
                            cache: false,
                            async: false,
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            success: (json) => {
                                // if(json.data==data.oid){
                                window.sessionStorage.setItem("editConceptualModel_id",oid)
                                window.location.href="/user/createConceptualModel";
                                // }
                                // else{
                                //     alert("You are not the model item's author, please contact to the author to modify the model item.")
                                // }
                            }
                        });
                    }
                }
            })
        },

        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },

        switchClick(i){

            if(i==2) {
                $(".tab1").css("display", "none");
                $(".tab2").css("display", "block");
            }
            else {
                $(".tab2").css("display", "none");
                $(".tab1").css("display", "block");
            }

            var btns=$(".switch-btn")
            btns.eq(i%2).css("color","#636363");
            //btns.eq(i%2).attr("href","javascript:void(0)");
            btns.eq((i+1)%2).css("color","#428bca");
            //btns.eq((i+1)%2).attr("href","");
        },

        formateTime(val){
            var date = new Date(val);
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        },

        bindModelItem(){
            let urls=window.location.href.split("/");
            $.ajax({
                type: "GET",
                url: "/modelItem/bindModel/",
                data: {
                    type:1,
                    name:this.form.name,
                    oid:urls[urls.length-1]
                },
                async: false,
                success: (json) => {
                    if(json.code==-1){
                        this.$alert('Model item is not exist,please check the name.', 'Error', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                this.$message({
                                    type: 'info',
                                    message: `action: ${ action }`
                                });
                            }
                        });
                    }
                    else{
                        this.$alert('Bind successfully!', 'Success', {
                            confirmButtonText: 'OK',
                            callback: action => {
                                window.location.href=window.location.href.substring(0,window.location.href.length-36)+json.data;
                            }
                        });
                    }
                }
            })
        },

    },
    mounted(){
        $("#mxgraph_popup").css("left","140px");

        let parentWidth=$("#pane-Image").width();
        let children=$("#pane-Image img");
        for(i=0;i<children.length;i++){
            if(children.eq(i).width()>parentWidth){
                children.eq(i).css("width","100%")
            }
        }

        $(document).on("click", ".detail-toggle", function () {
            if ($(this).text() == "[Collapse]") {
                $(this).text("[Expand]");
            }
            else {
                $(this).text("[Collapse]")
            }

        })

        $("[data-toggle='tooltip']").tooltip();

        new QRCode(document.getElementById("qrcode"), {
            text: window.location.href,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

    }
})