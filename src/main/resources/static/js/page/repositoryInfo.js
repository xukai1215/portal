new Vue({
    el: "#app",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: {
        activeIndex: '8-1',
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
                    if (data.oid === "") {
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
                            url: "/repository/getConceptUserOidByOid",
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
                                window.sessionStorage.setItem("editConcept_id",oid)
                                window.location.href="/repository/createConcept";
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
    }

});

new QRCode(document.getElementById("qrcode"), {
    text: window.location.href,
    width: 200,
    height: 200,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});