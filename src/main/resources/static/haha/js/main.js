// var vue = new Vue({
//     el: "#app_id",
//     data: {
//         eventChoosing: {
//
//         },
//         userInfo: {
//
//         },
//         modelInfo: {
//
//         },
//         showUpload: false,
//         uploadData: {
//             host: "172.21.212.155",
//             port: "8062",
//             type: "1",
//             userName: "Sun_libber"
//         }
//     },
//     computed: {
//         activeTab: {
//             get() {
//                 return this.modelInfo.states ?
//                     this.modelInfo.states[0].name :
//                     "defaultState";
//             },
//             set() {}
//         },
//     },
//     methods: {
//
//         init() {},
//         inEventList(state) {
//             return state.events.filter(value => {
//                 return value.type === "in";
//             });
//         },
//         outEventList(state) {
//             return state.events.filter(value => {
//                 return value.type === "out";
//             });
//         },
//         async loadTest(type) {
//             let {
//                 data
//             } = await fetch("//");
//
//             data = [{
//                 "name": "LoadVariables",
//                 "des": "LoadVariables is a way to load variables data.",
//                 "events": [{
//                         "name": "InputVariables",
//                         "des": "InputVariables",
//                         "type": "in",
//                         "isOptional": false,
//                         "tag": "213",
//                         "url": "213",
//                     },
//                     {
//                         "name": "InputYName",
//                         "des": "InputYName",
//                         "type": "in",
//                         "isOptional": false,
//                         "tag": "213",
//                         "url": "213",
//                     },
//                     {
//                         "name": "InputXName",
//                         "des": "InputXName",
//                         "type": "in",
//                         "isOptional": false,
//                         "tag": "213",
//                         "url": "213",
//                     },
//
//                     {
//                         "name": "InputZName",
//                         "des": "InputZName",
//                         "type": "in",
//                         "isOptional": true,
//                         "tag": "213",
//                         "url": "213",
//                     },
//
//
//                     {
//                         "name": "outSampling",
//                         "des": "outSampling",
//                         "type": "out",
//                         "isOptional": false,
//                         "tag": "213",
//                         "url": "213",
//                     }
//                 ]
//             }, {
//                 "name": "Factor_Detector_Analysis",
//                 "des": "Factor_Detector_Analysis is a way to find factor of data.",
//                 "type": "out",
//                 "events": [{
//                         "name": "output_Factor_Detector",
//                         "des": "output_Factor_Detector",
//                         "type": "out",
//                         "isOptional": false,
//                         "tag": "213",
//                         "url": "213",
//                     },
//                     {
//                         "name": "output_Risk_Detector",
//                         "des": "output_Risk_Detector",
//                         "type": "out",
//                         "isOptional": false,
//                         "tag": "213",
//                         "url": "213",
//                     },
//                     {
//                         "name": "output_Interaction_Detector",
//                         "des": "output_Interaction_Detector",
//                         "type": "out",
//                         "isOptional": false,
//                         "tag": "213",
//                         "url": "213",
//                     },
//
//                     {
//                         "name": "output_Ecological_Detector",
//                         "des": "output_Ecological_Detector",
//                         "type": "out",
//                         "isOptional": false,
//                         "tag": "213",
//                         "url": "213",
//                     },
//
//                 ]
//             }]
//             this.modelInfo.states = data;
//         },
//         download(event) {
//             //下载接口
//             this.eventChoosing = event;
//             window.open(this.eventChoosing.url);
//         },
//         upload(event) {
//             //上传接口
//             this.showUpload = true;
//             this.eventChoosing = event;
//         },
//         beforeRemove(file) {
//             return this.$confirm(`确定移除 ${file.name}？`);
//         },
//         onSuccess({
//             data
//         }) {
//             let {
//                 tag,
//                 url
//             } = data;
//             this.showUpload = false;
//             this.eventChoosing.tag = tag;
//             this.eventChoosing.url = url;
//         },
//
//         async invoke() {
//             const loading = this.$loading({
//                 lock: true,
//                 text: 'Loading',
//                 spinner: 'el-icon-loading',
//                 background: 'rgba(0, 0, 0, 0.7)'
//             });
//             // let res= await fetch("/adada");
//             setTimeout(() => {
//                 const h = this.$createElement;
//                 loading.close();
//                 this.$message('这是一条消息提示');
//             }, 2000);
//         }
//     },
//     async mounted() {
//         //let res=await fetch('/task/'+id);
//         let res = {
//             "userInfo": {
//                 "name": "sunlingzhi",
//                 "date": new Date()
//             },
//             "modelInfo": {
//                 "name": "GeoDetector",
//                 "des": "this detector model is provided by openGMS,and the resource code is supported by Wang JF",
//                 "states": [{
//                     "name": "LoadVariables",
//                     "des": "LoadVariables is a way to load variables data.",
//                     "events": [{
//                             "name": "InputVariables",
//                             "des": "InputVariables",
//                             "type": "in",
//                             "isOptional": false,
//                             "tag": null,
//                             "url": null,
//                         },
//                         {
//                             "name": "InputYName",
//                             "des": "InputYName",
//                             "type": "in",
//                             "isOptional": false,
//                             "tag": null,
//                             "url": null,
//                         },
//                         {
//                             "name": "InputXName",
//                             "des": "InputXName",
//                             "type": "in",
//                             "isOptional": false,
//                             "tag": null,
//                             "url": null,
//                         },
//
//                         {
//                             "name": "InputZName",
//                             "des": "InputZName",
//                             "type": "in",
//                             "isOptional": true,
//                             "tag": null,
//                             "url": null,
//                         },
//
//
//                         {
//                             "name": "outSampling",
//                             "des": "outSampling",
//                             "type": "out",
//                             "isOptional": false,
//                             "tag": null,
//                             "url": null,
//                         }
//                     ]
//                 }, {
//                     "name": "Factor_Detector_Analysis",
//                     "des": "Factor_Detector_Analysis is a way to find factor of data.",
//                     "type": "out",
//                     "events": [{
//                             "name": "output_Factor_Detector",
//                             "des": "output_Factor_Detector",
//                             "type": "out",
//                             "isOptional": false,
//                             "tag": null,
//                             "url": null,
//                         },
//                         {
//                             "name": "output_Risk_Detector",
//                             "des": "output_Risk_Detector",
//                             "type": "out",
//                             "isOptional": false,
//                             "tag": null,
//                             "url": null,
//                         },
//                         {
//                             "name": "output_Interaction_Detector",
//                             "des": "output_Interaction_Detector",
//                             "type": "out",
//                             "isOptional": false,
//                             "tag": null,
//                             "url": null,
//                         },
//
//                         {
//                             "name": "output_Ecological_Detector",
//                             "des": "output_Ecological_Detector",
//                             "type": "out",
//                             "isOptional": false,
//                             "tag": null,
//                             "url": null,
//                         },
//
//                     ]
//                 }]
//             }
//         }
//         this.userInfo = res.userInfo;
//         this.modelInfo = res.modelInfo;
//     }
// })