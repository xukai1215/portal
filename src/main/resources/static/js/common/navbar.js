//element-ui 切换英文，勿删！
ELEMENT.locale(ELEMENT.lang.en)

$("#wx").mouseover(function(){
    $("#wxqrcode").fadeIn();
});
$("#wx").mouseout(function(){
    $("#wxqrcode").fadeOut();
});
// 获得下拉一级菜单
// 获得下拉二级菜单
// var menu=bar.children;
var dropm1 = document.getElementById('drop1'), dropm2 = document.getElementById('drop2'),
    dropmls = document.getElementById('dropls'), dropmmu = document.getElementById('dropmu'),
    leftdropmc = document.getElementById('leftcommunity'),leftdropmh = document.getElementById('lefthelp'),
    userLogedDrop = document.getElementById('userLoged'),
    phoneDropCom = document.getElementById('phoneCommunity'),phoneDropHelp = document.getElementById('phoneHelp'),
    dropstrip = document.getElementById('dropstrip'),
    phoneUserDrop= document.getElementById('phoneUserDrop'),

    submenu1 = document.getElementById('subCommunity'), submenu2 = document.getElementById('subHelp'),
    submenuls = document.getElementById('subls'), submenumu = document.getElementById('submenu'),
    subleftc = document.getElementById('leftCommunitySub'), sublefth = document.getElementById('leftHelpSub'),
    logedSub = document.getElementById('logedSub'),
    phoneCommunitySub= document.getElementById('phoneSubCom'), phoneHelpSub = document.getElementById('phoneSubHelp'),
    phonesub = document.getElementById('phonesub'),
    phonesub = document.getElementById('phonesub'),

    sub1 = document.getElementsByClassName('sub')[0], sub2 = document.getElementsByClassName('sub')[1],
    subls = document.getElementsByClassName('sub')[2], submu = document.getElementsByClassName('sub')[3],
    lsubc = document.getElementsByClassName('sub')[4], lsubh = document.getElementsByClassName('sub')[5],
    subLoged = document.getElementsByClassName('subLog')[0],
    phoneSubSub1 = document.getElementsByClassName('lsubComm')[0], phoneSubSub2 = document.getElementsByClassName('lsubHelp')[0],
    logedIcon = document.getElementsByClassName('loged')[0],
        mainBarMenu = document.getElementsByClassName('mainmenu')[0],
        indentMenu = document.getElementsByClassName('indentmenu')[0],

    communityArrow1=document.getElementsByClassName("arrow")[0],helpArrow1=document.getElementsByClassName("arrow")[1],
    communityArrow2=document.getElementsByClassName("arrow")[2],helpArrow1=document.getElementsByClassName("arrow")[3],

    phoneUserSub = document.getElementsByClassName('fullSub')[0],
    fullsub = document.getElementsByClassName('fullSub')[1],

    phoneLoged = document.getElementsByClassName('phoneLoged')[0],

    clickMenu=document.getElementsByClassName('clickMenu'),clickSubMenu=document.getElementsByClassName('clickSubMenu'),

    e = e || window.event;
    // var timerFold,timerDrop;
// 判断鼠标在元素上，返回元素ID
function getMouseClass(e){
    var mouseClass=e.target.getAttribute("class");
    // alert("click ad"+mouseClass);
    console.log(e.target);
    return mouseClass;
}

function subMenuDropDpwn(target,timerDrop,timerFold){
    let childrenCount=target.children('ul').children('li').length;
    // console.log(childrenCount);
    let timeLength=childrenCount*60;
    let height=childrenCount*45+5;
    // target.animate({height:height},timeLength,'swing');
    target.children('ul').animate({height:height},timeLength,'swing');
    // target.children('ul').children().css('display','block')
    let li=target.children('ul').children('li');
    clearTimeout(timerFold);
    // for (let i=0;i<childrenCount;i++){
    //     timerDrop=setTimeout(()=>{
    //         console.log('drop'+li.eq(i).children('a').text())
    //         li.eq(i).css('display','block');
    //         },(i+1)*50) ;
    // }

}

function fullSubMenuDropDpwn(target){
    let childrenCount=target.children('ul').children('li').length;
    // console.log(childrenCount);
    let timeLength=childrenCount*60+5;
    let height=(childrenCount-1)*50+2;
    target.children().animate({height:height},timeLength,'swing');
    // target.children('ul').children().css('display','block')
    let li=target.children('ul').children('li');
    for (let i=0;i<childrenCount;i++){
        setTimeout(()=>{li.eq(i).css('display','block');},(i+1)*50) ;
    }
    setTimeout(()=>{
        target.children('ul').children('#phoneLogin').animate({height:'50'},150);
        target.children('ul').children('#phoneLogin').css('background-color','#00abff')
    },timeLength)


}

