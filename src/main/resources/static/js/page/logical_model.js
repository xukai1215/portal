new Vue({
    el: '#app',
    data: function () {
        return {
            activeIndex:'3-2',
            activeNameGraph: 'Image',

        }
    },
    methods: {
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