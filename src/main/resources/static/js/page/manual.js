var vue = new Vue({
    el: "#app",
    data: {
        activeIndex:'4-2',
        ScreenMinHeight : "0px"
    },
    methods: {

    },
    mounted() {
        let height = document.documentElement.clientHeight;
        this.ScreenMinHeight = (height - 64) + "px";

        window.onresize = () => {
            console.log('come on ..');
            height = document.documentElement.clientHeight;
            this.ScreenMinHeight = (height - 64) + "px";
        }

        window.onscroll = () => {
            let width = document.documentElement.clientWidth + 6;
            let offY = 60;
            if ((width > 766) && (width < 1001)) {
                offY = 90;
            }
        }
    }
})