var vue = new Vue({
    el: "#app",
    data: {
        activeIndex:'4-1',
        ScreenMinHeight: "0px",
        videoHeight: 400,
        videoWidth: 800
    },
    methods: {
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },
        downloadData() {
            var form = document.createElement("form");
            form.style.display = "none";

            form.setAttribute("target", "");
            form.setAttribute('method', 'get');
            form.setAttribute('action', "http://geomodeling.njnu.edu.cn/GeoModeling/DownloadDemoServlet");

            document.body.appendChild(form);  //将表单放置在web中
            //将查询参数控件提交到表单上
            form.submit();
            form.remove();
        }
    },
    mounted() {
        let height = document.documentElement.clientHeight;
        this.ScreenMinHeight = (height - 64) + "px";
        this.videoWidth = document.getElementsByClassName("info")[0].offsetWidth;
        this.videoHeight = this.videoWidth / 1.832;

        window.onresize = () => {
            console.log('come on ..');
            height = document.documentElement.clientHeight;
            this.ScreenMinHeight = (height - 64) + "px";
            this.videoWidth = document.getElementsByClassName("info")[0].offsetWidth;
            this.videoHeight = this.videoWidth / 1.832;
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