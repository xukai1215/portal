/**
 * Created by Administrator on 2017/5/28.
 */
var windowHeight =$(window).height();
$(document).ready(function () {
    $('.tree li:has(ul)').addClass('parent_li');
    $('.tree li.parent_li > span').on('click', function (e){
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        var siblingsLi = $(this).parent('li.parent_li').siblings();
        if (children.is(":visible")){
            children.hide("fast");
            $(this).find("i").addClass("fa-caret-right").removeClass("fa-caret-down");
        }else {
            children.show("fast");
            $(this).find("i").addClass("fa-caret-down").removeClass("fa-caret-right");
            for(var i=0;i<siblingsLi.length;i++){
                var siblingsChildren = $(siblingsLi[i]).find(">ul>li");
                if (siblingsChildren.is(":visible")){
                    siblingsChildren.hide("fast");
                    $(siblingsLi[i]).children("SPAN").find("i").addClass("fa-caret-right").removeClass("fa-caret-down");
                }
            }
        }
        e.stopPropagation();
    });

    //默认显示第一个分类
    var hideParents=$('.tree li.parent_li:not(:first-child) > span');
    var hideChildren=hideParents.parent('li.parent_li').find(' > ul > li');
    hideChildren.hide('fast');
    hideParents.find(' > i').addClass("fa-caret-right").removeClass("fa-caret-down");
});

function resetTree() {
    $('.tree li:has(ul)').addClass('parent_li');
    $('.tree li.parent_li > span').on('click', function (e){
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        var siblingsLi = $(this).parent('li.parent_li').siblings();
        if (children.is(":visible")){
            children.hide("fast");
            $(this).find("i").addClass("fa-caret-right").removeClass("fa-caret-down");
        }else {
            children.show("fast");
            $(this).find("i").addClass("fa-caret-down").removeClass("fa-caret-right");
            for(var i=0;i<siblingsLi.length;i++){
                var siblingsChildren = $(siblingsLi[i]).find(">ul>li");
                if (siblingsChildren.is(":visible")){
                    siblingsChildren.hide("fast");
                    $(siblingsLi[i]).children("SPAN").find("i").addClass("fa-caret-right").removeClass("fa-caret-down");
                }
            }
        }
        e.stopPropagation();
    });

    //默认显示第一个分类
    var hideParents=$('.tree li.parent_li:not(:first-child) > span');
    var hideChildren=hideParents.parent('li.parent_li').find(' > ul > li');
    hideChildren.hide('fast');
    hideParents.find(' > i').addClass("fa-caret-right").removeClass("fa-caret-down");
}