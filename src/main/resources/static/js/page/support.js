var vue = new Vue({
        el: "#app",
        data(){
            return{
                ScreenMinHeight: "0px",
                docIndex:1,

                docLoading:false,

                docTarget:'Model Resource',
            }
        },
        methods:{
            showDoc(index){
                this.docIndex=index;
                this.docLoading=true
                $('html,body').animate({scrollTop: '130px'}, 200);
                let obj={
                    1:'Model Resource',
                    2:'Data Resource',
                    3:'Model Application',
                    4:'Task',
                    5:'Community',
                    6:'User Space',
                }
                // this.docTarget=obj[index]
                setTimeout(()=>{
                    this.docTarget=obj[index]
                    this.docLoading=false
                },110)
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