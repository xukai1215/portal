var data_application = new Vue({
    el:"#data_application",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: function () {
        return {
            activeName: 'first',
            dialogVisible: false,
            mappingActive: 0,
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        handleClose(done) {
            this.$confirm('Confirm to close?')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        editThemePre() {
            let len = $(".editThemeStep").length;
            if (this.mappingActive != 0)
                this.mappingActive--;
        },
        editThemeNext() {

        },
        editThemeFinish() {

        },
    }
    ,
    mounted(){

    }
});