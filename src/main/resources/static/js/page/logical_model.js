new Vue({
    el: '#app',
    data: function () {
        return {
            activeIndex:'3-2',
            activeNameGraph: 'Image',

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
                            url: "/logicalModel/getUserOidByOid",
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
                                window.sessionStorage.setItem("editlogicalModel_id",oid)
                                window.location.href="/user/createlogicalModel";
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
        switchClick(i){

            if(i==1) {
                $(".tab1").css("display", "block");
                $(".tab2").css("display", "none");
                $(".tab3").css("display", "none");
            }
            else if(i==2) {
                $(".tab1").css("display", "none");
                $(".tab2").css("display", "block");
                $(".tab3").css("display", "none");
            }
            else{
                $(".tab1").css("display", "none");
                $(".tab2").css("display", "none");
                $(".tab3").css("display", "block");
            }


            var btns=$(".switch-btn")

            btns.css("color","#636363");
            btns.eq(i-1).css("color","#428bca");

        },

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