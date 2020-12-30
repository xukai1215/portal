new Vue({
    el: '#app',
    data: function() {
        var validateEmail = (rule, value, callback) => {
            let reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
            let flag = value.match(reg);
            // let reg1 = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            // if(flag == null){
            //     flag = value.match(reg1);
            // }
            if (value === '') {
                callback(new Error('Please enter email address'));
            } else if (flag==null){
                callback(new Error('Please enter the correct email address'));
            }else {
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
            } else if (value !== this.ruleForm2.pwd) {
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
                email:'',
                // code:'1234',
                pwd: '',
                checkPass: '',
                name:'',
                org:''
            },
            rules2: {

                email:[
                    { validator: validateEmail, trigger: 'blur' }
                ],
                // code:[
                //     { validator: validateCode, trigger: 'blur' }
                // ],
                pwd: [
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
                    this.$notify.error({
                        title: 'Error',
                        message: 'Please check your registration information.',
                        offset: 70
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

            let data = {
                "email": this.ruleForm2.email,
                "password": hex_sha256(hex_md5(this.ruleForm2.pwd)),
                "name": this.ruleForm2.name,
                "org": this.ruleForm2.org,
            };

            $.ajax({
                url : '/user/add',
                type : 'post',
                // data对象中的属性名要和服务端控制器的参数名一致 login(name, password)
                data : data,

                success : (result)=> {
                    if(result.data==1) {
                        this.$notify.success({
                            title: 'Success',
                            message: 'Register successful!',
                            offset: 70
                        });
                        window.location.href = '/user/login'
                    }
                    else if(result.data==-1){
                        this.$notify.error({
                            title: 'Error',
                            message: 'Email has existed, please change your Email',
                            offset: 70
                        });

                    }
                    else if(result.data==-2){
                        this.$notify.error({
                            title: 'Error',
                            message: 'Email has existed, please change your Email',
                            offset: 70
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