function subMenuFoldUp(target,timerDrop,timerFold){
    let childrenCount=target.children('ul').children('li').length;
    let timeLength=childrenCount*40;

        // target.animate({height:0},timeLength,'linear');
    target.children('ul').animate({height:0},timeLength,'linear');
    let li=target.children('ul').children('li');
    // target.children('ul').children().css('display','none')
    clearTimeout(timerDrop);
    // for (let i=childrenCount-1,t=1;i>=0;i--,t++){
    //     timerFold=setTimeout(()=>{
    //         console.log('fold'+li.eq(i).children('a').text())
    //
    //         li.eq(i).css('display','none');
    //         // if(li.eq(childrenCount-1).css('display')==='none'){
    //         //     target.children().animate({height:0},timeLength-45,'linear');
    //         // }
    //     },t*45) ;
    // }

    target.children('ul').children('#phoneLogin').css('height','0')
}

function fullSubMenuFoldUp(target){
    let childrenCount=target.children('ul').children('li').length;
    let timeLength=childrenCount*40;

    // target.animate({height:0},timeLength,'linear');
    target.children().animate({height:0},timeLength,'linear');
    let li=target.children('ul').children('li');
    // clearTimeout(timerDrop);
    for (let i=childrenCount-1,t=1;i>=0;i--,t++){
        timerFold=setTimeout(()=>{
            // console.log('fold'+li.eq(i).children('a').text())
            li.eq(i).css('display','none');
        },t*45) ;
    }
    target.children('ul').children('#phoneLogin').css('height','0')
}

// 悬浮一级菜单
var tFoldComm, tFoldHelp,tFoldLog,tFoldls, tFoldLmu,tFoldleftC,tDropleftC,tFoldleftH,tDropleftH,t,a,
    timerDropCom,timerFoldCom;
//community drop down and fold up
$('#drop1').mouseenter(()=>{
    clearTimeout(tFoldComm);
    //clearTimeout(tFoldHelp);
    $('#drop1').css('borderBottomColor','#00c0ff');
    $('#drop1').children().css('color','#00c0ff');
    let target=$('.sub:eq(0)');

    subMenuDropDpwn(target,timerDropCom,timerFoldCom);
})

$('#drop1').mouseleave(()=>{
    let target=$('.sub:eq(0)');
    let timerDrop,TimerFold;
    tFoldComm = setTimeout(()=>{
        subMenuFoldUp(target,timerFoldCom,timerFoldCom);
        $('#drop1').css('borderBottomColor','#080a0e');
        $('#drop1').children().css('color','#f5f5f5');
    },150);

})

$('#subCommunity').mouseenter(()=>{
    clearTimeout(tFoldComm);
    let timerDrop,TimerFold;
    $('#drop1').css('borderBottomColor','#00c0ff');
    $('#drop1').children().css('color','#00c0ff');
    let target=$('#subCommunity');
    subMenuDropDpwn(target,timerFoldCom,timerFoldCom);
})

$('#subCommunity').mouseleave(()=>{
    let target=$('#subCommunity');
    let timerDrop,TimerFold;
    t=Date.now();
    tFoldComm=setTimeout(()=>{
        subMenuFoldUp(target,timerFoldCom,timerFoldCom);
        $('#drop1').css('borderBottomColor','#080a0e');
        $('#drop1').children().css('color','#f5f5f5');
    },150)

})

//help drop down and fold up
$('#drop2').mouseenter(()=>{
    //clearTimeout(tFoldComm);
    let timerDrop,TimerFold;
    clearTimeout(tFoldHelp);
    let target=$('.sub:eq(1)');
    $('#drop2').css('borderBottomColor','#00c0ff');
    $('#drop2').children().css('color','#00c0ff');
    subMenuDropDpwn(target);
})

$('#drop2').mouseleave(()=>{
    let target= $('.sub:eq(1)');
    let timerDrop,TimerFold;
    tFoldHelp=setTimeout(()=>{
        subMenuFoldUp(target);
        $('#drop2').css('borderBottomColor','#080a0e');
        $('#drop2').children().css('color','#f5f5f5');
    },150);

})

