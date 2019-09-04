

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

// 判断鼠标在元素上，返回元素ID
function getMouseClass(e){
    var mouseClass=e.target.getAttribute("class");
    // alert("click ad"+mouseClass);
    console.log(mouseClass);
    console.log(e.target);
    return mouseClass;
}

// 悬浮一级菜单
dropm1.onmouseover = function (e) {
    sub1.style.display = 'block';
    // communityArrow1.style.transform='rotate(315deg)';
    // communityArrow1.style.marginTop='10 px';
};
dropm1.onmouseout = function (e) {
    sub1.style.display = 'none';
    // communityArrow1.style.transform='rotate(135deg)';
};
// 悬浮下拉子菜单
submenu1.onmouseover = function (e) {
    sub1.style.display = 'block';
};
submenu1.onmouseout = function (e) {
    sub1.style.display = 'none';
    getMouseClass(e);
};

dropm2.onmouseover = function (e) {
    sub2.style.display = 'block';
};
dropm2.onmouseout = function (e) {
    sub2.style.display = 'none';
};
submenu2.onmouseover = function (e) {
    sub2.style.display = 'block';
};
submenu2.onmouseout = function (e) {
    sub2.style.display = 'none';
};


dropmls.onmouseover = function (e) {
    subls.style.display = 'block';
};
dropmls.onmouseout = function (e) {
    subls.style.display = 'none';
};
submenuls.onmouseover = function (e) {
    subls.style.display = 'block';
};
submenuls.onmouseout = function (e) {
    subls.style.display = 'none';
};

// 左侧菜单
dropmmu.onclick = function (e) {
    submu.style.display = 'block';
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
};
submenumu.onmouseover = function (e) {
    submu.style.display = 'block';
    // submu.ul.style.margin-top= '3 px';
};
submenumu.onmouseout = function (e) {
    //    setTimeout(function(){
    var a= getMouseClass(e);
    // },500);
    if(a!= 'show')
        submu.style.display = 'none';
};


leftdropmc.onmouseover =  (e) => {
    // clearTimeout(timer1);
    lsubc.style.display = 'block';
};
leftdropmc.onmouseout = function (e) {
    // if(getMouseClass(e)!=subsub)
    // {
    lsubc.style.display = 'none';
    // }
};
subleftc.onmouseover = function (e) {
    lsubc.style.display = 'block';
};
subleftc.onmouseout = function (e) {
    // var timer1=setTimeout(function(){lsubc.style.display = 'none'},1000)
    lsubc.style.display = 'none';
    //  submu.style.display = 'none';
    if(e&&e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }

};

leftdropmh.onmouseover =  (e) => {
    // clearTimeout(timer1);
    lsubh.style.display = 'block';
};
leftdropmh.onmouseout = function (e) {
    // if(getMouseClass(e)!=subsub)
    // {
    lsubh.style.display = 'none';
    // }
};
sublefth.onmouseover = function (e) {
    lsubh.style.display = 'block';
};
sublefth.onmouseout = function (e) {
    // var timer1=setTimeout(function(){lsubc.style.display = 'none'},1000)
    lsubh.style.display = 'none';
    //  submu.style.display = 'none';
    if(e&&e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }

};

//用户信息下拉
userLogedDrop.onmouseover = function (e) {
    subLoged.style.display = 'block';
};
userLogedDrop.onmouseout = function (e) {
    subLoged.style.display = 'none';
};
logedSub.onmouseover = function (e) {
    subLoged.style.display = 'block';
};
logedSub.onmouseout = function (e) {
    subLoged.style.display = 'none';
};

// 这两个函数似乎class.也是可以的

dropstrip.onclick = function (e) {
    if(fullsub.style.display === 'none')
    {
        fullsub.style.display = 'block';
    }else{
        fullsub.style.display = 'none';
    }
    if(phoneUserSub.style.display==='block')
    {
        phoneUserSub.style.display='none';
    }
    if(e&&e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
};

phoneUserDrop.onclick = function (e) {
    if(phoneUserSub.style.display === 'none')
    {
        phoneUserSub.style.display = 'block';
    }else{
        phoneUserSub.style.display = 'none';
    }
    if(fullsub.style.display==='block')
    {
        fullsub.style.display='none';
    }
    if(e&&e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
};


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
document.onclick = function (e) {
    submu.style.display = 'none';
    // fullsub.style.display = 'none';
    console.log(windowWidth);
};

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
            console.log('this'+this);
            if(i!=9&&i!=8){

                console.log('11');
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
            console.log(clickSubMenu);
            for (let i = 0; i < clickMenu.length; i++)
                if (i == 3)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');


        };
    }
    for(let i=5;i<8;i++) {

        clickSubMenu[i].onclick = function showHelpBorder() {
            console.log('567');
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
    console.log(hrefElement);
    console.log('123');
    switch (hrefElement) {
        case 'home':{
            for(let i=0;i<clickMenu.length;i++){
                if(i==0)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');
            }
            break;
        }


        case 'modelItem':{
            for(let i=0;i<clickMenu.length;i++){
                if(i==1)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');
            }
        break;
        }

        case 'dataItem':{
            for(let i=0;i<clickMenu.length;i++){
                if(i==2)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');
            }
            break;
        }

        case 'repository':{
            for(let i=0;i<clickMenu.length;i++){
                if(i==3)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');
            }
            break;
        }


        case 'help':{
            for(let i=0;i<clickMenu.length;i++){
                if(i==4)
                    clickMenu[i].classList.add('clickBlue');
                else
                    clickMenu[i].classList.remove('clickBlue');
            }
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