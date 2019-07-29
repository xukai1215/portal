$(document).ready(function() {
// 箭头旋转
    $('#arrow1').rotate({
        bind: {
            mouseover: function () {
                $(this).rotate({animateTo: 180});
            }, mouseout: function () {
                $(this).rotate({animateTo: 0});
            }
        }
    });
});