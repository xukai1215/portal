function gotoTop(minHeight){

    // 定义点击返回顶部图标后向上滚动的动画
    $(".backTop").click(
        function(){$('html,body').animate({scrollTop:'0px'},1200);

        })

    // 获取页面的最小高度，无传入值则默认为5000像素
    minHeight? minHeight = minHeight:minHeight = 5000;

    // 为窗口的scroll事件绑定处理函数
    $(window).scroll(function(){

        // 获取窗口的滚动条的垂直滚动距离
        var s = $(window).scrollTop();

        // 当窗口的滚动条的垂直距离大于页面的最小高度时，让返回顶部图标渐现，否则渐隐
        if( s > minHeight){
            console.log(s)
            $(".backTop").fadeIn(500);
        }else{
            $(".backTop").fadeOut(500);
        };

        if( s > 4750){
            $(".feedBack").fadeIn(500);
        }else{
            $(".feedBack").fadeOut(500);
        };

    });


    $(".backTopUserpage").click(
        function(){$('html,body').animate({scrollTop:'0px'},300);
            console.log('backTop')
        })

// 获取页面的最小高度，无传入值则默认为600像素

// 为窗口的scroll事件绑定处理函数
    $(window).scroll(function(){

        // 获取窗口的滚动条的垂直滚动距离
        var s = $(window).scrollTop();

        // 当窗口的滚动条的垂直距离大于页面的最小高度时，让返回顶部图标渐现，否则渐隐
        if( s > 800){
            $(".backTopUserpage").fadeIn(300);
        }else{
            $(".backTopUserpage").fadeOut(300);
        };

        // if( s > 4750){
        //     $(".feedBack").fadeIn(300);
        // }else{
        //     $(".feedBack").fadeOut(300);
        // };

    });
};


gotoTop();