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
            }

        }
    },
    methods: {

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
        }

    },
    mounted(){
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