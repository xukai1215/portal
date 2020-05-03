$(function() {
    $('.marquee').liMarquee({
        scrollamount: 65,
        drag: false,
    });
})

var vue = new Vue({
    el: "#app",
    data: {
        activeIndex:"1",
        userName: "",
        userId: "",
        loginFlag: false,
        findItem: [],
        timer:null,
    },

    mounted(){



        //照片无限滚动
        var oDiv = document.getElementById('div1');
        var oUl = oDiv.getElementsByTagName('ul')[0];
        var aLi = oUl.getElementsByTagName('li');
        var aA = oDiv.getElementsByTagName('a');
        var iSpeed = 1;//正左负右
        var timer = null;
        //计算ul的宽为所有li的宽的和;
        oUl.innerHTML += oUl.innerHTML+oUl.innerHTML;
        oUl.style.width = aLi[0].offsetWidth*aLi.length+'px';
        function Slider(){
            if (oUl.offsetLeft<-oUl.offsetWidth/2) {
                oUl.style.left = 0;
            }else if(oUl.offsetLeft>0){
                oUl.style.left =-oUl.offsetWidth/2+'px';
            }
            oUl.style.left = oUl.offsetLeft-iSpeed+'px';//正负为方向
        }
        timer =setInterval(Slider,12);
        aA[0].onclick = function(){
            iSpeed = 1; //控制速度的正负
        }
        aA[1].onclick = function(){
            iSpeed = -1;
        }
        oDiv.onmouseover = function(){
            clearInterval(timer);
        }
        oDiv.onmouseout = function(){
            timer =setInterval(Slider,12);
        }
    }
})