$('#subHelp').mouseenter(()=>{
    clearTimeout(tFoldHelp);
    let timerDrop,TimerFold;
    $('#drop2').css('borderBottomColor','#00c0ff');
    $('#drop2').children().css('color','#00c0ff');
    let target=$('#subHelp');
    subMenuDropDpwn(target);
})

$('#subHelp').mouseleave(()=>{
    let target=$('#subHelp');
    let timerDrop,TimerFold;
    tFoldHelp=setTimeout(()=>{
        subMenuFoldUp(target);
        $('#drop2').css('borderBottomColor','#080a0e');
        $('#drop2').children().css('color','#f5f5f5');
    },150)
})

//user page and space route drop down and fold up
$('.loged').mouseenter(()=>{
    //clearTimeout(tFoldComm);
    clearTimeout(tFoldLog);
    let target=$('#logedSub');
    subMenuDropDpwn(target);
})

$('.loged').mouseleave(()=>{
    let target= $('#logedSub');
    tFoldLog=setTimeout(()=>{
        subMenuFoldUp(target);
    },200);

})

$('#logedSub').mouseenter(()=>{
    clearTimeout(tFoldLog);
    let target=$('#logedSub');
    subMenuDropDpwn(target);
})

$('#logedSub').mouseleave(()=>{
    let target=$('#logedSub');
    tFoldLog=setTimeout(()=>{
        subMenuFoldUp(target);
    },200)
})

//haif-width log in/sign up drop down and fold up
$('.login2').mouseenter(()=>{
    clearTimeout(tFoldls);
    let target=$('.sub:eq(2)');
    subMenuDropDpwn(target);
})

$('.login2').mouseleave(()=>{
    let target= $('.sub:eq(2)');
    tFoldls=setTimeout(()=>{
        subMenuFoldUp(target);
    },200);
})

$('#subls').mouseenter(()=>{
    clearTimeout(tFoldls);
    let target=$('.sub:eq(2)');
    subMenuDropDpwn(target);
})

$('#subls').mouseleave(()=>{
    let target=$('.sub:eq(2)');
    tFoldls=setTimeout(()=>{
        subMenuFoldUp(target);
    },200)
})

//left sub menu drop down and fold up
$('#dropmu').click((e)=>{
    clearTimeout(tFoldLmu);
    let target=$('.sub:eq(3)');
    let height=target.children('ul').css('height');
    if (height=='0px'){
        target.css('display','block')
        subMenuDropDpwn(target);
    }

    else
        subMenuFoldUp(target);
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
})

$('html').click((e)=>{
    if($(e.target).closest("#leftUl").length == 0){
        clearTimeout(tFoldLmu);
        let target=$('.sub:eq(3)');
        subMenuFoldUp(target);
    }
})

//community in left sub menu  drop down and fold up
$('#leftcommunity').mouseenter(()=>{
    clearTimeout(tFoldleftC);
    let target= $('#leftCommunitySub');
    tFoldleftC=setTimeout(()=>{
        subMenuDropDpwn(target);
    },120);
})

$('#leftcommunity').mouseleave(()=>{
    clearTimeout(tDropleftC)
    let target= $('#leftCommunitySub');
    tFoldleftC=setTimeout(()=>{
        subMenuFoldUp(target);
    },100);
})

$('#leftCommunitySub').mouseenter(()=>{
    clearTimeout(tFoldleftC);
    $('#leftcommunity').children('a').css('color','#00C0FF');
    let target= $('#leftCommunitySub')
    tFoldleftC=setTimeout(()=>{
        subMenuDropDpwn(target);
    },120);
})

$('#leftCommunitySub').mouseleave(()=>{
    clearTimeout(tDropleftC);
    let target=$('#leftCommunitySub');
    tFoldleftC=setTimeout(()=>{
        subMenuFoldUp(target);
        $('#leftcommunity').children('a').css('color','#f5f5f5');
    },100)
})

//help in left sub menu  drop down and fold up
$('#lefthelp').mouseenter(()=>{
    clearTimeout(tFoldleftH);
    let target=$('#leftHelpSub');
    tDropleftC=setTimeout(()=>{
        subMenuDropDpwn(target);
    },120)

})

$('#lefthelp').mouseleave(()=>{
    clearTimeout(tDropleftH);
    let target= $('#leftHelpSub');
    tFoldleftH=setTimeout(()=>{
        subMenuFoldUp(target);
    },100);
})

