new Vue({
    el: '#app',
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: function () {
        return {
            activeIndex:'2',
            activeName: 'Computable Model',
            tableData6: [{
                title: 'Anisotropic magnetotransport and exotic longitudinal linear magnetoresistance in WT e2 crystals',
                authors: 'Zhao Y.,Liu H.,Yan J.,An W.,Liu J.,Zhang X.,Wang H.,Liu Y.,Jiang H.,Li Q.,Wang Y.,Li X.-Z.,Mandrus D.,Xie X.~C.,Pan M.,Wang J.',
                date: 'jul 2015',
                journal: 'prb',
                pages: "041104"
            }, {
                title: 'Detection of a Flow Induced Magnetic Field Eigenmode in the Riga Dynamo Facility',
                authors: 'Gailitis A.,Lielausis O.,Dement\'ev S.,Platacis E.,Cifersons A.,Gerbeth G.,Gundrum T.,Stefani F.,Christen M.,Hanel H.,Will G.',
                date: 'may 2000',
                journal: 'Physical Review Letters',
                pages: "4365-4368"
            }],
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
                        window.location.href = "/user/login";
                    }
                    else {
                        let href=window.location.href;
                        let hrefs=href.split('/');
                        let oid=hrefs[hrefs.length-1];
                        $.ajax({
                            type: "GET",
                            url: "/modelItem/getUserOidByOid",
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
                                if(json.data==data.oid){
                                    window.sessionStorage.setItem("editModelItem_id",oid)
                                    window.location.href="/user/createModelItem";
                                }
                                else{
                                    alert("You are not the model item's author, please contact to the author to modify the model item.")
                                }
                            }
                        });
                    }
                }
            })
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
        link(event){
            let refLink=$(".refLink");
            for(i=0;i<refLink.length;i++){
                if(event.currentTarget==refLink[i]){
                    window.open(this.tableData6[i].links);
                }
            }
            console.log(event.currentTarget);
        },
        jump(num){
            $.ajax({
                type: "GET",
                url: "/user/load",
                data: {},
                cache: false,
                async: false,
                xhrFields:{
                    withCredentials: true
                },
                crossDomain:true,
                success: (data) => {
                    data=JSON.parse(data);
                    if (data.oid == "") {
                        alert("Please login first");
                        window.location.href = "/user/login";
                    }
                    else{
                        var bindOid=window.location.pathname.substring(11);
                        this.setSession("bindOid",window.location.pathname.substring(11));
                        switch (num){
                            case 1:
                                window.open("/user/createConceptualModel","_blank")
                                break;
                            case 2:
                                window.open("/user/createLogicalModel","_blank")
                                break;
                            case 3:
                                window.open("/user/createComputableModel","_blank")
                                break;
                        }


                    }
                }
            })
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

        $('html, body').animate({scrollTop:0}, 'slow');

        let descHeight=$("#description .block_content").height();
        if(descHeight>300){
            $("#description .block_content").css("overflow","hidden")
            $("#description .block_content").css("height","250px")

            $(".fullPaper").removeClass("hide");
        }

        let refs=$("#ref").val();
        if(refs!=null) {
            let json = JSON.parse(refs);
            for (i = 0; i < json.length; i++) {
                json[i].author = json[i].author.join(", ");
            }
            console.log(json);
            this.tableData6 = json;
        }
        $(".createConceptual").click(()=>{
            this.jump(1);
        })
        $(".createLogical").click(()=>{
            this.jump(2);
        })
        $(".createComputable").click(()=>{
            this.jump(3);
        })

        $("#fullPaper").click(function(){
            $("#description .block_content").css("overflow","inherit");
            $("#description .block_content").css("height","auto");
            $(".fullPaper").remove();
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