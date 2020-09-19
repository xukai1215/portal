var vue = new Vue({
        el: "#app",
        data() {
            return {
                ScreenMinHeight: "0px",
                ScreenWidth:1,

                sectionTitleSpan:7,
                sectionSpan:17,


                sectionData: [
                    {
                        label: 'section1',
                        children: [
                            {
                                label: 'section1.1',
                            }
                        ]
                    },
                    {
                        label: 'section2',
                        children: [
                            {
                                label: 'section2.1',
                                children: [
                                    {
                                        label: 'section2.1.1',
                                    }
                                ],
                            }

                        ]
                    }
                ],

                supportDoc: [
                    {
                        title: 'section1',
                        content: '首先，让我们来进入个人空间，了解相关的功能。\n' +
                            '在个人空间中，您可以上传管理您的模型、数据、社区资源，上传管理您的模型运行相关文件，发布您的服务，查看您在OpenGMS平台所运行的所有任务。同时也可以管理您的账号，处理各种各样的提示信息。当然，您有关于OpenGMS平台的意见或建议也可以在这里发送。与个人页面不同，个人空间是每个用户的个人专属页面，其他用户无法查看。\n' +
                            '登陆您的账号之后，将鼠标浮动至主页导航栏右侧的用户控制区（如果还未拥有OpenGMS账号，请点击此处了解如何创建您的账号），在自动弹出的下拉选项中可以看到My Space与My Page两个选项，我们先点击My Space进入到个人空间。\n',
                    },
                    {
                        title: 'section1.1',
                        content: '进入到个人空间页面后，我们可以看到个人空间的Home页面。',
                    },
                    {
                        title: 'section2',
                        content: '1：这里是OpenGMS的Logo，点击此处可以跳转到OpenGMS门户的首页。\n' +
                            '2：这里是个人空间的侧边控制栏，点击您想要进入的子模块标签，即可进入所选子模块使用相关功能。\n' +
                            '3：这里展示了您的用户信息以及相关的消息，点击消息按钮“ ”可以快速进入消息管理。\n' +
                            '4：这里是用户其他功能区，点击可以呼出个人页面跳转按钮和退出登录按钮。\n'+'5:当前所在模块提示，包含了当前所在（子）模块的名称以及简要功能提示。\n' +
                            '6:在当前模块中，这里展示了常用功能快速访问卡片，点击蓝色箭头按钮（红色方框中）\n'
                    },
                    {
                        title: 'section2.1',
                        content: '模型是OpenGMS的核心之一，在个人空间Model子模块里，您可以创建、管理您的模型。\n' +
                            '点击侧边控制栏中的Model，或者在个人空间Home页面中使用Model快速访问卡片，即可进入Model子模块。\n'
                    },
                    {
                        title: 'section2.1.1',
                        content: '首先，我们点击Model Items卡片中的“manage”按钮，进入到Model模块下的Model Item子模块。'
                    }
                ],

                isHelpful:'',

                commentSended:false,

                timeout1:'',
            }
        },

        watch:{
            $router:{
                handler:function f(to,from) {

                }
            },
            ScreenWidth:{
                handler:function(val){
                    if(val<505){
                        this.sectionTitleSpan=24
                        this.sectionSpan=24
                    }else{
                        this.sectionTitleSpan=7
                        this.sectionSpan=17
                    }
                }
            }
        },
        methods:{
            anchorClick(data){
                window.location.href='#d_'+data.label
                this.scrollToAnchor()
            },

            scrollToAnchor(){
                var hash = this.getHash(), // 获取url的hash值
                    anchor = this.getAnchor(hash), // 获取伪锚点的id
                    anchorDom, // 伪锚点dom对象
                    anchorScrollTop; // 伪锚点距离页面顶部的距离

                // 如果不存在伪锚点,则直接结束
                if(anchor.length < 1){
                    return;
                }

                anchorDom = this.getDom(anchor);
                anchorScrollTop = anchorDom.offsetTop+200;//加上navbar的高度

                this.animationToAnchor(document.body.scrollTop, anchorScrollTop);
            },

            /*
        	@function 滚动到指定位置方法
        	@param startNum {int} -- 开始位置
        	@param stopNum {int} -- 结束位置
            */
            animationToAnchor(startNum, stopNum) {
                // var nowNum = startNum + 80; // 步进为80，缓移动
                //
                // if (nowNum > stopNum) {
                //     nowNum = stopNum;
                // }
                //
                // // 缓动方法
                // window.requestAnimationFrame(function () {
                //     window.scrollTo(0, nowNum, 'smooth'); // 当前示例页面，滚动条在body，所以滚动body
                //
                //     // 滚动到预定位置则结束
                //     if (nowNum == stopNum) {
                //         return;
                //     }
                //
                //     vue.animationToAnchor(nowNum, stopNum); // 只要还符合缓动条件，则递归调用
                // });
                $('html,body').animate({scrollTop: stopNum+'px'}, 200);
            },

            // 获取锚点id
            getAnchor(str) {
                return this.checkAnchor(str) ? str.split("d_")[1] : "";
            },

            // 通过命名找到对应的锚点
            checkAnchor(str) {
                return str.indexOf("d_") == 0 ? true : false;
            },

            // 获取hash值
            getHash() {
                return window.location.hash.substring(1);
            },

            // 获取dom对象
            getDom(id) {
                return document.getElementById(id);
            },

            sendComment(){
                if(this.isHelpful==1){
                    const loading = this.$loading({
                        target:this.$refs.commentCard,
                        lock: true,
                        spinner: 'el-icon-loading',
                        background: 'rgba(255, 255, 255, 0.7)'
                    })
                    const loading2 = this.$loading({
                        target:this.$refs.fullCommentCard,
                        lock: true,
                        spinner: 'el-icon-loading',
                        background: 'rgba(255, 255, 255, 0.7)'
                    })
                    setTimeout(() => {
                        loading.close();
                        loading2.close();
                        this.commentSended=true
                    }, 500);
                }else{
                    const loading = this.$loading({
                        target:this.$refs.commentCard,
                        lock: true,
                        spinner: 'el-icon-loading',
                        background: 'rgba(255, 255, 255, 0.7)'
                    })
                    const loading2 = this.$loading({
                        target:this.$refs.fullCommentCard,
                        lock: true,
                        spinner: 'el-icon-loading',
                        background: 'rgba(255, 255, 255, 0.7)'
                    })
                    setTimeout(() => {
                        loading.close();
                        loading2.close();
                        this.commentSended=true
                    }, 500);
                }

            },

            unfoldSide(){
                clearTimeout(this.timeout1)
                $('.floatBlock').animate({width:213.8},320,'swing',{ queue: false })
            },

            foldSide(){
                if(true){
                    this.timeout1=setTimeout(()=>{
                        $('.floatBlock').animate({width:0},320,'swing',{ queue: false })
                    },821)
                }
            },
        },
        created(){

        },
        mounted(){
            var vthis=this
            let height = document.documentElement.clientHeight;
            this.ScreenMinHeight = (height - 400) + "px";
            this.ScreenWidth = document.documentElement.clientWidth;
            window.addEventListener("resize", () => {
                return (() => {
                    console.log('come on ..');
                    let height = document.documentElement.clientHeight;
                    let width = document.documentElement.clientWidth;
                    this.ScreenMinHeight = (height - 400) + "px";
                    this.ScreenWidth = width;
                })()
            })

            // window.onhashchange=()=>{
            //     this.scrollToAnchor()
            // }

            $(window).scroll(()=>{
                var s = $(window).scrollTop();
                var w=$(window).width() + 13
                if(w>505){
                    if( $('#app').height()-document.documentElement.clientHeight -s < 280){
                        $(".floatBlock").fadeIn(500);
                    }else{
                        $(".floatBlock").fadeOut(500);
                    };
                }

            })
        },

    }
)