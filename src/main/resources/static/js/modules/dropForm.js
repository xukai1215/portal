Vue.component("drop-form",
    {
        template: '#dropForm',
        props: {
            placeholder: {
                type: String,
                default: ''
            },

            value: {default: ""},

            form:{
                type:Array,
                default: ()=>[]
            },
        },
        data() {
            return {
                c_placeHolder: '',

                isDrop:false,
            }
        },
        computed: {},
        methods: {
            initDom(){
                let classList=''
                // console.log(this.$refs.refPrep)
                // if(this.$slots.postPendant||this.$slots.prePendant)
                //     classList+=' wzhInput_group';
                // if(this.$slots.prePendant){
                //     classList+=' wzhInput_prep';
                //     // let offw = this.$refs.refPrep.offsetWidth
                //     if(this.$slots.innerIconPre){
                //         this.$refs.refIconPre.style.transform = `translateX(${offw-2}px)`
                //     }
                //
                // }
                // if(this.$slots.postPendant){
                //     classList+=' wzhInput_post';
                //     // let offw = this.$refs.refPost.offsetWidth
                //     if(this.$slots.innerIconPost){
                //         this.$refs.refIconPost.style.transform = `translateX(-${offw+2}px)`
                //     }
                //
                // }
                // if(this.$slots.innerIconPre){
                //     let offw = this.$refs.refIconPre.offsetWidth
                //     this.$refs.refInnerInput.style.paddingLeft = `${offw+1}px`
                // }
                // if(this.$slots.innerIconPost){
                //     let offw = this.$refs.refIconPost.offsetWidth
                //     this.$refs.refInnerInput.style.paddingRight = `${offw+1}px`
                // }

                // this.$refs.refWzhInput.className+=classList;
            },

            dropDownInfo(e) {
                if(!this.isDrop){
                    this.expandDown()

                }else{
                    this.foldUp()
                }


            },

            input(){
                this.$emit('input',this.value)
            },

            selectValue(formValue){
                this.value = formValue
                this.foldUp()

            },

            expandDown(){
                this.$refs.refIconPost.classList.remove("transform0");
                this.$refs.refIconPost.classList.add("transform180");

                this.isDrop = true
            },

            foldUp(){
                this.$refs.refIconPost.classList.remove("transform180");
                this.$refs.refIconPost.classList.add("transform0");
                this.isDrop = false
            },

            readyDrop(el){
                el.style.height = 0
            },

            droping(el, done){
                let height = this.form.length*37 + 20

                el.offsetWidth//动画效果

                el.style.height = height.toString() + 'px'

                // el.style.transition = 'height 0.15s ease-out;'

                done()
            },

            folding(el){
                let height = 0

                el.offsetWidth//动画效果

                el.style.height = height + 'px'

                // this.isDrop = false
                // el.style.transition = 'height 0.15s ease-out;'

            },

        },
        created() {},
        mounted() {
            this.c_placeHolder = this.placeholder;

            this.$nextTick(
                ()=>{
                    this.initDom();
                }
            )
        }
    }
)