$('#leftHelpSub').mouseenter(()=>{
    clearTimeout(tFoldleftH);
    $('#lefthelp').children('a').css('color','#00c0ff');
    let target=$('#leftHelpSub');
    tDropleftC=setTimeout(()=>{
        subMenuDropDpwn(target);
    },120)
})

$('#leftHelpSub').mouseleave(()=>{
    clearTimeout(tDropleftH);
    let target=$('#leftHelpSub');
    tFoldleftH=setTimeout(()=>{
        subMenuFoldUp(target);
        $('#lefthelp').children('a').css('color','#f5f5f5');
    },100)
})

//full sub menu in phone drop down
$('#dropstrip').click((e)=>{
    clearTimeout(tFoldLmu);
    let target=$('#phonesub');
    let display=target.children('ul').children().css('display');

    if (display=='none'){
        target.css('display','block');
        fullSubMenuFoldUp($('#phoneUserSub'));
        fullSubMenuDropDpwn(target);
    }

    else{
        fullSubMenuFoldUp(target);
        let target2=$('#phoneSubCom');
        let target3=$('#phoneSubHelp');
        fullSubMenuFoldUp(target);
        fullSubMenuFoldUp(target2);
        fullSubMenuFoldUp(target3);
        $('#phoneHelp').css('margin-top','0px');
        $('#aboutUs').css('margin-top','0px');
    }
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
})

$('#phoneCommunity').click((e)=>{
    let target=$('#phoneSubCom');
    let display=target.children('ul').children().css('display');

    if (display=='none'){
        clearTimeout(timeout1);
        target.css('display','block')
        fullSubMenuDropDpwn(target);
        $('#phoneHelp').animate({marginTop:250},190);
    }

    else{
        $('#phoneHelp').css('margin-top','0px');
        var timeout1=setTimeout(()=>{
            fullSubMenuFoldUp(target);
        },175);



    }

    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
})

$('#phoneHelp').click((e)=>{
    let target=$('#phoneSubHelp');
    let display=target.children('ul').children().css('display');

    if (display=='none'){
        clearTimeout(timeout2);
        target.css('display','block')
        fullSubMenuDropDpwn(target);
        $('#aboutUs').animate({marginTop:150},115);
    }

    else{
        $('#aboutUs').css('margin-top','0px');
        var timeout2=setTimeout(()=>{
            fullSubMenuFoldUp(target);
        },255);
    }
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
})

//full user sub menu on phone drop down
$('#phoneUserDrop').click((e)=>{
    let target=$('#phoneUserSub');
    let display=target.children('ul').children().css('display');

    if (display=='none'){
        target.css('display','block')
        $('#mainBar').children('ul').css('background-color','#141414')
        fullSubMenuFoldUp($('#phonesub'));
        fullSubMenuDropDpwn(target);
    }

    else{
        fullSubMenuFoldUp(target);
        $('.main').css('backGroundColor','#0f0f0f')
    }
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
})

//click blank(section) fold full sub menu
$('section').click(()=>{
    clearTimeout(tFoldLmu);
    let target=$('#phonesub');
    let target2=$('#phoneSubCom');
    let target3=$('#phoneSubHelp');
    fullSubMenuFoldUp(target);
    fullSubMenuFoldUp(target2);
    fullSubMenuFoldUp(target3);
    fullSubMenuFoldUp($('#phoneUserSub'));
    $('#phoneHelp').css('margin-top','0px');
    $('#aboutUs').css('margin-top','0px');
})
// dropm1.onmouseover = function (e) {
//
//     sub1.style.display = 'block';
//     // communityArrow1.style.transform='rotate(315deg)';
//     // communityArrow1.style.marginTop='10 px';
// };
// dropm1.onmouseout = function (e) {
//     sub1.style.display = 'none';
//     // communityArrow1.style.transform='rotate(135deg)';
// };

//用户信息下拉
// userLogedDrop.onmouseover = function (e) {
//     subLoged.style.display = 'block';
// };
// userLogedDrop.onmouseout = function (e) {
//     subLoged.style.display = 'none';
// };
// logedSub.onmouseover = function (e) {
//     subLoged.style.display = 'block';
// };
// logedSub.onmouseout = function (e) {
//     subLoged.style.display = 'none';
// };

// 这两个函数似乎class.也是可以的

