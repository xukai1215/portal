

    $.ajax({
        url: '/user/load',
        type: 'get',
        // dataType : 'json',
        success: function (result) {
            var json = JSON.parse(result);
            var menuitem = $(".el-menu-item");
            console.log(menuitem)
            var count = menuitem.length;
            if (json.oid != '') {
                var image = (json.image == ""||json.image == null) ? "../static/img/icon/default.png" : json.image;
                //console.log(menuitem)
                menuitem.get(count - 2).innerHTML = "<a href='/user/out'>Log Out</a>"
                menuitem.get(count - 1).innerHTML = "            <a href='/user/userSpace' style='display: -webkit-box;'>\n" +
                    "                <img class='round_icon' src='" + image + "' style='width:30px;height: 30px;display: inline-block;margin-right:10px'>\n" +
                    "                <div style='display: inline-block;'>" + json.name + "</div>\n" +
                    "            </a>"
                window.sessionStorage.setItem("name",json.name);
                window.sessionStorage.setItem("oid",json.oid);
            }
            else {
                menuitem.get(count - 2).innerHTML = "<a href=\"/user/register\">Sign Up</a>"
                menuitem.get(count - 1).innerHTML = "<a href=\"/user/login\">Log In</a>"
            }
        },
        error: function (e) {
            alert("加载用户失败！");
        }
    });

