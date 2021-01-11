var vue = new Vue({
        el: "#app",
        data(){
            return{
                ScreenMinHeight: "0px",
                docIndex:0,

                docLoading:false,

                docTarget:'Model Resource',
            }
        },
        methods:{
            showDoc(index){
                window.location.href='/help/support/modelitem';
                // this.docIndex=index;
                // this.docLoading=true
                // $('html,body').animate({scrollTop: '130px'}, 200);
                // let obj={
                //     1:'Introduce to OpenGMS',
                //     2:'Model Resource',
                //     3:'Data Resource',
                //     4:'Service and Reuse',
                //     5:'Server Nodes',
                //     6:'Community',
                //     7:'Thematic Center',
                //     8:'User'
                // }
                // // this.docTarget=obj[index]
                // setTimeout(()=>{
                //     this.docTarget=obj[index]
                //     this.docLoading=false
                // },110)
            },
        },

        created(){
        },

        mounted(){
            let height = document.documentElement.clientHeight;
            this.ScreenMinHeight = (height - 400) + "px";

            window.onresize = () => {
                console.log('come on ..');
                height = document.documentElement.clientHeight;
                this.ScreenMinHeight = (height - 400) + "px";
            }
        },

    }
)