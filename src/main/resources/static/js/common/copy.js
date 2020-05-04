$(function () {
    const btn = document.querySelector('#copy');
    btn.addEventListener('click',() => {
        const input = document.createElement('input');
        document.body.appendChild(input);
        const cite= $("#cite-text span").text()+$("#cite-text a").html();
        input.setAttribute('value', cite);
        input.select();
        if (document.execCommand('copy')) {
            new Vue().$message({
                showClose: true,
                message: 'Copy successfully!',
                type: 'success',
                offset: 100,
            });
        }
        document.body.removeChild(input);
    })
})