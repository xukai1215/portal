var vue = new Vue({
    el:"#app",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data:function () {
        return {
            message_num_socket:0
        }
    },
    methods:{

        send_message(){
            let message = document.getElementById('message_text').value;
            console.log("message");
            this.websocket.send(message);
            // setMessageInnerHTML(message);
        }
    },
    mounted(){
        let that = this;
//尝试配置websocket,测试成功，可以连接
        let websocket = null;

//判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
            websocket = new WebSocket("ws://localhost:8080/websocket");
            console.log("websocket 已连接");
        }
        else {
            alert('当前浏览器 Not support websocket');
            console.log("websocket 无法连接");
        }

//连接发生错误的回调方法
        websocket.onerror = function () {
            setMessageInnerHTML("聊天室连接发生错误");
        };

//连接成功建立的回调方法
        websocket.onopen = function () {
            setMessageInnerHTML("聊天室连接成功");
        }

//连接关闭的回调方法
        websocket.onclose = function () {
            setMessageInnerHTML("聊天室连接关闭");
        }

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function () {
            closeWebSocket();
        }

        websocket.onmessage = function(event) {
            setMessage(event.data);
            // setMessageInnerHTML(event.data);
        };
        function setMessage(data) {
            setMessageInnerHTML(data);
        }
//将消息显示在网页上
        function setMessageInnerHTML(innerHTML) {
            document.getElementById('message').innerHTML += innerHTML + '<br/>';
        }

//关闭WebSocket连接
        function closeWebSocket() {
            websocket.close();
        }

//发送消息
        function send_message() {
            let message = document.getElementById('message_text').value;
            console.log("message");
            websocket.send(message);
            // setMessageInnerHTML(message);
        }
    }

    })

// //尝试配置websocket,测试成功，可以连接
// let websocket = null;
//
// //判断当前浏览器是否支持WebSocket
// if ('WebSocket' in window) {
//     websocket = new WebSocket("ws://localhost:8080/websocket");
//     console.log("websocket 已连接");
// }
// else {
//     alert('当前浏览器 Not support websocket');
//     console.log("websocket 无法连接");
// }
//
// //连接发生错误的回调方法
// websocket.onerror = function () {
//     setMessageInnerHTML("聊天室连接发生错误");
// };
//
// //连接成功建立的回调方法
// websocket.onopen = function () {
//     setMessageInnerHTML("聊天室连接成功");
// }
//
// //连接关闭的回调方法
// websocket.onclose = function () {
//     setMessageInnerHTML("聊天室连接关闭");
// }
//
// //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
// window.onbeforeunload = function () {
//     closeWebSocket();
// }
//
// websocket.onmessage = function(event) {
//     setMessage(event.data);
//     // setMessageInnerHTML(event.data);
// };
// function setMessage(data) {
//     setMessageInnerHTML(data);
//
// }
// //将消息显示在网页上
// function setMessageInnerHTML(innerHTML) {
//     document.getElementById('message').innerHTML += innerHTML + '<br/>';
// }
//
// //关闭WebSocket连接
// function closeWebSocket() {
//     websocket.close();
// }
//
// //发送消息
// function send_message() {
//     let message = document.getElementById('message_text').value;
//     console.log("message");
//     websocket.send(message);
//     // setMessageInnerHTML(message);
// }

// var message_num_socket;//用来接收服务器端数据
