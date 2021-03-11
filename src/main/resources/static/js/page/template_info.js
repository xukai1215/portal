var template_info = new Vue({
    el: '#template_info',
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: function (){
        return{
            relatedDataMethods:[{

            }],
            templateId:'',
        }
    },
    methods:{
        getRelatedDataMethods(){
            let url = window.location.href;
            let index = url.lastIndexOf('/');
            this.templateId = url.slice(index+1, url.length);
            console.log(this.templateId);
            $.ajax({
                url:'/template/getRelatedDataMethods/' + this.templateId,
                type:'GET',
                success: (json)=>{
                    console.log(json.data);
                    if(json.data != null){
                        this.relatedDataMethods = JSON.parse(JSON.stringify(json.data));
                    }
                }
            })
        }
    },
    mounted(){
        this.getRelatedDataMethods();
    }
})