// dropstrip.onclick = function (e) {
//     if(fullsub.style.display === 'none')
//     {
//         fullsub.style.display = 'block';
//     }else{
//         fullsub.style.display = 'none';
//     }
//     if(phoneUserSub.style.display==='block')
//     {
//         phoneUserSub.style.display='none';
//     }
//     if(e&&e.stopPropagation){
//         e.stopPropagation();
//     }else{
//         e.cancelBubble = true;
//     }
// };
//
// phoneUserDrop.onclick = function (e) {
//     if(phoneUserSub.style.display === 'none')
//     {
//         phoneUserSub.style.display = 'block';
//     }else{
//         phoneUserSub.style.display = 'none';
//     }
//     if(fullsub.style.display==='block')
//     {
//         fullsub.style.display='none';
//     }
//     if(e&&e.stopPropagation){
//         e.stopPropagation();
//     }else{
//         e.cancelBubble = true;
//     }
// };


// phoneDropCom.onclick = function (e) {
//     if(phoneSubSub1.style.display === 'none')
//     {
//         phoneSubSub1.style.display = 'block';
//     }else{
//         phoneSubSub1.style.display = 'none';
//     }
//     if(e&&e.stopPropagation){
//         e.stopPropagation();
//     }else{
//         e.cancelBubble = true;
//     }
// };
// //
// phoneDropHelp.onclick = function (e) {
//     if(phoneSubSub2.style.display === 'none')
//     {
//         phoneSubSub2.style.display = 'block';
//     }else{
//         phoneSubSub2.style.display = 'none';
//     }
//     if(e&&e.stopPropagation){
//         e.stopPropagation();
//     }else{
//         e.cancelBubble = true;
//     }
// };
//
// 点击空白，菜单收回

var windowWidth;
window.onresize= ()=> {
    watchWidth();
};
//
function watchWidth() {
    windowWidth=window.innerWidth;
    if (windowWidth > 500){
        // console.log(windowWidth);
        fullsub.style.display='none';
        phoneUserSub.style.display='none';
    }
    if(windowWidth > 841||windowWidth < 501){
        submenumu.style.display='none';
    }

    if(windowWidth<501&&logedIcon.style.display==='block'){
        phoneLoged.style.display='block';
        logedIcon.style.display='none';
    }
    else if(windowWidth>=501&&phoneLoged.style.display==='block'){
        phoneLoged.style.display='none';
        logedIcon.style.display='block';
    }
    // if (windowWidth < 890 && logedIcon.style.display === "block" ) {
    //     console.log(windowWidth);
    //     mainBarMenu.style.display = 'none';
    //     indentMenu.style.display = 'block';
    // }
}

(function changeBorder (){
    for(let i=0;i<clickMenu.length;i++){
        clickMenu[i].onclick=function showBlueBorder(){
            if(i!=9&&i!=8&&i!=3&&i!=4){

                for(let i=0;i<clickMenu.length;i++ )
                    if(clickMenu[i]===this)
                        clickMenu[i].classList.add('clickBlue');
                    else
                        clickMenu[i].classList.remove('clickBlue');

            }

        };
    }

    for(let i=0;i<5;i++) {
        clickSubMenu[i].onclick = function showCommunityBorder() {
            for (let i = 0; i < clickMenu.length; i++)
                if (i == 3)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');


        };
    }
    for(let i=5;i<8;i++) {

        clickSubMenu[i].onclick = function showHelpBorder() {
            // console.log('567');
            for (let i = 0; i < clickMenu.length; i++)
                if (i == 4)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');


        };




    }
})();

(function(){
    var href=window.location.pathname;
    var hrefElement=href.split('/')[1];
    var reg=RegExp(/model/i);
    console.log(hrefElement)
    if(hrefElement.match(reg)){
        for(let i=0;i<clickMenu.length;i++){
            if(i==1)
                clickMenu[i].classList.add('clickBlue');
            else
                clickMenu[i].classList.remove('clickBlue');
        }
    }
    switch (true) {
        case hrefElement=='home'||hrefElement=='':{
            for(let i=0;i<clickMenu.length;i++){
                if(i==0)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');
            }
            break;
        }


        case (hrefElement.match(reg)|| {}).input:{
            for(let i=0;i<clickMenu.length;i++){
                if(i==1)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');
            }
        break;
        }

        case hrefElement=='dataItem':{
            for(let i=0;i<clickMenu.length;i++){
                if(i==2)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');
            }
            break;
        }

        case hrefElement=='repository'||hrefElement=='server':{
            for(let i=0;i<clickMenu.length;i++){
                if(i==3)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');
            }
            break;
        }


        case hrefElement=='help':{
            for(let i=0;i<clickMenu.length;i++){
                if(i==4)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');
            }
            break;
        }

        default:{
            break;
        }

    }


})();

