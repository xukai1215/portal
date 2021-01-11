var userDataSpace = Vue.extend(
    {
        template: "#userDataSpace",
        data(){
            return{
                //页面样式控制
                loading: 'false',
                load: true,
                ScreenMinHeight: "0px",
                ScreenMaxHeight: "0px",

                //显示控制
                curIndex:3,
                fileSpaceIndex:1,

                //data space变量
                myFile:[],

                myFileShown:[
                    {
                        children:[],
                    }
                ],

                uploadedFile:[],

                fatherIndex:'',

                pathShown:[],

                selectedPath:[],

                addFolderIndex: false,

                newFolderName:'',

                clickTimeout:1000,

                rightTargetItem:{},

                pasteTargetItem:{},

                renameIndex:'',

                uploadDialog:false,

                uploadInPath:0,

                fileSearchResult:[],

                fileNames:[],

                addOutputToMyDataVisible:false,

                outputToMyData:{},

                uploadDialogVisible:false,
                selectFolderVisible:false,
                uploadFileList:[],

                taskStatus:"all",

                dataChosenIndex:1,//data space显示选择

                searchContent: '',
                searchContentShown: '',
                databrowser: [],
                loading: 'false',
                managerloading: true,
                dataid: '',
                rightMenuShow: false,

                downloadDataSet: [],
                downloadDataSetName: [

                ],
                uploadDialogVisible: false,

                folderTree : [{
                    id: 1,
                    label: 'All Folder',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }],

                folderTree2 : [{
                    id: 1,
                    label: 'All Folder',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }],
                //

                userInfo:{

                },

                allFileTaskSharingVisible: false,
                taskSharingActive:0,
                taskDataList:[],
                stateFilters: [],
                multipleSelection: [],
                multipleSelectionMyData: [],
                taskCollapseActiveNames: [],
                taskDataForm: {
                    name: '',
                    type: "option1",
                    contentType: "resource",
                    description: "",
                    detail: "",
                    reference: "",
                    author: "",
                    keywords: [],
                    contributers: [],
                    classifications: [],
                    displays: [],
                    authorship: [],
                    comments: [],
                    dataList: [],

                    categoryText: [],

                    categoryTree: [],
                    ctegorys: [],

                    data_img: [],

                },

                packageContent:{},

                packageContentList: [],

                userTaskFullInfo: [],
                categoryTree: [],
                ctegorys: [],

                data_img: [],

                //uploadForm
                uploadName: "",
                selectLoading: false,
                options: [],
                selectValue: "",
                uploadFiles: [],
                uploadLoading: false,

                progressFlag:false,
                uploadProgress:0,

                fileContainerWidth:1200,
            }
        },
        computed:{
            fileCard(){
                if(this.fileContainerWidth<460){
                    return 8
                }else if(this.fileContainerWidth<757){
                    return 6
                }else {
                    return 4
                }
            },

        },
        methods:{
            //公共功能

            formatDate(value, callback) {
                const date = new Date(value);
                y = date.getFullYear();
                M = date.getMonth() + 1;
                d = date.getDate();
                H = date.getHours();
                m = date.getMinutes();
                s = date.getSeconds();
                if (M < 10) {
                    M = '0' + M;
                }
                if (d < 10) {
                    d = '0' + d;
                }
                if (H < 10) {
                    H = '0' + H;
                }
                if (m < 10) {
                    m = '0' + m;
                }
                if (s < 10) {
                    s = '0' + s;
                }

                const t = y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s;
                if (callback == null || callback == undefined)
                    return t;
                else
                    callback(t);
            },

            changeRter(index){
                this.curIndex = index;
                var urls={
                    1:'/user/userSpace',
                    2:'/user/userSpace/model',
                    3:'/user/userSpace/data',
                    4:'/user/userSpace/server',
                    5:'/user/userSpace/task',
                    6:'/user/userSpace/community',
                    7:'/user/userSpace/theme',
                    8:'/user/userSpace/account',
                    9:'/user/userSpace/feedback',
                }

                this.setSession('curIndex',index)
                window.location.href=urls[index]

            },

            setSession(name, value) {
                window.sessionStorage.setItem(name, value);
                // this.editOid = sessionStorage.getItem('editItemOid');
            },

            creatItem(index){
                window.sessionStorage.removeItem('editOid');
                if(index == 1) window.open('../userSpace/model/createModelItem')
            },

            manageItem(index){
                //此处跳转至统一页面，vue路由管理显示
                var urls={
                    1:'/user/userSpace/data/dataitem',
                    2:'/user/userSpace/data/myDataSpace',
                }
                window.sessionStorage.setItem('itemIndex',index)

                window.location.href=urls[index]

            },


            //data space相关
            getUserTaskInfo() {
                let {code, data, msg} = fetch("/user/getUserInfo", {
                    method: "GET",
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    this.userInfo = data.data.userInfo;
                    this.userTaskInfo = this.userInfo.runTask;
                    console.log(this.userInfo);
                    setTimeout(() => {
                        $('.el-loading-mask').css('display', 'none');
                    }, 120)

                });

            },

            selectPathClick(){
                if(1){
                    axios.get("/user/getFolder",{})
                        .then(res=> {
                            let json=res.data;
                            if(json.code==-1){
                                this.$alert("Please login first!")
                                window.sessionStorage.setItem("history", window.location.href);
                                window.location.href="/user/login"
                            }
                            else {
                                this.folderTree=res.data.data;
                                this.selectPathDialog=true;
                            }


                        });

                }
                else {
                    alert("Please select data first!")

                }
            },

            pushPathShown(file,eval){
                let flag
                if(file.id!='0')
                    this.pathShown.push(file)

                if(file.id==eval.id){
                    return 1
                }

                for(let i=0;i<file.children.length;i++){


                    flag=this.pushPathShown(file.children[i],eval)
                    if(flag==1)
                        return 1
                    this.pathShown.pop(this.pathShown.length-1)

                }

                return 0;

            },

            getPackageContent($event, eval,key){
                clearTimeout(this.clickTimeout)
                if(!eval.package) return;

                if(this.searchContentShown!=''){
                    this.pathShown=[]
                    let allFder={
                        id:'0',
                        label:'All Folder',
                        children:this.myFile
                    }
                    this.pushPathShown(allFder,eval)
                    this.searchContentShown=''
                }else {
                    this.pathShown.push(this.myFileShown[key])
                }

                if(eval.package===false)
                    return
                let id=eval.id;
                this.fatherIndex=this.myFileShown[key].id;

                if(this.myFileShown[key].children.length!=0)
                    this.myFileShown= this.myFileShown[key].children;
                else
                    this.myFileShown=[];

                this.renameIndex='';
                // console.log(this.myFileShown)
                // console.log(this.myFileShown.length)
                // console.log(this.fatherIndex)

            },

            getFilePackage(){
                this.managerloading = true
                axios.get("/user/getFolderAndFile",{})
                    .then(res=> {
                        let json=res.data;
                        if(json.code==-1){
                            this.$alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href="/user/login"
                        }
                        else {
                            this.myFile=res.data.data[0].children;
                            console.log(this.myFile)
                            this.myFileShown=this.myFile;
                            setTimeout(()=>{
                                this.managerloading = false
                            },55)
                        }


                    });
            },

            //回到上一层目录
            backToFather(){
                // if(this.myFileShown.length==0||this.fatherIndex!=0) {
                //     this.findFather(this.myFile)
                //     this.fatherIndex=this.myFileShown[0].father;
                //     console.log()
                // }else if(this.fatherIndex==0)
                //     this.myFileShown=this.myFile;

                if(this.searchContentShown!=''){
                    this.myFileShown=this.myFile
                    this.searchContentShown=''
                    this.pathShown=[]
                    return
                }

                let allFolder = [];
                allFolder.children=this.myFile;
                this.findFather(this.myFile,allFolder)
                console.log(this.myFileShown)
                this.fatherIndex=this.myFileShown[0].father;
                this.pathShown.pop(this.pathShown.length-1)
            },

            findFather(file,father){
                if(file){
                    if(this.fatherIndex==='0')
                        this.myFileShown=this.myFile;
                    for(let i=0;i<file.length;i++){
                        if(file[i].id===this.fatherIndex){
                            this.myFileShown=father.children;
                            console.log(this.myFileShown)
                            return;
                        }else{
                            this.findFather(file[i].children,file[i])
                        }
                    }
                }

            },


            // findFileFolder(file, fileId){//找到则返回那一层所有文件
            //
            //     if(fileList!=[]){
            //         for(let i=0;i<fileList.length;i++){
            //             if(fileList)
            //                 }
            //     }
            //
            //
            // },

            refreshPackage(index,pathList){
                this.searchContentShown = ''
                let paths = []
                if(index==1){//刷新所显示的文件
                    let i = this.pathShown.length - 1;
                    while (i >= 0) {
                        paths.push(this.pathShown[i].id);
                        i--;
                    }
                    if (paths.length==0) paths = ['0']

                }else{//指定路径刷新
                    let i=pathList.length-1;//selectPath中含有all folder这个不存在的文件夹，循环索引有所区别
                    while (i>=1) {
                        paths.push(pathList[i].key);
                        i--;
                    }
                    if (paths.length==0) paths=['0']

                    this.pathShown=[]
                    for(i=1;i<pathList.length;i++){
                        this.pathShown.push(pathList[i].data)
                    }
                }

                this.managerloading = true
                $.ajax({
                    type: "GET",
                    url: "/user/getFileByPath",
                    data: {
                        paths: paths,
                    },
                    async: true,
                    contentType: "application/x-www-form-urlencoded",
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href = "/user/login"
                        } else {
                            this.myFileShown = json.data.data;
                            if(this.myFileShown.length>0)
                                this.fatherIndex = this.myFileShown[0].father
                            this.refreshChild(this.myFile);

                            setTimeout(()=>{
                                this.managerloading = false
                            },125)
                        }
                    }

                })
            },

            refreshChild(file){
                console.log(this.fatherIndex)

                if (file)
                    if(this.fatherIndex==0){
                        this.myFile = this.myFileShown
                        return
                    }
                for (let i = 0; i < file.length; i++) {
                    if (file[i].id === this.fatherIndex) {
                        file[i].children = this.myFileShown
                        console.log(this.myFile)
                        return;
                    } else {
                        this.refreshChild(file[i].children)
                    }
                }
            },

            showFilePackage(){
                this.fileSpaceIndex=1
                this.pathShown=[];
                this.downloadDataSet=[];
                this.downloadDataSetName=[];
                this.getFilePackage()
            },

            showMyUpload(){
                this.fileSpaceIndex=2
            },

            showMyFork(){},

            addFolderInPath(){
                this.addFolderIndex=true;
                $('body').css('padding-right','0')
                console.log($('body').css('padding-right'))
            },

            addChild(fileTree,fatherId,child){
                for(let i=0;i<fileTree.length;i++){
                    if(fileTree[i].id===fatherId){
                        fileTree[i].children.push(child)
                        return;
                    }
                    this.addChild(fileTree[i].children,fatherId,child);
                }
            },

            addFolder() {
                let folderName=[];
                for(let i=0;i<this.myFileShown.length;i++){
                    if(this.myFileShown[i].package===true)
                        folderName.push(this.myFileShown[i].label)
                }

                if( this.newFolderName===''){
                    this.$alert('Please input the folder name.', 'Tip', {
                        type:'warning',
                        confirmButtonText: 'comfirm',
                    })
                    this.addFolderIndex=true;
                }
                else if(folderName.indexOf(this.newFolderName)!=-1){
                    this.$alert('This name is existing in this path, please input a new one.', 'Tip', {
                        type:'warning',
                        confirmButtonText: 'comfirm',
                    })
                    this.newFolderName='';
                    this.addFolderIndex=true;
                }
                else{
                    let i=this.pathShown.length-1;
                    let paths=[]
                    while (i>=0) {
                        paths.push(this.pathShown[i].id);
                        i--;
                    }
                    if(paths.length==0)paths=['0']
                    console.log(paths)
                    $.ajax({
                        type: "POST",
                        url: "/user/addFolder",
                        data: {paths: paths, name: this.newFolderName},
                        async: true,
                        contentType: "application/x-www-form-urlencoded",
                        success: (json) => {
                            if (json.code == -1) {
                                alert("Please login first!")
                                window.sessionStorage.setItem("history", window.location.href);
                                window.location.href = "/user/login"
                            } else {
                                const newChild = {id: json.data, label: this.newFolderName, children: [],package:true, father:paths[0]};
                                if(this.myFileShown.length===0)
                                    this.addChild(this.myFile,paths[0],newChild)
                                this.myFileShown.push(newChild);//myfileShown是一个指向myFile子元素的地址，修改则myFile也变化
                                // console.log(this.myFileShown)
                                // this.getFilePackage();
                                // console.log(this.myFile)
                                this.$alert('Add folder successfully')
                                this.newFolderName='';
                                this.addFolderIndex=false;

                            }

                        }
                    });
                }
            },

            addFolderinTree(pageIndex,index){
                var node,data
                if(pageIndex=='myData'){
                    data=this.$refs.folderTree.getCurrentNode();
                    if(data==undefined)
                        this.$alert('Please select a file directory.', 'Tip', {
                            type:'warning',
                            confirmButtonText: 'comfirm',
                        })
                    node=this.$refs.folderTree.getNode(data);
                }
                else{
                    data=this.$refs.folderTree2[index].getCurrentNode();
                    this.$alert('Please select a file directory.', 'Tip', {
                        type:'warning',
                        confirmButtonText: 'comfirm',
                    })
                    node=this.$refs.folderTree2[index].getNode(data);
                }

                let folderExited=data.children

                console.log(node);
                let paths=[];
                let pathList=[];

                while(node.key!=undefined&&node.key!=0){
                    //TODO
                    pathList.push({
                        key:node.key,
                        label:node.label,
                        data:node.data,
                    });
                    paths.push(node.key);
                    node=node.parent;
                }
                pathList.push({
                    key:'0',
                    label:'All folder'

                })
                if(paths.length==0) paths.push('0')
                console.log(paths)

                var newChild={id:""}

                this.$prompt(null, 'Enter Folder Name', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                    // inputErrorMessage: '邮箱格式不正确'
                }).then(({ value }) => {
                    if(folderExited.some((item)=>{
                        return  item.label===value;
                    })==true){
                        this.$alert('This name is existing in this path, please input a new one.', 'Tip', {
                            type:'warning',
                            confirmButtonText: 'comfirm',
                        })
                        return
                    }

                    $.ajax({
                        type: "POST",
                        url: "/user/addFolder",
                        data: {paths: paths, name: value},
                        async: false,
                        contentType: "application/x-www-form-urlencoded",
                        success: (json) => {
                            if (json.code == -1) {
                                alert("Please login first!")
                                window.sessionStorage.setItem("history", window.location.href);
                                window.location.href = "/user/login"
                            }
                            else {
                                newChild = {id: json.data, label: value, children: [], father: data.id ,package:true,suffix:'',upload:false, url:'',};
                                if (!data.children) {
                                    this.$set(data, 'children', []);
                                }
                                data.children.push(newChild);

                                if(this.myFileShown.length===0)
                                    this.addChild(this.myFile,paths[0],newChild)
                                // this.myFileShown.push(newChild);

                                this.refreshPackage(0,pathList.reverse());
                                setTimeout(()=>{
                                    this.$refs.folderTree.setCurrentKey(newChild.id)
                                },100)
                            }

                        }

                    });


                }).then(()=>{

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Cancel'
                    });
                });


            },

            sharingTaskData(task,index) {

                this.initTaskDataForm();

                this.taskSharingActive = 0;
                let inputs = task.inputs;
                let outputs = task.outputs;
                for (let input of inputs) {
                    input.type = "Input";
                    this.taskDataList.push(input);

                    let exist = false;
                    for (let filter of this.stateFilters) {
                        if (filter.value == input.statename) {
                            exist = true;
                        }
                    }

                    if (!exist) {
                        let obj = {};
                        obj.text = input.statename;
                        obj.value = input.statename;
                        this.stateFilters.push(obj);
                    }
                }
                for (let output of outputs) {
                    output.type = "Output";
                    this.taskDataList.push(output);

                    let exist = false;
                    for (let filter of this.stateFilters) {
                        if (filter.value == output.statename) {
                            exist = true;
                        }
                    }

                    if (!exist) {
                        let obj = {};
                        obj.text = output.statename;
                        obj.value = output.statename;
                        this.stateFilters.push(obj);
                    }
                }


                if (this.multipleSelection.length > 0) {
                    this.$nextTick(function () {
                        this.multipleSelection.forEach(row => {
                            console.log(this.$refs.multipleTableDataSharing)
                            this.$refs.multipleTableDataSharing[index].toggleRowSelection(row);
                        })
                    })
                }



            },

            publishTask(task){
                const h = this.$createElement;
                if(task.permission=='private'){
                    this.$msgbox({
                        title: ' ',
                        message: h('p', null, [
                            h('span', { style: 'font-size:15px' }, 'All of the users will have'),h('span',{style:'font-weight:600'},' permission '),h('span','to this task.'),
                            h('br'),
                            h('span', null, 'Are you sure to set the task'),
                            h('span', { style: 'color: #e6a23c;font-weight:600' }, ' public'),
                            h('span', null, '?'),
                        ]),
                        type:'warning',
                        showCancelButton: true,
                        confirmButtonText: 'confirm',
                        cancelButtonText: 'cancel',
                        beforeClose: (action, instance, done) => {
                            let href=window.location.href.split('/')
                            let ids=href[href.length-1]
                            let taskId=ids.split('&')[1]
                            if (action === 'confirm') {
                                instance.confirmButtonLoading = true;
                                // instance.confirmButtonText = '...';
                                setTimeout(() => {
                                    $.ajax({
                                        type: "POST",
                                        url: "/task/setPublic",
                                        data: {taskId: task.taskId},
                                        async: true,
                                        contentType: "application/x-www-form-urlencoded",
                                        success: (json) => {
                                            if (json.code == -1) {
                                                alert("Please login first!")
                                                window.sessionStorage.setItem("history", window.location.href);
                                                window.location.href = "/user/login"
                                            } else {
                                                // this.rightTargetItem=null;
                                                task.permission=json.data;
                                            }

                                        }
                                    });
                                    done();
                                    setTimeout(() => {
                                        instance.confirmButtonLoading = false;
                                    }, 100);
                                }, 100);
                            } else {
                                done();
                            }
                        }
                    }).then(action => {
                        this.rightMenuShow=false
                        this.$message({
                            type: 'success',
                            message: 'This task can be visited by public'
                        });
                    });
                }else{
                    this.$msgbox({
                        title: ' ',
                        message: h('p', null, [
                            h('span', { style: 'font-size:15px' }, 'Only you have'),h('span',{style:'font-weight:600'},' permission '),h('span','to this task.'),
                            h('br'),
                            h('span', null, 'Are you sure to'),
                            h('span', { style: 'color: #67c23a;font-weight:600' }, ' continue'),
                            h('span', null, '?'),
                        ]),
                        type:'warning',
                        showCancelButton: true,
                        confirmButtonText: 'confirm',
                        cancelButtonText: 'cancel',
                        beforeClose: (action, instance, done) => {
                            let href=window.location.href.split('/')
                            let ids=href[href.length-1]
                            let taskId=ids.split('&')[1]
                            if (action === 'confirm') {
                                instance.confirmButtonLoading = true;
                                // instance.confirmButtonText = '...';
                                setTimeout(() => {
                                    $.ajax({
                                        type: "POST",
                                        url: "/task/setPrivate",
                                        data: {taskId: task.taskId},
                                        async: true,
                                        contentType: "application/x-www-form-urlencoded",
                                        success: (json) => {
                                            if (json.code == -1) {
                                                alert("Please login first!")
                                                window.sessionStorage.setItem("history", window.location.href);
                                                window.location.href = "/user/login"
                                            } else {
                                                // this.rightTargetItem=null;
                                                task.permission=json.data;
                                            }

                                        }
                                    });
                                    done();
                                    setTimeout(() => {
                                        instance.confirmButtonLoading = false;
                                    }, 100);
                                }, 100);
                            } else {
                                done();
                            }
                        }
                    }).then(action => {
                        this.rightMenuShow=false
                        this.$message({
                            type: 'success',
                            message: 'This task has been set private'
                        });
                    });
                }


            },

            uploadFileInPath(){

            },

            uploadData() {
                return {
                    author: this.userName
                }
            },

            //显示鼠标hover的title
            showtitle(ev) {
                let suffix
                if(ev.package == true) suffix = 'package'
                else if (ev.suffix==='') suffix = 'unknown'
                else suffix = ev.suffix
                return ev.label + "\n" + "Type: " + suffix;
            },

            getImg(item) {
                let list=[]
                if(item.id==0||item.package==true)
                    return "/static/img/filebrowser/package.png"
                if(item.suffix=='unknow')
                    return "/static/img/filebrowser/unknow.svg"
                return "/static/img/filebrowser/" + item.suffix + ".svg"
            },
            generateId(key) {
                return key;
            },

            singleClick($event, eval) {
                if(this.rightMenuShow==true){
                    this.rightMenuShow=false;
                    return
                }


                clearTimeout(this.clickTimeout)
                var target=$event.currentTarget;
                var eval=eval;
                var that=this
                this.clickTimeout = setTimeout(function (){
                    that.getid(target, eval)
                },1)

                this.renameIndex='';


            },

            isSelected(list,item){
                for(let i=0;i < list.length;i++){
                    if(list[i].id===item.id)
                        return true
                }
                return false
            },

            //选中文件
            getid(target, eval){
                this.dataid = eval.id;
                console.log(eval)

                // target.className = "el-card dataitemisol clickdataitem"

                //再次点击取消选择
                if (this.isSelected(this.downloadDataSet,eval)) {
                    for (var i = 0; i < this.downloadDataSet.length; i++) {
                        if (this.downloadDataSet[i].id === eval.id) {
                            //删除
                            this.downloadDataSet.splice(i, 1)
                            this.downloadDataSetName.splice(i, 1)
                            break
                        }
                    }

                } else {
                    this.downloadDataSet.push(eval)
                    let obj={
                        name:eval.label,
                        suffix:eval.suffix,
                        package:eval.package,

                    }
                    this.downloadDataSetName.push(obj)
                }

                if (eval.taskId != null) {
                    this.detailsIndex = 2
                    this.getOneOfUserTasks(eval.taskId);
                }
            },

            getOneOfUserTasks(taskId) {
                $.ajax({
                    type: 'GET',
                    url: "/task/getTaskByTaskId",
                    // contentType:'application/json',

                    data:
                        {
                            id: taskId,
                        },
                    // JSON.stringify(obj),
                    cache: false,
                    async: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {

                        if (json.code != 0) {
                            alert("Please login first!");
                            window.location.href = "/user/login";
                        } else {
                            const data = json.data;
                            this.resourceLoad = false;
                            // this.researchItems = data.list;
                            this.packageContent = data;
                            console.log(this.packageContent)
                        }
                    }
                })
            },

            getSourceId(url){
                return url.split('=')[1]

            },

            userDownload() {
                //todo 依据数组downloadDataSet批量下载

                let sourceId = new Array()




                if (this.downloadDataSet.length > 0) {
                    let ids = []
                    for(let i=0;i<this.downloadDataSet.length;i++){
                        let urls = this.downloadDataSet[i].url.split("/")
                        ids.push(urls[urls.length-1])
                    }
                    let idstr = ids.toString();

                    let url = "http://221.226.60.2:8082/batchData?oids=" + idstr;
                    window.open(url)
                    // let link = document.createElement('a');
                    // link.style.display = 'none';
                    // link.href = url;
                    // // link.setAttribute(item.fileName,'filename.'+item.suffix)
                    //
                    // document.body.appendChild(link)
                    // link.click();

                } else {
                    alert("please select first!!")
                }


            },

            addAllData() {
                let that = this
                axios.get("/dataManager/list", {
                    params: {
                        author: this.userId,
                        type: "author"
                    }

                })
                    .then((res) => {


                        // console.log("oid datas",this.userId,res.data.data)
                        that.databrowser = res.data.data
                        that.alllen = that.databrowser.length
                        that.managerloading = false
                    })
            },

            addDataClass($event, item) {
                // this.rightMenuShow = false

                if (!this.isSelected(this.downloadDataSet,item)) {
                    $event.currentTarget.className = "el-card dataitemisol dataitemhover"
                }

                this.dataid = item.id


            },

            removeClass($event, item) {


                if (this.isSelected(this.downloadDataSet,item)) {
                    $event.currentTarget.className = "el-card dataitemisol clickdataitem"
                } else {
                    $event.currentTarget.className = "el-card dataitemisol"
                }


            },

            backToPackage() {
                this.detailsIndex = 1;
            },

            rightMenu(e,eval,index) {
                e.preventDefault();

                e.currentTarget.className = "el-card dataitemisol clickdataitem"


                var dom = document.getElementsByClassName("browsermenu");

                console.log(e)
                let width = document.documentElement.clientWidth;
                if(width>888){
                    dom[0].style.top = e.pageY- 240 + "px"
                    // 125 > window.innerHeight
                    //     ? `${window.innerHeight - 127}px` : `${e.pageY}px`;
                    dom[0].style.left = e.pageX - 310 + "px";
                }else if(width>599){
                    dom[0].style.top = e.pageY- 300 + "px"
                    dom[0].style.left = e.pageX - 65 + "px";
                }else{
                    dom[0].style.top = e.pageY- 300 + "px"
                    dom[0].style.left = e.pageX - 20 + "px";
                }

                this.rightMenuShow = true

                this.rightTargetItem=eval
                this.rightTargetItem.index=index;

            },


            right_download(){
                let url=this.rightTargetItem.url
                //下载接口
                if(url!=undefined) {
                    window.open( url);
                }
                else{
                    this.$message.error("No data can be downloaded.");
                }

                // window.location.href=url
                // this.rightMenuShow=false;
            },

            //删除数据容器中的记录
            delete_data_dataManager(id) {
                console.log(id)

                axios.delete("/dispatchRequest/delete", {
                    params: {
                        uid: id
                    }
                }).then((res) => {


                    // if (res.data.msg === "成功") {
                    //     //删除双向绑定的数组
                    //     tha.rightMenuShow = false
                    //     tha.databrowser = []
                    //     tha.addAllData()
                    //     // alert("delete successful")
                    //
                    // }

                })
            },

            //批量删除数据容器记录
            delete_batchData_dataManager(ids){
                axios.delete("/dispatchRequest/batchdelete", {
                    params: {
                        ids: ids
                    },
                    paramsSerializer: params => {
                        return qs.stringify(params, { indices: false })
                    }
                }).then((res) => {
                    if(res.code == 0){
                        // console.log('suc')
                    }
                    // if (res.data.msg === "成功") {

                    // }

                })
            },

            deleteAll(){
                const h = this.$createElement;

                this.$msgbox({
                    title: ' ',
                    message: h('p', null, [
                        h('span', { style: 'font-size:15px' }, 'All of the selected files will be deleted.'),
                        h('br'),
                        h('span', null, 'Are you sure to '),
                        h('span', { style: 'color: #e6a23c;font-weight:600' }, 'continue'),
                        h('span', null, '?'),
                    ]),
                    type:'warning',
                    showCancelButton: true,
                    confirmButtonText: 'confirm',
                    cancelButtonText: 'cancel',
                    beforeClose: (action, instance, done) => {

                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = 'deleting...';
                            setTimeout(() => {
                                $.ajax({
                                    type: "POST",
                                    url: "/user/deleteSomeFiles",
                                    data: JSON.stringify({deleteTarget:this.downloadDataSet}),
                                    async: true,
                                    contentType:"application/json",
                                    success: (json) => {
                                        let data = json.data;
                                        if (json.code == -1) {
                                            alert("Please login first!")
                                            window.sessionStorage.setItem("history", window.location.href);
                                            window.location.href = "/user/login"
                                        } else {
                                            for(let i=0;i<data.length;i++){

                                                this.deleteInfront(data[i],this.myFile)
                                            }
                                            let ids=[]
                                            for(let i=0;i<this.downloadDataSet.length;i++){
                                                let urls = this.downloadDataSet[i].url.split("/")
                                                ids.push(urls[urls.length-1])
                                            }
                                            this.delete_batchData_dataManager(ids)

                                            this.downloadDataSet=[];
                                            this.downloadDataSetName=[];
                                            // this.rightTargetItem=null;

                                        }

                                    }
                                });
                                done();
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 300);
                            }, 300);
                        } else {
                            done();
                        }
                    }
                }).then(action => {
                    this.rightMenuShow=false
                    this.$message({
                        type: 'success',
                        message: 'delete successful '
                    });
                });
            },

            deleteInfront(id,file){
                for(let i=file.length-1;i>=0;i--){
                    if(file[i].package==true)
                        this.deleteInfront(id,file[i].children)
                    else if(file[i].id==id){
                        file.splice(i,1)
                    }
                }
            },

            right_deleteFile(){
                const h = this.$createElement;
                if(this.rightTargetItem.package==false){
                    var sourceId=this.getSourceId(this.rightTargetItem.url)
                }

                this.$msgbox({
                    title: ' ',
                    message: h('p', null, [
                        h('span', { style: 'font-size:15px' }, 'All of the content will be deleted.'),
                        h('br'),
                        h('span', null, 'Are you sure to '),
                        h('span', { style: 'color: #e6a23c;font-weight:600' }, 'continue'),
                        h('span', null, '?'),
                    ]),
                    type:'warning',
                    showCancelButton: true,
                    confirmButtonText: 'confirm',
                    cancelButtonText: 'cancel',
                    beforeClose: (action, instance, done) => {

                        if (action === 'confirm') {

                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = 'deleting...';
                            setTimeout(() => {
                                $.ajax({
                                    type: "POST",
                                    url: "/user/deleteFile",
                                    data: {dataId: this.rightTargetItem.id},
                                    async: true,
                                    contentType: "application/x-www-form-urlencoded",
                                    success: (json) => {
                                        if (json.code == -1) {
                                            alert("Please login first!")
                                            window.sessionStorage.setItem("history", window.location.href);
                                            window.location.href = "/user/login"
                                        } else {
                                            this.myFileShown.splice(this.rightTargetItem.index, 1);
                                            // this.rightTargetItem=null;
                                            if(this.rightTargetItem.package==false)
                                                this.delete_data_dataManager(sourceId)
                                        }

                                    }
                                });
                                done();
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 300);
                            }, 300);
                        } else {
                            done();
                        }
                    }
                }).then(action => {
                    this.rightMenuShow=false
                    this.$message({
                        type: 'success',
                        message: 'delete successful '
                    });
                });

            },

            copyFile(){
                this.pasteTargetItem=this.rightTargetItem;
                this.rightMenuShow=false;

            },

            pasteFile(){
                this.uploadInPath=1
                this.addDataToPortalBack(this.pasteTargetItem)
                this.rightMenuShow=false;
            },

            myDataClick(index) {
                this.dataChosenIndex = index;
            },

            outputDataClick(index) {
                this.dataChosenIndex = index;
            },

            rename(){
                console.log(this.rightTargetItem)
                this.renameIndex=this.rightTargetItem.id;
                this.rightMenuShow = false
                console.log(this.rightTargetItem.label)
                console.log($('.renameFileInput').eq(this.rightTargetItem.index))
                $('.renameFileInput').eq(this.rightTargetItem.index).val(this.rightTargetItem.label);

            },

            arrayMatch(array,name){
                for(item in array){
                    if(item === name)
                        return 1
                }
                return 0
            },

            renameConfirm(){
                let fileName=[];
                for(let i=0;i<this.myFileShown.length;i++){
                    if(this.myFileShown[i].package===true)
                        fileName.push(this.myFileShown[i].label)
                    else
                        fileName.push(this.myFileShown[i].label+'.'+this.myFileShown[i].suffix)
                }
                let newName = $('.renameFileInput').eq(this.rightTargetItem.index).val()
                if(this.rightTargetItem.package!=true)
                    newName = newName+this.rightTargetItem.suffix
                if(fileName.indexOf(newName)!=-1)
                    this.$alert('This name is existing in this path, please input a new one.', 'Tip', {
                        type:'warning',
                        confirmButtonText: 'comfirm',
                    })
                else{
                    this.rightTargetItem.label=$('.renameFileInput').eq(this.rightTargetItem.index).val();
                    console.log(this.myFileShown)
                    this.updateFileToPortalBack();
                    this.renameIndex=''
                }

            },

            right_share(){
                let url=this.rightTargetItem.url;
                this.$alert("<input style='width: 100%' value=" + url + ">", {
                    dangerouslyUseHTMLString: true
                })
            },

            keywordsSearch() {
                if (this.searchContent === "") {
                    this.getFilePackage()
                    this.searchContentShown=this.searchContent
                } else {
                    axios.get('/user/keywordsSearch',{
                        params:{
                            keyword:this.searchContent
                        }
                    }).then((res)=>{
                        let json=res.data;
                        if(json.code==-1){
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href="/user/login"
                        }
                        else {
                            this.fileSearchResult=json.data.data;
                            this.myFileShown=this.fileSearchResult
                            this.searchContentShown=this.searchContent
                            // this.pathShown=[];
                        }
                    })

                }


            },

            handleSuccess(result,file,fileList){
                console.log(result)
                let uploadSource=[];
                uploadSource.push(result.data);
                this.upload_data_dataManager(uploadSource);
            },

            beforeAvatarUpload(event, file, fileList){
                let loadProgress = Math.floor(event.percent) //这就是当前上传的进度
                //可以进行其他逻辑
            },

            uploadRemove(file, fileList) {
                this.uploadFiles = fileList;
                if(this.uploadFiles.length==0)
                    this.uploadName = ''
            },

            uploadChange(file, fileList) {
                console.log(fileList)
                this.uploadFiles = fileList;
                let index=this.uploadFiles[0].name.lastIndexOf(".")
                if(this.uploadFiles.length==0)
                    this.uploadName = ''
                if(this.uploadName=='')
                    this.uploadName=this.uploadFiles[0].name.substring(0,index);
            },

            uploadClose() {
                this.$refs.upload.abort();
                this.uploadDialogVisible = false;
            },

            submitUpload() {
                if(this.uploadName==""){
                    this.$message.error('Please enter the dataset name!');
                    return;
                }
                if(this.selectValue==""){
                    this.$message.error('Please select a data template!');
                    return;
                }
                if (this.selectedPath.length == 0) {
                    this.$message.error('Please select a folder first!');
                    return;
                }
                if(this.uploadFiles.length==0){
                    this.$message.error('Please select files!');
                    return;
                }

                let formData = new FormData();

                // this.uploadLoading=true;
                let configContent = "<UDXZip><Name>";
                for(let index in this.uploadFiles){
                    configContent+="<add value='"+this.uploadFiles[index].name+"' />";
                    formData.append("ogmsdata", this.uploadFiles[index].raw);
                }
                configContent += "</Name>";
                if(this.selectValue!=null&&this.selectValue!="none"){
                    configContent+="<DataTemplate type='id'>";
                    configContent+=this.selectValue;
                    configContent+="</DataTemplate>"
                }
                else{
                    configContent+="<DataTemplate type='none'>";
                    configContent+="</DataTemplate>"
                }
                configContent+="</UDXZip>";
                // console.log(configContent)
                let configFile = new File([configContent], 'config.udxcfg', {
                    type: 'text/plain',
                });
                formData.append("ogmsdata", configFile);
                formData.append("name", this.uploadName);
                formData.append("userId", this.userInfo.userName);
                formData.append("serverNode", "china");
                formData.append("origination", "portal");

                // $.get("/dataManager/dataContainerIpAndPort", (result) => {
                //     let ipAndPort = result.data;

                let progress
                this.progressFlag=true
                this.uploadProgress = 0
                axios({
                    url: '/dispatchRequest/uploadMutiFiles',
                    method: 'post',
                    data: formData,
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: true,
                    timeout:321111,
                    onUploadProgress: (progressEvent) => {
                        this.uploadProgress = progressEvent.loaded / progressEvent.total * 100 | 0;  //百分比
                    }
                }).then((res)=> {
                    if(res.data.code==1){
                        let data=res.data.data;
                        if(this.uploadFiles.length==1){
                            let index=this.uploadFiles[0].name.lastIndexOf(".")
                            data.suffix=this.uploadFiles[0].name.substring(index+1,this.uploadFiles[0].name.length);
                        }
                        else{
                            data.suffix="zip";
                        }

                        data.file_name = this.uploadName
                        data.label=data.file_name;
                        data.file_name+="."+data.suffix;
                        data.upload=true;
                        data.templateId=this.selectValue;
                        this.addDataToPortalBack(data,this.selectValue);


                        //reset
                        this.uploadName="";
                        this.selectValue="";
                        // this.selectedPath=[];
                        this.uploadFiles=[];
                        if(this.uploadProgress==100){
                            this.progressFlag=false
                        }
                        this.uploadLoading=false;
                        // this.uploadDialogVisible=false;
                        this.remoteMethod("none");
                        this.$refs.upload.clearFiles();


                    }else{
                        this.$message.error('Upload failed!');
                    }


                    console.log(res);
                }).catch((res)=> {

                    this.uploadLoading=false;
                    this.$message.error('Upload failed!');
                });
                // });

            },

            progressA(event, file) {},

            remoteMethod(searchText) {//查找template

                this.selectLoading = true;
                let query = {
                    page: 0,
                    pageSize: 999,
                    asc: 1,
                    searchText: searchText
                };
                $.ajax({
                    type: "POST",
                    url: "/repository/searchTemplate",
                    data: JSON.stringify(query),
                    async: true,
                    contentType: "application/json",
                    success: (result) => {

                        this.options = [];
                        this.options.push({"name": "None", "oid": "none"})
                        for (let index in result.data.list) {
                            this.options.push(result.data.list[index]);
                        }

                        this.selectLoading = false;
                    }
                });
                // $.post("/repository/searchTemplate",JSON.stringify(query),(result)=>{
                //     this.selectLoading=false;
                //     this.option=result.list;
                // },"json")

            },

            uploadClick(index){
                this.uploadInPath=index;
                this.uploadSource=[];
                this.uploadName=''
                this.selectValue='none'
                this.progressFlag=false
                let allFder={
                    key:'0',
                    label:'All Folder'
                }
                this.selectedPath=[allFder];
                for(let i=0;i<this.pathShown.length;i++){
                    let obj={
                        key:this.pathShown[i].id,
                        label:this.pathShown[i].label,
                        data:this.pathShown[i]
                    }
                    this.selectedPath.push(obj)
                }

                this.uploadFileList=[];
                this.uploadLoading=false;
                setTimeout(()=>{
                        this.uploadDialogVisible=true;
                    },100

                )


            },

            uploadBeforeClose(){
                this.uploadDialogVisible=false;
                this.$refs.upload.clearFiles();
            },

            selectFolder(){
                this.selectFolderVisible=true;

                axios.get("/user/getFolder",{})
                    .then(res=> {
                        let json=res.data;
                        if(json.code==-1){
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href="/user/login"
                        }
                        else {
                            this.folderTree=res.data.data;
                            this.selectPathDialog=true;
                            this.$nextTick(()=>{
                                this.$refs.folderTree.setCurrentKey(null); //打开树之前先清空选择
                            })
                        }

                    });
            },

            confirmFolder(){
                this.selectedPath=[];
                let data=this.$refs.folderTree.getCurrentNode();
                let node=this.$refs.folderTree.getNode(data);

                while(node.key!=undefined&&node.key!=0){
                    this.selectedPath.unshift(node);
                    node=node.parent;
                }
                let allFder={
                    key:'0',
                    label:'All Folder'
                }
                this.selectedPath.unshift(allFder)
                console.log(this.selectedPath)
                this.selectPathDialog=false;
                this.selectFolderVisible=false;

            },

            closeSelectFolder(){
                this.selectFolderVisible=false;
            },

            selectFile(){
                if(this.selectedPath.length==0) {
                    alert('Please select a folder')
                    return;
                }
                $("#uploadFile").click()
            },

            close() {
                // $(".uploaddataitem").css("visibility","hidden");
                this.data_upload_id = '';
                $("#file-1").val('');
                this.sourceStoreId = ''
            },

            upload_data_dataManager(uploadSource) {
                console.log(this.fileNames)
                this.fileNames.filter(res=>typeof (res)!="undefined")
                console.log(uploadSource)
                console.log($('.file-caption').val())
                if (uploadSource.length == 0) {
                    alert("Please upload the file into the template first")
                } else {
                    for(let i=0;i<uploadSource.length;i++){
                        let dataName=uploadSource[i].file_name;
                        let dataname7suffix=dataName.split('.')
                        let fileName=dataname7suffix[0]
                        let suffix=dataname7suffix[1]
                        let dataId=uploadSource[i].source_store_id;
                        var data = {
                            author: this.userId,
                            fileName: fileName,
                            fromWhere: "PORTAL",
                            mdlId: "string",
                            sourceStoreId: dataId,
                            suffix: suffix,
                            tags: $("#managerFileTags").tagsinput('items'),
                            type: "OTHER"

                        }
                        var that = this;
                        var sucUpload
                        axios.post("/dispatchRequest/addRecordToDataContainer", data)
                            .then(res => {
                                if (res.status == 200) {

                                    that.addAllData()
                                    that.close()
                                    sucUpload=res.status
                                }
                            });
                    }
                    this.addDataToPortalBack(uploadSource);


                }

            },

            addDataToPortalBack(item,templateId){//item为undefined,则为用户上传；其他为页面已有数据的上传、修改路径

                var addItem=[]
                if(item instanceof Array) {
                    addItem=item;
                    // for(let i=0;i<addItem.length;i++)
                    //     addItem[i].file_name=this.splitFirst(addItem[i].file_name,'&')[1]
                }
                else{

                    addItem[0]=item
                    item.package = false
                }
                let paths=[]
                if(this.uploadInPath==1){
                    let i=this.pathShown.length-1;
                    while (i>=0) {
                        paths.push(this.pathShown[i].id);
                        i--;
                    }
                    if(paths.length==0)paths=['0']

                }else{
                    if(this.selectedPath.length==0) {
                        alert('Please select a folder')
                        return
                    }

                    let i=this.selectedPath.length-1;//selectPath中含有all folder这个不存在的文件夹，循环索引有所区别
                    while (i>=1) {
                        paths.push(this.selectedPath[i].key);
                        i--;
                    }
                    if(paths.length==0)paths=['0']
                }
                let that = this;

                let pathList = this.selectedPath

                $.ajax({
                    type: "POST",
                    url: "/user/addFile",
                    data: JSON.stringify({
                        files: addItem,
                        paths: paths
                    }),

                    async: true,
                    traditional:true,
                    contentType: "application/json",
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href = "/user/login"
                        } else {
                            let idList=json.data
                            console.log(idList)
                            if (item instanceof Array){
                                if (this.uploadInPath == 1) {
                                    for (let i = 0; i < item.length; i++) {
                                        console.log(item[i].file_name)
                                        let dataName7Suffix = item[i].file_name.split('.')

                                        let flag=false;
                                        for(let id in this.info.visualIds){
                                            if(id==templateId) flag=true;
                                        }

                                        const newChild = {
                                            id: idList[i].id,
                                            label: dataName7Suffix[0],
                                            suffix: dataName7Suffix[1],
                                            children: [],
                                            package: false,
                                            upload: true,
                                            father: paths[0],
                                            url: idList[i].url,
                                        };
                                        if (this.myFileShown.length === 0)
                                            this.addChild(this.myFile, paths[0], newChild)
                                        this.myFileShown.push(newChild);
                                        console.log(this.myFileShown)
                                        // this.getFilePackage();
                                        console.log(this.myFile)
                                    }
                                } else {
                                    setTimeout(()=>{
                                        this.refreshPackage(0,pathList)},300);
                                    //要写一个前台按路径查找的函数


                                }
                            }else{

                                if (this.myFileShown.length === 0)
                                    this.addChild(this.myFile, paths[0], item)
                                // this.myFileShown.push(item);
                                this.managerloading = true
                                setTimeout(()=>{
                                    this.refreshPackage(0,pathList)
                                    this.managerloading = false
                                },400);//pathList为所选的文件上传路径
                                // this.fatherIndex =
                            }

                            this.addFolderIndex = false;
                            //this.selectedPath=[];

                        }

                        this.addFolderIndex = false;
                        //this.selectedPath=[];


                        this.$message({
                            message: 'Upload successfully!',
                            type: 'success'
                        });
                        // this.selectedPath=[];
                        this.uploadName="";
                        this.selectValue="";
                        this.uploadFiles=[];
                        this.uploadLoading=false;
                        this.uploadDialogVisible=false;
                    }
                });

                // alert('Upload File successfully!')


            },

            updateFileToPortalBack(){ //更新已存储的文件属性
                $.ajax({
                    type: "POST",
                    url: "/user/updateFile",
                    data: {
                        dataName:this.rightTargetItem.label,
                        dataId:this.rightTargetItem.id,

                    },
                    async: true,
                    contentType: "application/x-www-form-urlencoded",
                    success: (json) => {
                        if (json.code == -1) {
                            alert("Please login first!")
                            window.sessionStorage.setItem("history", window.location.href);
                            window.location.href = "/user/login"
                        } else {
                            // const newChild = {id: json.data, label: dataName7Suffix[0],suffix:dataName7Suffix[1], children: [],package:false, father:paths[0]};
                            // if(this.myFileShown.length===0)
                            //     this.addChild(this.myFile,paths[0],newChild)
                            // this.myFileShown.push(newChild);
                            console.log(this.myFileShown)
                            // this.getFilePackage();
                            console.log(this.myFile)
                            this.addFolderIndex=false;

                        }

                    }
                });
            },

            //share as data item
            initTaskDataForm() {
                this.taskDataList = [];
                this.taskSharingActive = 0;
                this.stateFilters = [];
                this.taskCollapseActiveNames = [];

                this.taskDataForm = {
                    name: '',
                    type: "option1",
                    contentType: "resource",
                    description: "",
                    detail: "",
                    reference: "",
                    author: "",
                    keywords: [],
                    contributers: [],
                    classifications: [],
                    displays: [],
                    authorship: [],
                    comments: [],
                    dataList: [],

                    categoryText: [],
                };
                $(".taskDataCate").children().css("color", "black");

                if ($("#taskDataShareDialog .tag-editor").length != 0) {
                    $('#taskDataKeywords').tagEditor('destroy');
                }

                $("#taskDataKeywords").tagEditor({
                    initialTags: [''],
                    forceLowercase: false
                });

                tinyMCE.activeEditor.setContent("");
                $(".taskDataAuthorship").remove();
                $(".user-add").click();
            },

            checkSelectedFile(){
                this.checkSelectedIndex=1;
            },
            filterType(value, row) {
                return row.type === value;
            },
            filterState(value, row) {
                return row.statename === value;
            },

            getAllFiles(){
                this.uploadedFile=[]
                for(let i=0;i<this.myFile.length;i++){
                    if(!this.myFile[i].package){
                        this.uploadedFile.push(this.myFile[i])
                    }
                }
            },

            allFileShareAsDataItem() {
                // this.initTaskDataForm()
                this.getAllFiles()
                this.allFileTaskSharingVisible = true;
                this.multipleSelection=[];
                this.multipleSelectionMyData=[];
                this.taskSharingActive=0;
                if ($("#allFileShareDialog .tag-editor").length != 0) {
                    $('#taskDataKeywordsAll').tagEditor('destroy');
                }
                $("#taskDataKeywordsAll").tagEditor({
                    initialTags: [''],
                    forceLowercase: false
                });
                // this.getTasks();
            },

            taskSharingPre() {
                let len = $(".taskSharingStep").length;
                if (this.taskSharingActive != 0)
                    this.taskSharingActive--;
                // if(this.curIndex=='3-3'){
                //     $('.dataItemShare').eq(this.taskSharingActive).animate({marginLeft:0},200)
                //     $('.dataItemShare').eq(this.taskSharingActive+1).animate({marginleft:1500},200)
                // }
            },
            taskSharingFinish() {

                this.taskSharingActive = 4;
                var selectResult=[]
                selectResult=this.multipleSelectionMyData.concat(this.multipleSelection);

                console.log(selectResult)
                for (let select of selectResult) {
                    if(select.tag){
                        select.name = select.tag;
                        select.suffix = 'unknow';
                    }else{
                        select.name = select.fileName;
                        select.suffix =select.suffix;
                    }

                    this.taskDataForm.dataList.push(select);
                }

                this.taskDataForm.detail = tinyMCE.activeEditor.getContent();

                this.taskDataForm.keywords = $("#taskDataKeywordsAll").val().split(",");

                this.taskDataForm.author = this.userId;

                // this.dataItemAddDTO.meta.coordinateSystem = $("#coordinateSystem").val();
                // this.dataItemAddDTO.meta.geographicProjection = $("#geographicProjection").val();
                // this.dataItemAddDTO.meta.coordinateUnits = $("#coordinateUnits").val();
                // this.dataItemAddDTO.meta.boundingRectangle=[];

                let authorship = [];

                userspace.getUserData($("#providersPanelAll .user-contents .form-control"), authorship);

                this.taskDataForm.authorship = authorship;
                console.log(this.taskDataForm)

                axios.post("/dataItem/", this.taskDataForm)
                    .then(res => {
                        console.log(res);
                        if (res.status == 200) {

                            this.openConfirmBox("create successful! Do you want to view this Data Item?", "Message", res.data.data.id);
                            this.taskSharingVisible = false;
                            this.allFileTaskSharingVisible = false;
                        }
                    })
            },
            showWaring(text) {
                this.$message({
                    showClose: true,
                    message: text,
                    type: 'warning'
                });
            },
            taskSharingNext() {

                //检查
                switch (this.taskSharingActive) {
                    case 0:
                        if (this.multipleSelection.length+this.multipleSelectionMyData.length == 0) {
                            this.showWaring('Please select data first!');
                            return;
                        }
                        break;
                    case 1:
                        if (this.taskDataForm.classifications.length == 0) {
                            this.showWaring('Please choose categories from sidebar')
                            return;
                        }
                        if (this.taskDataForm.name.trim() == '') {
                            this.showWaring('Please enter name');
                            return;
                        }

                        if ($("#taskDataKeywordsAll").val().split(",")[0] == '') {
                            this.showWaring('Please enter keywords');
                            return;
                        }

                        if (this.taskDataForm.description == '') {
                            this.showWaring('Please enter overview');
                            return;
                        }
                        break;
                    case 2:
                        if (tinyMCE.activeEditor.getContent().trim() == '') {
                            this.showWaring('Please enter detailed description');
                            return;
                        }
                        break;

                }


                //翻页
                let len = $(".taskSharingStep").length;
                if (this.taskSharingActive < len)
                    this.taskSharingActive++;
                if (this.taskSharingActive == 1) {

                    if ($("#allFileShareDialog .tag-editor").length == 0) {
                        $("#taskDataKeywordsAll").tagEditor({
                            forceLowercase: false
                        })

                    }

                    tinymce.init({
                        selector: "textarea#taskDataDetailAll",
                        height: 205,
                        theme: 'silver',
                        plugins: ['link', 'table', 'image', 'media'],
                        image_title: true,
                        // enable automatic uploads of images represented by blob or data URIs
                        automatic_uploads: true,
                        // URL of our upload handler (for more details check: https://www.tinymce.com/docs/configure/file-image-upload/#images_upload_url)
                        // images_upload_url: 'postAcceptor.php',
                        // here we add custom filepicker only to Image dialog
                        file_picker_types: 'image',

                        file_picker_callback: function (cb, value, meta) {
                            var input = document.createElement('input');
                            input.setAttribute('type', 'file');
                            input.setAttribute('accept', 'image/*');
                            input.onchange = function () {
                                var file = input.files[0];

                                var reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = function () {
                                    var img = reader.result.toString();
                                    cb(img, {title: file.name});
                                }
                            };
                            input.click();
                        },
                        images_dataimg_filter: function (img) {
                            return img.hasAttribute('internal-blob');
                        }
                    });
                }

            },

            handleCloseandInit(done) {
                console.log(done)
                this.$confirm('Are you sure to close？')
                    .then(_ => {
                        for(let i=0;i<$('.treeLi').length;i++) {
                            $('.treeLi').eq(i).removeClass('expanded');
                            $('.flexLi').eq(i).animate({height: 0}, 300);
                        }
                        for(let i=0;i<$('.treeChildLi').length;i++){
                            $('.treeChildLi').eq(i).removeClass('expanded');
                            $('.packageContent').eq(i).animate({height:0},300);
                        }
                        for(let i=0;i<this.$refs.multipleTableDataSharing.length;i++)
                            this.$refs.multipleTableDataSharing[i].clearSelection();
                        this.$refs.multipleTableMyData.clearSelection();

                        done();
                    })
                    .catch(_ => {
                        done();
                    });
                // this.allFileTaskSharingVisible=false
            },

            closeAndClear(){

            },

            handleSelectionChange(val) {
                if(val)
                    this.multipleSelection=val
                console.log(this.multipleSelection)
            },

            handleSelectionChangeMyData(val) {
                if(val)
                    this.multipleSelectionMyData=val
                console.log(this.multipleSelectionMyData)
            },

            //加载下拉所需数据
            dataTreeClick(index) {

                for (let i = 0; i < $('.treeLi').length; i++) {
                    let arrow = $('.treeLi').eq(index - 1);
                    let targetLi = $('.flexLi').eq(index - 1);
                    let autoHeight1 = $('.el-table').eq(index - 1).height() + 23
                    let autoHeight2 = $('.filePackageList').height()
                    let autoHeight3 = $('.el-table').eq(this.userTaskFullInfo.tasks.length + 1).height() + 23

                    if ((i === index - 1) && !arrow.hasClass('expanded')) {
                        arrow.addClass('expanded');
                        if (index == 2) {
                            targetLi.animate({height: autoHeight2}, 320);
                            this.autoHeightFaOld = autoHeight2;
                        } else if (index == 1){
                            targetLi.animate({height: autoHeight1}, 320);
                        }
                        else {
                            targetLi.animate({height: autoHeight3}, 320);
                        }

                    } else {
                        $('.treeLi').eq(i).removeClass('expanded');
                        $('.flexLi').eq(i).animate({height: 0}, 300);
                    }
                }

            },

            getUserData(UsersInfo, prop) {

                for (i = prop.length; i > 0; i--) {
                    prop.pop();
                }
                var result = "{";
                for (index=0 ; index < UsersInfo.length; index++) {
                    //
                    if(index%4==0){
                        let value1 = UsersInfo.eq(index)[0].value.trim();
                        let value2 = UsersInfo.eq(index+1)[0].value.trim();
                        let value3 = UsersInfo.eq(index+2)[0].value.trim();
                        let value4 = UsersInfo.eq(index+3)[0].value.trim();
                        if(value1==''&&value2==''&&value3==''&&value4==''){
                            index+=4;
                            continue;
                        }
                    }

                    var Info = UsersInfo.eq(index)[0];
                    if (index % 4 == 3) {
                        if (result) {
                            result += "'" + Info.name + "':'" + Info.value + "'}"
                            prop.push(eval('(' + result + ')'));
                        }
                        result = "{";
                    }
                    else {
                        result += "'" + Info.name + "':'" + Info.value + "',";
                    }

                }
            },

            async dropPackageContent(item,index){

                let arrow=$('.treeChildLi').eq(index);
                let father=$('ul.flexLi')
                let autoHeightFaOld=this.autoHeightFaOld;
                let targetLi=$('.packageContent').eq(index);
                let autoHeight=(this.packageContentList[index].inputs.length+this.packageContentList[index].outputs.length)*57+79
                let autoHeightFa=autoHeight+autoHeightFaOld

                for(let i=0;i<this.userTaskFullInfo.tasks.length;i++){
                    if((i===index)){
                        if(!arrow.hasClass('expanded')){
                            arrow.addClass('expanded');
                            father.animate({height: autoHeightFa}, 260,'linear');
                            targetLi.animate({height: autoHeight}, 500,'linear');
                            this.sharingTaskData(item,index);

                        }else if(arrow.hasClass('expanded')){
                            father.animate({height:autoHeightFaOld},320)
                            $('.packageContent').eq(index).animate({height: 0}, 300);
                            $('.treeChildLi').eq(index).removeClass('expanded');
                        }
                    }
                    else {
                        $('.treeChildLi').eq(i).removeClass('expanded');
                        $('.packageContent').eq(i).animate({height:0},300);
                        // father.animate({height:autoHeightFaOld},320)
                    }

                }
            },

            test(item, index) {
                this.sharingTaskData(item);
                let arrow = $('.treeChildLi').eq(index);
                let father = $('ul.flexLi')
                let autoHeightFaOld = this.autoHeightFaOld;
                let targetLi = $('.packageContent').eq(index);
                let autoHeight = (this.packageContent.inputs.length + this.packageContent.outputs.length) * 57 + 82;
                let autoHeightFa = autoHeight + autoHeightFaOld;
                console.log(autoHeightFa)
                console.log(autoHeightFaOld)
                console.log(autoHeight)
                for (let i = 0; i < this.userTaskFullInfo.tasks.length; i++) {
                    if ((i === index)  ) {
                        if(!arrow.hasClass('expanded')){
                            arrow.addClass('expanded');
                            father.animate({height: autoHeightFa}, 260,'linear');
                            targetLi.animate({height: autoHeight}, 500,'linear');
                        }else if(arrow.hasClass('expanded')){
                            father.animate({height:autoHeightFaOld},320)
                            $('.packageContent').eq(index).animate({height: 0}, 300);
                            $('.treeChildLi').eq(index).removeClass('expanded');
                        }

                    } else {
                        $('.treeChildLi').eq(i).removeClass('expanded');
                        $('.packageContent').eq(i).animate({height: 0}, 300);
                        // father.animate({height:autoHeightFaOld},320)
                    }
                }
            },

            getTasks(callback) {
                $.ajax({
                    type: "Get",
                    url: "/task/getTasksByUserIdNoPage",
                    data: {

                        sortType: 'runTime',
                        asc: -1
                    },
                    cache: false,
                    async: true,

                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {

                        if (json.code != 0) {
                            alert("Please login first!");
                            window.location.href = "/user/login";
                        } else {
                            const data = json.data;
                            this.resourceLoad = false;
                            // this.researchItems = data.list;
                            this.userTaskFullInfo = data;

                            this.getAllPackageTasks();
                        }
                    }
                })
            },

            chooseTaskDataCate(item, e) {
                let exist = false;
                let cls = this.taskDataForm.classifications;
                for (i = 0; i < cls.length; i++) {
                    if (cls[i] == item.id) {
                        if (e.target.type == "button") {
                            e.target.children[0].style.color = "black";
                        } else {
                            e.target.style.color = 'black';
                        }

                        cls.splice(i, 1);
                        this.taskDataForm.categoryText.splice(i, 1);
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    if (e.target.type == "button") {
                        e.target.children[0].style.color = "deepskyblue";
                    } else {
                        e.target.style.color = 'deepskyblue';
                    }

                    if (!exist) {
                        if (e.target.type == "button") {
                            e.target.children[0].style.color = "deepskyblue";
                        } else {
                            e.target.style.color = 'deepskyblue';
                        }

                        this.taskDataForm.categoryText.push(e.target.innerText);
                        this.taskDataForm.classifications.push(item.id);
                    }

                }
            },

            getOneOfUserTasksToList(task,i) {
                $.ajax({
                    type: 'GET',
                    url: "/task/getTaskByTaskId",
                    // contentType:'application/json',

                    data:
                        {
                            id: task.taskId,
                        },
                    // JSON.stringify(obj),
                    cache: false,
                    async: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (json) => {

                        if (json.code != 0) {
                            alert("Please login first!");
                            window.location.href = "/user/login";
                        } else {
                            const data = json.data;
                            this.resourceLoad = false;
                            // this.researchItems = data.list;
                            this.packageContentList[i] = data;
                        }
                    }
                })
            },

            getAllPackageTasks(){
                for (let i=0;i<this.userTaskFullInfo.tasks.length;i++){
                    this.getOneOfUserTasksToList(this.userTaskFullInfo.tasks[i],i)
                }
                console.log(this.packageContentList)
            },

            openConfirmBox(content, title, id) {
                this.$confirm(content, title, {
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    type: 'success'//'warning'
                }).then(() => {
                    window.open("/dataItem/" + id);
                }).catch(() => {

                });
            },

            openAlertBox(content, title) {
                this.$alert(content, title, {
                    confirmButtonText: 'OK',
                    callback: action => {

                    }
                });
            },

            sendcurIndexToParent(){
                this.$emit('com-sendcurindex',this.curIndex)
            },

            sendUserToParent(userId){
                this.$emit('com-senduserinfo',userId)
            },

        },

        created() {
            this.getTasks();
        },

        mounted() {
            var vue_this=this

            //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
            this.sendcurIndexToParent()

            this.remoteMethod("");

            $(() => {
                let height = document.documentElement.clientHeight;
                this.ScreenMinHeight = (height) + "px";
                this.ScreenMaxHeight = (height) + "px";
                this.fileContainerWidth = document.getElementById('filePlate').offsetWidth
                window.onresize = () => {
                    console.log('come on ..');
                    height = document.documentElement.clientHeight;
                    this.ScreenMinHeight = (height) + "px";
                    this.ScreenMaxHeight = (height) + "px";

                    this.fileContainerWidth = document.getElementById('filePlate').offsetWidth
                };


                $.ajax({
                    type: "GET",
                    url: "/user/load",
                    data: {},
                    cache: false,
                    async: false,
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (data) => {

                        console.log(data);

                        if (data.oid == "") {
                            alert("Please login");
                            window.location.href = "/user/login";
                        } else {
                            this.userId = data.oid;
                            this.userName = data.name;
                            console.log(this.userId)
                            this.sendUserToParent(this.userId)
                            // this.addAllData()

                            // axios.get("/dataItem/amountofuserdata",{
                            //     params:{
                            //         userOid:this.userId
                            //     }
                            // }).then(res=>{
                            //     that.dcount=res.data
                            // });

                            $("#author").val(this.userName);

                            var index = window.sessionStorage.getItem("index");
                            if (index != null && index != undefined && index != "" && index != NaN) {
                                this.defaultActive = index;
                                this.handleSelect(index, null);
                                window.sessionStorage.removeItem("index");
                                this.curIndex=index

                            } else {
                                // this.changeRter(1);
                            }

                            window.sessionStorage.removeItem("tap");
                            //this.getTasksInfo();
                            this.load = false;
                        }
                    }
                })

                var that = this
                //获取data item分类树
                axios.get("/dataItem/createTree")
                    .then(res => {
                        that.tObj = res.data;
                        for (var e in that.tObj) {
                            var a = {
                                key: e,
                                value: that.tObj[e]
                            }
                            if (e != 'Data Resouces Hubs') {
                                that.categoryTree.push(a);
                            }


                        }

                    })

                //this.getModels();
            });


            $(function () {


                //数据项点击样式事件
                $(".filecontent .el-card").on('click', function (e) {

                    $(".filecontent .browsermenu").hide();

                    $(this).addClass("clickdataitem");


                    $(this).siblings().removeClass("clickdataitem");

                });

                //数据项右键菜单事件
                $(".filecontent .el-card").contextmenu(function (e) {

                    e.preventDefault();


                    $(".browsermenu").css({
                        "left": e.pageX,
                        "top": e.pageY
                    }).show();


                });

                //下载全部按钮为所有数据项添加样式事件
                $(".dall").click(function () {
                    $(".dataitemisol").addClass("clickdataitem")


                });

                //搜索结果样式效果和菜单事件
                $("#browsercont").on('click', function (e) {

                    $(".el-card.dataitemisol.is-never-shadow.sresult").click(function () {
                        $(this).addClass("clickdataitem");

                        $(this).siblings().removeClass("clickdataitem");

                    });


                    $(".el-card.dataitemisol.is-never-shadow.sresult").contextmenu(function () {

                        $(".browsermenu").css({
                            "left": e.pageX,
                            "top": e.pageY,
                        }).show();

                    })

                    //光标移入输入框隐藏数据项右键菜单
                    $("#searchinput").on("mouseenter", function () {
                        // $(".browsermenu").hide();
                    });
                });
                //
                // $('.fileTemplate').click((e) => {
                //     $('.wzhRightMenu').animate({height: '0'}, 50);
                //     if(vue.rightMenuShow==true)
                //         vue.rightMenuShow=false
                //     if(vue.renameIndex!='')
                //         vue.renameIndex=''
                //     console.log($('.fileTemplate').children().not('#browsercont'))
                //     console.log($('.fileTemplate').children())
                //     console.log($('.fileTemplate'))
                //     console.log(e.currentTarget)
                // })

                $('#filePlate').on('click',':not(.wzhMicroInput):not(#renameBtn>span)',function (e) {

                    e.stopPropagation();
                    if(vue_this.rightMenuShow==true)//vue组件命名为userDataSpace
                        vue_this.rightMenuShow=false
                    if(e.currentTarget.className.indexOf('renameContainer')==-1&&vue_this.renameIndex!=''&&e.currentTarget.id!=='renameBtn'){
                        console.log(e.currentTarget.className)
                        vue_this.renameIndex=''
                    }
                })

                $('.wzhMicroInput').click(
                    function(event){
                        event.stopPropagation();
                    }
                )


                var value = 0

                $("#refreshPackageBtn").click(
                    function () {
                        value += 180;
                        $('.fa-refresh').css('transform', 'rotate(' + value + 'deg)');
                    }
                );


                $('#backFatherBtn').click(
                    ()=>{
                        console.log('11')
                        $('.fa-arrow-left').animate({marginLeft:'-6px'},170)
                        $('.fa-arrow-left').animate({marginLeft:'0'},170)
                    }
                )
            })

            this.getFilePackage();
            this.getUserTaskInfo();

            tinymce.init({
                selector: "textarea#detail",
                height: 205,
                theme: 'silver',
                plugins: ['link', 'table', 'image', 'media'],
                image_title: true,
                // enable automatic uploads of images represented by blob or data URIs
                automatic_uploads: true,
                // URL of our upload handler (for more details check: https://www.tinymce.com/docs/configure/file-image-upload/#images_upload_url)
                // images_upload_url: 'postAcceptor.php',
                // here we add custom filepicker only to Image dialog
                file_picker_types: 'image',

                file_picker_callback: function (cb, value, meta) {
                    var input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.onchange = function () {
                        var file = input.files[0];

                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            var img = reader.result.toString();
                            cb(img, {title: file.name});
                        }
                    };
                    input.click();
                },
                images_dataimg_filter: function (img) {
                    return img.hasAttribute('internal-blob');
                }
            });

            var user_num = 0;

            //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
            this.sendcurIndexToParent()
        },

    }
)