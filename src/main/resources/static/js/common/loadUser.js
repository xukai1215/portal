    //
    // //TODO:渲染用户信息放后台
    // $.ajax({
    //     url: '/user/load',
    //     type: 'get',
    //     // dataType : 'json',
    //     success: function (result) {
    //         var json = JSON.parse(result);
    //         var windowWidth=$(window).width();
    //
    //         if (json.oid != '') {
    //             // $(".login").css("display", "none");
    //             // $(".login2").css("display", "none");
    //             // $("#phoneLogin").css("display", "none");
    //
    //             //小屏适配和大屏均获取用户姓名
    //             // $("#userName").text(json.name);
    //             // $("#userAloha").text(json.name);
    //             // if (windowWidth > 956)  {
    //             //     $(".loged").css("display", "block");
    //             // }
    //             // else if(windowWidth > 826) {
    //             //大屏加载
    //             if(windowWidth>501) {
    //                 // $(".loged").css("display", "block");
    //
    //                 // var image = (json.image == "" || json.image == null) ? "/static/img/icon/default.png" : json.image;
    //                 // $(".userIcon").attr("src", image)
    //
    //                 // $("#userPageDir").attr("href", "/user/" + json.oid);
    //             }
    //             //小屏加载
    //             else {
    //                 // $(".phoneLoged").css("display", "block");
    //                 // var image = (json.image == "" || json.image == null) ? "/static/img/icon/default.png" : json.image;
    //                 // $(".userIcon").attr("src", image)
    //
    //                 // $("#phoneUserPageDir").attr("href", "/user/" + json.oid);
    //             }
    //
    //
    //             window.sessionStorage.setItem("name", json.name);
    //             window.sessionStorage.setItem("oid", json.oid);
    //         }
    //     },
    //     error: function (e) {
    //         alert("Load user failed！");
    //     }
    // });

