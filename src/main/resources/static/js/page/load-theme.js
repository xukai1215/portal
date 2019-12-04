var vue = new Vue({
    el:"#app",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data:function () {
        return{
            defaultActive:'1',
            dialogVisible: false
        }
    },
    methods:{

        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        handleCurrentChange(data, checked, indeterminate) {
            this.setUrl("/modelItem/repository?category="+data.oid);
            this.pageOption.searchResult=[];
            this.pageOption.total=0;
            this.pageOption.paginationShow=false;
            this.currentClass=data.label;
            let classes = [];
            classes.push(data.oid);
            this.classifications1 = classes;
            //this.getChildren(data.children)
            this.pageOption.currentPage=1;
            this.searchText="";
            this.getModels();
        },
        handleCheckChange(data, checked, indeterminate) {
            this.pageOption.searchResult=[];
            this.pageOption.paginationShow=false;
            let checkedNodes = this.$refs.tree2.getCheckedNodes()
            let classes = [];
            for (let i = 0; i < checkedNodes.length; i++) {
                classes.push(checkedNodes[i].oid);
            }
            this.classifications2 = classes;
            console.log(this.classifications2)
            this.pageOption.currentPage=1;
            this.getModels();
        },

    },

    mounted:{
    }
});

function show(id,container){
    $(".x_content").hide();
    $("#"+id).show();

    $(".infoPanel").hide();
    $("#"+container).show();

}



