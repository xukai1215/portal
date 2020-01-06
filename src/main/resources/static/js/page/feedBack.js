
var feedback = Vue.extend(
    {
        template: "#feedback",
        data(){
            return{
                //页面样式控制
                loading: 'false',
                load: true,
                ScreenMinHeight: "0px",
                ScreenMaxHeight: "0px",

                //显示控制
                curIndex:9,

                //
                userInfo:{

                },


            }
        },

        methods:{
            //公共功能
            setSession(name, value) {
                window.sessionStorage.setItem(name, value);
                // this.editOid = sessionStorage.getItem('editItemOid');
            },

            send(){
                alert('send suggestion successfully!')
            },

            sendcurIndexToParent(){
                this.$emit('com-sendcurindex',this.curIndex)
            }

        },

        created() {
        },

        mounted() {
            setTimeout(()=>{
                this.load = false
            },180)

            $(() => {
                let height = document.documentElement.clientHeight;
                this.ScreenMinHeight = (height) + "px";
                this.ScreenMaxHeight = (height) + "px";

                window.onresize = () => {
                    console.log('come on ..');
                    height = document.documentElement.clientHeight;
                    this.ScreenMinHeight = (height) + "px";
                    this.ScreenMaxHeight = (height) + "px";
                };


            });

            //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
            this.sendcurIndexToParent()

        },

    }
)