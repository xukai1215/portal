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
            items: [],
            setItems: [],
            currPage: 1,
            UDXRadio: '1',
            selectedFiles: [],
            fileList:[],
            templateName: ""
        }
    },
    methods: {
        initDataApplication(){

        },

        handleClick(tab, event) {

        },

        handleClose(done) {
            this.$confirm('Confirm to close?')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },

        editThemePre () {
            if (this.mappingActive-- <= 0) this.mappingActive = 0
        },

        editThemeNext () {
            if (this.mappingActive++ >= 2) this.mappingActive = 2
        },

        editThemeFinish () {

        },

        loadDataItems () {
            _this = this
            $.ajax({
                type:"get",
                url:"/template/all",
                dataType: '',
                success: function (data) {
                _this.items = data.data
            }
            })
        },

        addItem (e) {
            let judge = 1
            for (let i = 0; i < this.setItems.length; i++) {
                if (e.name === this.setItems[i].name)
                    judge = 0
            }
            if (judge) {
                this.setItems.push(e)
            }
        },

        deleItem (e) {
            this.setItems.splice(e.$index, 1)
        },

        getMappingData () {
            console.log("获取数据")
        },

        handleCurrentChange (val) {
            this.currPage = val
        },

        searchTemplateClick () {
            _this = this
            if(_this.templateName === "")
                _this.loadDataItems()
            $.ajax({
                type:"get",
                url:"/template/" + _this.templateName,
                dataType:'',
                success:function (data) {
                    _this.items = data.data
                }
            })
        },

        submitUpload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {

        },
        handlePreview(file) {

        },
        uploadFilesSuccess(response, file, fileList) {
            this.selectedFiles.push({name:file.name})
        },
        deleFile(e){
            _this = this;
            $.ajax({
                type:"post",
                url:"/template/" + e.row.name,
                dataType:'',
                success:function(){
                    _this.selectedFiles.splice(e.$index, 1)
                }
            })
        }
    }
    ,
    mounted(){
            this.loadDataItems()
    }
});
