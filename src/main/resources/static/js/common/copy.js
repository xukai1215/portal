$(function () {
    const btn = document.querySelector('#copy');
    btn.addEventListener('click',() => {
        const input = document.createElement('input');
        document.body.appendChild(input);
        const cite= $("#cite-text span").text()+$("#cite-text a").html();
        input.setAttribute('value', cite);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            // this.$message({
            //     showClose: true,
            //     message: 'Copy successfully!',
            //     type: 'success'
            // });
            alert('Copy successfully!');
        }
        document.body.removeChild(input);
    })
})