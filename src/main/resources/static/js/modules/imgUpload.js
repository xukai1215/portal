Vue.component("img-upload",
    {
        template: '#imgUpload',
        props: {
            fileSize: {
                type: Number,
                default: 2048
            },
            sizeLimit: {
                type: Boolean,
                default: false
            }
        },
        data() {

            return {
                targetW:0,
                targetH:0,
                maxW:0,
                maxH:0,
                canvas:{},
                context:{},
                oImg:{},
                oldTarW:0,
                oldTarH:0,
                endX:0,
                endY:0,
                dragReady:false,
            }
        },
        computed: {},
        methods: {
            fileUpload(fileInput,size,callBack){
                //获取input file的files文件数组;
                //$('#filed')获取的是jQuery对象，.get(0)转为原生对象;
                //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
                var file = fileInput.files[0];
                let fileSize = (file.size / 1024).toFixed(0)
                if(this.sizeLimit&&fileSize>size){
                    alert('The upload file should be less than 1.5M')
                    return
                }
                callBack(file);
            },

            imgChangeClick(){
                this.imgChange();
            },

            imgChange(){
                var vthis = this;
                $("#imgFile").click()
                $("#imgFile").change(function () {
                    vthis.fileUpload(this,vthis.fileSize,vthis.drawCanvas)
                })
            },

            drawCanvas(file){
                //创建一个图像对象，用于接收读取的文件
                let vthis = this
                this.oImg=new Image();
                //创建用来读取此文件的对象
                var reader = new FileReader();
                //使用该对象读取file文件
                reader.readAsDataURL(file);
                //读取文件成功后执行的方法函数
                reader.onload = function (e) {
                    //读取成功后返回的一个参数e，整个的一个进度事件
                    //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                    //的base64编码格式的地址
                    // $('#imgShowBig').get(0).src = this.result;
                    vthis.oImg.src=vthis.result
                }
                this.targetW=0
                this.targetH=0
                //图像加载完成绘制canvas
                this.oImg.onload = ()=>{
                    vthis.canvas = document.createElement('canvas');
                    vthis.context = canvas.getContext('2d');

                    let originW = oImg.width;//图像初始宽度
                    let originH = oImg.height;

                    vthis.maxW=130
                    vthis.maxH=130
                    vthis.targetW=originW
                    vthis.targetH=originH

                    //设置canvas的宽、高
                    vthis.canvas.width=150
                    vthis.canvas.height=150

                    let positionX
                    let positionY
                    //判断图片是否超过限制  等比缩放
                    if(originW > vthis.maxW || originH > vthis.maxH) {
                        if(originH/originW < vthis.maxH/vthis.maxW) {//图片宽大于长
                            vthis.targetH = vthis.maxH;
                            vthis.targetW = Math.round(vthis.maxH * (originW / originH));
                            positionX=75-targetW/2+'px'
                            positionY='10px'
                            canvas.style.backgroundSize = "auto 130px "
                        }else {
                            vthis.targetW = vthis.maxW;
                            vthis.targetH = Math.round(vthis.maxW * (originH / originW));
                            positionX='10px'
                            positionY=75-targetH/2+'px'
                            console.log(positionY)
                            canvas.style.backgroundSize = "130px auto"

                        }
                    }

                    if(originW <= vthis.maxW || originH <= vthis.maxH) {
                        if(originH/originW < vthis.maxH/vthis.maxW) {//图片宽
                            vthis.targetH = maxH;
                            vthis.targetW = Math.round(vthis.maxH * (originW / originH));
                            positionX=75-targetW/2+'px'
                            positionY='10px'
                            canvas.style.backgroundSize = "auto 130px "
                        }else {
                            vthis.targetW = vthis.maxW;
                            vthis.targetH = Math.round(vthis.maxW * (originH / originW));
                            positionX='10px'
                            positionY=75-targetH/2+'px'
                            console.log(positionY)
                            canvas.style.backgroundSize = "130px auto"
                        }
                    }

                    this.oldTarW=targetW
                    this.oldTarH=targetH
                    //清除画布
                    this.context.clearRect(0,0,150,150);

                    let img="url("+oImg.src+")";
                    console.log(oImg.src===img)

                    canvas.style.backgroundPositionX = positionX
                    canvas.style.backgroundPositionY = positionY

                    this.endX=positionX
                    this.endY=positionY

                    // canvas.style.backgroundPositionY = positionY
                    canvas.style.backgroundImage = img
                    // var back= context.createPattern(oImg,"no-repeat")
                    // context.fillStyle=back;
                    // context.beginPath()
                    // if(originW>originH)
                    //     context.fillRect(0,10,targetW,targetH);
                    // else
                    //     context.fillRect(10,0,targetW,targetH);
                    // context.closePath()

                    // 利用drawImage将图片oImg按照目标宽、高绘制到画布上
                    // if(originW>originH)
                    //     context.drawImage(oImg,0,10,targetW,targetH);
                    // else
                    //     context.drawImage(oImg,10,0,targetW,targetH);

                    this.context.fillStyle = 'rgba(204,204,204,0.62)';
                    this.context.beginPath()
                    this.context.rect(0,0,150,150);
                    this.context.closePath()
                    this.context.fill()

                    this.context.globalCompositeOperation='destination-out'

                    this.context.fillStyle='yellow'
                    this.context.beginPath()
                    this.context.rect(10,10,130,130)
                    this.context.closePath()
                    this.context.fill();

                    this.canvas.toBlob(function (blob) {
                        console.log(blob);
                        //之后就可以对blob进行一系列操作
                    },file.type || 'image/png');
                    $('.circlePhotoFrame').eq(0).children('canvas').remove();
                    document.getElementsByClassName('circlePhotoFrame')[0].appendChild(canvas);
                    // $('.dragBar').eq(0).css('background-color','#cfe5fa')

                    this.dragReady=true

                    document.getElementsByClassName('dragBlock')[0].style.left = '-7px'//滚动条归位
                }
            },
        },
        created() {},
        mounted() {}
    }
)