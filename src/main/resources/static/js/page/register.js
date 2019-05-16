new Vue({
    el: '#app',
    data: function() {
        var validateEmail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Please enter email address'));
            } else {
                callback();
            }
        };
        var validateCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Please enter verification code'));
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Please enter password'));
            } else {
                if (this.ruleForm2.checkPass !== '') {
                    this.$refs.ruleForm2.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Please enter password again'));
            } else if (value !== this.ruleForm2.password) {
                callback(new Error('Password and Confirm Password are inconsistent!'));
            } else {
                callback();
            }
        };
        var validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Please enter your name'));
            } else {
                callback();
            }
        };
        var validateOrg = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error('Please enter your affiliation'));
            } else {
                callback();
            }
        };
        return {
            //navbar
            activeIndex: '7',
            //register form
            ruleForm2: {
                userName:'',
                email:'',
                // code:'1234',
                password: '',
                checkPass: '',
                name:'',
                orgs:[],
                org:''
            },
            rules2: {

                email:[
                    { validator: validateEmail, trigger: 'blur' }
                ],
                // code:[
                //     { validator: validateCode, trigger: 'blur' }
                // ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                org: [
                    { validator: validateOrg, trigger: 'blur' }
                ],

            },
            //org tag
            //dynamicTags: [],
            inputVisible: false,
            inputValue: ''
        }
    },
    methods: {


        //register form
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.register();
                } else {
                    this.$message({
                        showClose: true,
                        message: 'error submit!!',
                        type: 'error'
                    });
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        //org tag
        handleClose(tag) {
            this.ruleForm2.org.splice(this.ruleForm2.org.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.ruleForm2.org.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },

        register(){

            this.ruleForm2.userName=this.ruleForm2.email;

            $.ajax({
                url : '/user/add',
                type : 'post',
                // data对象中的属性名要和服务端控制器的参数名一致 login(name, password)
                data : this.ruleForm2,

                success : (result)=> {
                    if(result.data==1) {
                        this.$message({
                            showClose: true,
                            message: 'register successfully!',
                            type: 'success'
                        });
                        window.location.href = '/user/login'
                    }
                    else if(result.data==-1){
                        this.$message({
                            showClose: true,
                            message: 'Username has existed, please change your username',
                            type: 'error'
                        });
                    }
                    else if(result.data==-2){
                        this.$message({
                            showClose: true,
                            message: 'Email has existed, please change your Email',
                            type: 'error'
                        });

                    }
                },
                error : (e)=> {
                    this.$message({
                        showClose: true,
                        message: 'register error',
                        type: 'error'
                    });
                }
            });
        }
    }
})