new Vue({
    el: "#app",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: {
        activeIndex: '8-1',
    }
});

new QRCode(document.getElementById("qrcode"), {
    text: window.location.href,
    width: 200,
    height: 200,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});