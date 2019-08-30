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
                        let type=hrefs[hrefs.length-2];
                        let oid=hrefs[hrefs.length-1].split("#")[0];
                        let url="",sessionName="",location="";

                        switch (type){
                            case "concept":
                                url="/repository/getConceptUserOidByOid";
                                sessionName="editConcept_id";
                                location="/repository/createConcept";
                                break;
                            case "spatialReference":
                                url="/repository/getSpatialReferenceUserOidByOid";
                                sessionName="editSpatial_id";
                                location="/repository/createSpatialReference";
                                break;
                            case "template":
                                url="/repository/getTemplateUserOidByOid";
                                sessionName="editTemplate_id";
                                location="/repository/createTemplate";
                                break;
                            case "unit":
                                url="/repository/getUnitUserOidByOid";
                                sessionName="editUnit_id";
                                location="/repository/createUnit";
                                break;
                        }
                        $.ajax({
                            type: "GET",
                            url: url,
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
                                window.sessionStorage.setItem(sessionName,oid)
                                window.location.href=location;
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