// 箭头旋转
// $('#arrow1').rotate({
//     bind : {
//         mouseover : function(){
//             $(this).rotate({animateTo: 180});
//         }, mouseout : function(){
//             $(this).rotate({animateTo: 0});
//         }
//     }
// });

// ELEMENT.locale(ELEMENT.lang.en);
var message_num=0;//定义全局变量
$(document).ready(function () {
    $.ajax({
        url:"/theme/getedit",
        async:false,
        type:"GET",
        success:(json)=>{
            console.log(json);
            for (let i=0;i<json.length;i++) {
                for (let k = 0; k < 4; k++) {
                    let type;
                    switch (k) {
                        case 0:
                            type = json[i].subDetails;
                            break;
                        case 1:
                            type = json[i].subClassInfos;
                            break;
                        case 2:
                            type = json[i].subDataInfos;
                            break;
                        case 3:
                            type = json[i].subApplications;
                            break;

                    }
                    if (type != null && type.length > 0) {
                        for (let j = 0; j < type.length; j++) {
                            if (k == 0) {
                                switch (type[j].status) {
                                    case "0":
                                        message_num++;
                                }
                            }else if (k == 1){
                                switch (type[j].status) {
                                    case "0":
                                        message_num++;
                                }

                            }else if (k == 2){
                                switch (type[j].status) {
                                    case "0":
                                        message_num++;
                                }

                            } else if (k == 3){
                                switch (type[j].status) {
                                    case "0":
                                        message_num++;
                                }

                            }
                        }
                    }
                }
            }
            $.ajax({
                type: "GET",
                url: "/version/getVersions",
                data: {},
                async: false,
                success: (json) => {
                    //下面将type分到model、community中
                    //model：modelItem、conceptualModel、logicalModel、computableModel
                    // community：concept、spatialReference	、unit、template
                    for (let i=0;i<json.data.uncheck.length;i++){
                        if (json.data.uncheck[i].type == "modelItem" || json.data.uncheck[i].type == "conceptualModel"||json.data.uncheck[i].type == "logicalModel"||json.data.uncheck[i].type == "computableModel"){
                            // this.model_tableData1.push(json.data.uncheck[i]);
                            message_num++;
                        }else {
                            // this.community_tableData1.push(json.data.uncheck[i]);
                            message_num++;
                        }
                    }

                }
            })
            $(".notice_num").text(message_num);
            //判断message_num是否为0，控制导航栏红点显示
            if (message_num!=0){
                $(".message_user").show();
                $(".notice_num").show();
            } else {
                $(".message_user").hide();
                $(".notice_num").hide();
            }
        }
    })
})
// let that = this;
//尝试配置websocket,测试成功，可以连接
var websocket = null;

//判断当前浏览器是否支持WebSocket
if ('WebSocket' in window) {
    websocket = new WebSocket("ws://localhost:8080/websocket");
    console.log("websocket 已连接");
}
else {
    alert('当前浏览器 Not support websocket');
    console.log("websocket 无法连接");
}

//连接发生错误的回调方法
websocket.onerror = function () {
    setMessageInnerHTML("聊天室连接发生错误");
};

//连接成功建立的回调方法
websocket.onopen = function () {
    setMessageInnerHTML("聊天室连接成功");
}

//连接关闭的回调方法
websocket.onclose = function () {
    setMessageInnerHTML("聊天室连接关闭");
}

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function () {
    closeWebSocket();
}

websocket.onmessage = function(event) {
    setMessage(event.data);
    // setMessageInnerHTML(event.data);
};
function setMessage(data) {
   // alert(data);
    message_num = data;
    $(".notice_num").text(message_num);
    //判断message_num是否为0，控制导航栏红点显示
    if (message_num!=0){
        $(".message_user").show();
        $(".notice_num").show();
    } else {
        $(".message_user").hide();
        $(".notice_num").hide();
    }
}
//将消息显示在网页上
function setMessageInnerHTML(innerHTML) {
    // document.getElementById('message').innerHTML += innerHTML + '<br/>';
}

//关闭WebSocket连接
function closeWebSocket() {
    websocket.close();
}

//发送消息
function send_message() {
    // let message = document.getElementById('message_text').value;
    // console.log("message");
    websocket.send(message);
    // setMessageInnerHTML(message);
}
