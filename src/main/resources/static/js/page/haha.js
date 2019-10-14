new Vue({
    el: '#app',

    data:
        function () {
        return {
            isFixed:false,

        }

    },

    methods:{


    },

    mounted() {
        window.addEventListener('scroll',this.initHeight);

    },

    destory(){
        window.removeEventListener('scroll',this.initHeight);
    }

})