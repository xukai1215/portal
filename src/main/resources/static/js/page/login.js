new Vue({
    el: '#app',
    data: function () {
        var validateAccount = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Please enter email address or username'));
            } else {
                callback();
            }
        };
        var validatePassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Please enter password'));
            } else {
                callback();
            }
        };

        return {
            //navbar
            activeIndex: '6',
            //register form
            ruleForm: {
                account: '',
                password: '',
                remember: false
            },
            rules: {
                account: [
                    {validator: validateAccount, trigger: 'blur'}
                ],
                password: [
                    {validator: validatePassword, trigger: 'blur'}
                ],

            },

            inputVisible: false,
            inputValue: '',

            reset:false,
        }
    },
    methods: {

        //register form
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.ruleForm.remember) {
                        localStorage.setItem('account', this.ruleForm.account);
                        localStorage.setItem('password', this.ruleForm.password);
                        localStorage.setItem('remember', "yes");
                    } else {
                        localStorage.removeItem('account');
                        localStorage.removeItem('password');
                        localStorage.setItem('remember', "no");
                    }
                    this.login();
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
        login() {
            this.ruleForm.password=hex_md5(this.ruleForm.password);
            $.ajax({
                url: '/user/in',
                type: 'post',
                // data对象中的属性名要和服务端控制器的参数名一致 login(name, password)
                data: this.ruleForm,
                // dataType : 'json',
                success: (result) => {
                    if (result == "1") {
                        this.$message({
                            showClose: true,
                            message: 'login successfully!',
                            type: 'success'
                        });
                        const href = window.location.href;
                        let history=window.sessionStorage.getItem('history');
                        if (href.indexOf("login") == -1) {
                            window.location.href = href;
                        }
                        else if(history!=undefined&&history!=''&&history.indexOf('login')==-1&&history.indexOf('register')==-1){
                            window.location.href=history;
                        }
                        else {
                            window.location.href = "/user/userSpace";
                        }
                        window.sessionStorage.setItem('history','');
                    }
                    else {
                        this.$message({
                            showClose: true,
                            message: 'login error',
                            type: 'error'
                        });
                    }
                },
                error: function (e) {
                    alert("Submit Error");
                }
            });
        },
        resetPassword() {
            this.reset=true;
            this.$prompt('Please enter your email:', 'Reset Password', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                inputErrorMessage: 'E-mail format is incorrect.'
            }).then(({ value }) => {
                let info=this.$notify.info({
                    title: 'Reseting password',
                    message: 'Please wait for a while, new password will be sent to your email.',
                    offset: 70,
                    duration: 0
                });
                $.ajax({
                    url: '/user/resetPassword',
                    type: 'post',
                    // data对象中的属性名要和服务端控制器的参数名一致 login(name, password)
                    data: {
                        email:value
                    },
                    // dataType : 'json',
                    success: (result) => {
                        info.close();
                        // this.reset=false;
                        if (result.data=="suc") {

                            this.$notify.success({
                                title: 'Success',
                                message: 'New password has been sent to your email. If you can not find the password, please check the spam box.',
                                offset: 70,
                                duration: 0
                            });

                        }
                        else if(result.data=="no user") {
                            this.$notify({
                                title: 'Fail',
                                message: 'Email does not exist, please check again or register a new account.',
                                offset: 70,
                                type: 'warning',
                                duration: 0
                            });
                        }
                        else{
                            this.$notify.error({
                                title: 'Fail',
                                message: 'Reset password failed, Please try again or contact nj_gis@163.com',
                                offset: 70,
                                duration: 0
                            });
                        }
                    },
                    error: function (e) {
                        alert("reset password error");
                    }
                });
            }).catch(() => {

            });
        }
    },
    mounted() {
        this.ruleForm.remember = false;
        const remember = localStorage.getItem('remember');
        if ((remember != undefined) && (remember === "yes")) {
            this.ruleForm.account = localStorage.getItem("account");
            this.ruleForm.password = localStorage.getItem("password");
            this.ruleForm.remember = true;
        }

        $(document).keydown((event)=> {
            if (!this.reset && event.keyCode == 13) {
                this.login();
            }
        });

    }
})