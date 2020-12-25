var createConcept = Vue.extend({
    template: "#createConcept",
    components: {
        'avatar': VueAvatar.Avatar
    },
    data() {
        return {
            status:"Public",

            defaultActive: '4-1',
            curIndex: '6',

            ScreenMaxHeight: "0px",
            IframeHeight: "0px",
            editorUrl: "",
            load: false,

            ScreenMinHeight: "0px",

            userId: "",
            userName: "",
            loginFlag: false,
            activeIndex: 2,


            userInfo: {
                //username:"",
                name: "",
                email: "",
                phone: "",
                insName: ""
            },


            queryType: 'normal',
            searchText: '',
            classifications1: ["34WEEZ1426Y0IGXWKS8SFXOSXC7D8ZLP"],
            classifications2: ["13b822a2-fecd-4af7-aeb8-0503244abe8f"],
            currentClass: "Sedris",
            pageOption: {
                paginationShow: false,
                progressBar: true,
                sortAsc: false,
                currentPage: 1,
                pageSize: 10,
                sortType: "default",
                total: 0,
                searchResult: [],
            },

            editType:"",//create,modify
            currentLocalization:{
                localCode:"",
                localName:"",
                name:"",
                description:"",
            },
            localIndex: 0,
            languageAdd:{
                show:false,
                local:{},
            },
            localizationList:[
                {
                    localCode:"en-US",
                    localName:"English (United States)",
                    name:"",
                    description:"",
                    selected:true,
                }
            ],
            languageList:[
                { value: 'af', label: 'Afrikaans' },
                { value: 'sq', label: 'Albanian' },
                { value: 'ar', label: 'Arabic' },
                { value: 'hy', label: 'Armenian' },
                { value: 'az', label: 'Azeri' },
                { value: 'eu', label: 'Basque' },
                { value: 'be', label: 'Belarusian' },
                { value: 'bg', label: 'Bulgarian' },
                { value: 'ca', label: 'Catalan' },
                { value: 'zh', label: 'Chinese' },
                { value: 'hr', label: 'Croatian' },
                { value: 'cs', label: 'Czech' },
                { value: 'da', label: 'Danish' },
                { value: 'dv', label: 'Divehi' },
                { value: 'nl', label: 'Dutch' },
                { value: 'en', label: 'English' },
                { value: 'eo', label: 'Esperanto' },
                { value: 'et', label: 'Estonian' },
                { value: 'mk', label: 'FYRO Macedonian' },
                { value: 'fo', label: 'Faroese' },
                { value: 'fa', label: 'Farsi' },
                { value: 'fi', label: 'Finnish' },
                { value: 'fr', label: 'French' },
                { value: 'gl', label: 'Galician' },
                { value: 'ka', label: 'Georgian' },
                { value: 'de', label: 'German' },
                { value: 'el', label: 'Greek' },
                { value: 'gu', label: 'Gujarati' },
                { value: 'he', label: 'Hebrew' },
                { value: 'hi', label: 'Hindi' },
                { value: 'hu', label: 'Hungarian' },
                { value: 'is', label: 'Icelandic' },
                { value: 'id', label: 'Indonesian' },
                { value: 'it', label: 'Italian' },
                { value: 'ja', label: 'Japanese' },
                { value: 'kn', label: 'Kannada' },
                { value: 'kk', label: 'Kazakh' },
                { value: 'kok', label: 'Konkani' },
                { value: 'ko', label: 'Korean' },
                { value: 'ky', label: 'Kyrgyz' },
                { value: 'lv', label: 'Latvian' },
                { value: 'lt', label: 'Lithuanian' },
                { value: 'ms', label: 'Malay' },
                { value: 'mt', label: 'Maltese' },
                { value: 'mi', label: 'Maori' },
                { value: 'mr', label: 'Marathi' },
                { value: 'mn', label: 'Mongolian' },
                { value: 'ns', label: 'Northern Sotho' },
                { value: 'nb', label: 'Norwegian' },
                { value: 'ps', label: 'Pashto' },
                { value: 'pl', label: 'Polish' },
                { value: 'pt', label: 'Portuguese' },
                { value: 'pa', label: 'Punjabi' },
                { value: 'qu', label: 'Quechua' },
                { value: 'ro', label: 'Romanian' },
                { value: 'ru', label: 'Russian' },
                { value: 'se', label: 'Sami' },
                { value: 'sa', label: 'Sanskrit' },
                { value: 'sr', label: 'Serbian' },
                { value: 'sk', label: 'Slovak' },
                { value: 'sl', label: 'Slovenian' },
                { value: 'es', label: 'Spanish' },
                { value: 'sw', label: 'Swahili' },
                { value: 'sv', label: 'Swedish' },
                { value: 'syr', label: 'Syriac' },
                { value: 'tl', label: 'Tagalog' },
                { value: 'ta', label: 'Tamil' },
                { value: 'tt', label: 'Tatar' },
                { value: 'te', label: 'Telugu' },
                { value: 'th', label: 'Thai' },
                { value: 'ts', label: 'Tsonga' },
                { value: 'tn', label: 'Tswana' },
                { value: 'tr', label: 'Turkish' },
                { value: 'uk', label: 'Ukrainian' },
                { value: 'ur', label: 'Urdu' },
                { value: 'uz', label: 'Uzbek' },
                { value: 'vi', label: 'Vietnamese' },
                { value: 'cy', label: 'Welsh' },
                { value: 'xh', label: 'Xhosa' },
                { value: 'zu', label: 'Zulu' },
            ],

            treeData: [
                {
                    id: 1,
                    "oid": "34WEEZ1426Y0IGXWKS8SFXOSXC7D8ZLP",
                    "label": "Sedris",
                    children: [
                        {
                            id: 2,
                            "nameCn": "照明和能见度",
                            "oid": "13b822a2-fecd-4af7-aeb8-0503244abe8f",
                            "label": "Lighting and visibility",
                            "open": true
                        },
                        {
                            id: 3,
                            "nameCn": "遮蔽物",
                            "oid": "197182c8-8e6d-4e7c-89d4-052d4b053cb5",
                            "label": "shelter ",
                            "open": false
                        },
                        {
                            id: 4,
                            "nameCn": "建筑",
                            "oid": "16f91b87-f1d5-49ac-b318-0ac5e6e42f2a",
                            "label": "architecture ",
                            "open": false
                        },
                        {
                            id: 5,
                            "nameCn": "工业",
                            "oid": "45f5fd4a-1852-42a6-bc2e-0ce1ec0d9642",
                            "label": "Industry",
                            "open": false
                        },
                        {
                            id: 6,
                            "nameCn": "交通工具",
                            "oid": "8666edec-2ae3-46a0-8cb9-117cd7b13c78",
                            "label": "Means of transportation ",
                            "open": false
                        },
                        {
                            id: 7,
                            "nameCn": "维度",
                            "oid": "39acd6eb-f0fc-465b-86d6-12abc41aa1f8",
                            "label": "dimension",
                            "open": false
                        },
                        {
                            id: 8,
                            "nameCn": "限界",
                            "oid": "6ded5005-3d59-43c5-94ca-1463565fe1fe",
                            "label": "limit",
                            "open": false
                        },
                        {
                            id: 9,
                            "nameCn": "军事学",
                            "oid": "31da4c13-07f9-47f8-9304-1b3466a47369",
                            "label": "Military",
                            "open": false
                        },
                        {
                            id: 10,
                            "nameCn": "相关算法",
                            "oid": "41e035ea-7c57-41be-bbb9-261f9f1d3981",
                            "label": "The relevant algorithm ",
                            "open": false
                        },
                        {
                            id: 11,
                            "nameCn": "土地产业",
                            "oid": "141d2158-515c-4473-9977-2a46abb0aa3c",
                            "label": "Land industry",
                            "open": false
                        },
                        {
                            id: 12,
                            "nameCn": "宗教",
                            "oid": "4df148e6-4def-494e-8ab5-2f25f700c05d",
                            "label": "religions",
                            "open": false
                        },
                        {
                            id: 13,
                            "nameCn": "水文地理学",
                            "oid": "8532c6fb-253b-4fde-b3dc-39eba3b17a9b",
                            "label": "Hydrography",
                            "open": false
                        },
                        {
                            id: 14,
                            "nameCn": "支撑结构",
                            "oid": "7ed8ca41-0018-439d-b871-3e91284d5fcd",
                            "label": "Support structure ",
                            "open": false
                        },
                        {
                            id: 15,
                            "nameCn": "定位",
                            "oid": "99e2b782-74b0-430e-b421-407baf6b3afd",
                            "label": "localize",
                            "open": false
                        },
                        {
                            id: 16,
                            "nameCn": "人工水路",
                            "oid": "c4a653e0-be41-4ecc-99f9-41d1f8a59e67",
                            "label": "Artificial waterway",
                            "open": false
                        },
                        {
                            id: 17,
                            "nameCn": "声学现象",
                            "oid": "fc924203-0a90-410a-a9d3-4275dd23b4cd",
                            "label": "Acoustic phenomenon",
                            "open": false
                        },
                        {
                            id: 18,
                            "nameCn": "流动情况",
                            "oid": "fea62b5f-b720-4ff3-86d9-48b4b800df56",
                            "label": "flows",
                            "open": false
                        },
                        {
                            id: 19,
                            "nameCn": "水文工业",
                            "oid": "96263dc7-60c1-4209-8799-49fa08b007f0",
                            "label": "Hydrological industry",
                            "open": false
                        },
                        {
                            id: 20,
                            "nameCn": "颜色",
                            "oid": "a0bd5392-0c23-4590-bbd9-4cc1275c2c4a",
                            "label": "colour",
                            "open": false
                        },
                        {
                            id: 21,
                            "nameCn": "风媒颗粒",
                            "oid": "9390dd39-54b5-48b8-83bf-563a9ccb4504",
                            "label": "Wind particles",
                            "open": false
                        },
                        {
                            id: 22,
                            "nameCn": "行政机构",
                            "oid": "b3059045-6058-415b-8505-5b850042a508",
                            "label": "Administration",
                            "open": false
                        },
                        {
                            id: 23,
                            "nameCn": "身份证明",
                            "oid": "2c235858-a664-479d-bb38-643cddad228e",
                            "label": "Proof of oidentity ",
                            "open": false
                        },
                        {
                            id: 24,
                            "nameCn": "动物",
                            "oid": "eaf6546e-e714-44d8-ba89-6dae130343f6",
                            "label": "animal",
                            "open": false
                        },
                        {
                            id: 25,
                            "nameCn": "水域",
                            "oid": "5ea11b37-62d6-4126-96a3-6db5761154d8",
                            "label": "Waters",
                            "open": false
                        },
                        {
                            id: 26,
                            "nameCn": "农业",
                            "oid": "83392f3b-c02b-479f-9b10-76afd2b53407",
                            "label": "agriculture",
                            "open": false
                        },
                        {
                            id: 27,
                            "nameCn": "陆地运输",
                            "oid": "a7f1c599-1a24-46aa-85e9-7bc8e15db0a4",
                            "label": "Land transport",
                            "open": false
                        },
                        {
                            id: 28,
                            "nameCn": "空中运输",
                            "oid": "d3bde192-beaa-47ff-b0c3-7e8a92b2a6df",
                            "label": "Air transport",
                            "open": false
                        },
                        {
                            id: 29,
                            "nameCn": "原料",
                            "oid": "83e4fed1-83e2-453e-b655-8349315daf3f",
                            "label": "raw material",
                            "open": false
                        },
                        {
                            id: 30,
                            "nameCn": "植物",
                            "oid": "1f4e93d8-07b4-405d-8d3d-84075f2f37e4",
                            "label": "plant",
                            "open": false
                        },
                        {
                            id: 31,
                            "nameCn": "通信",
                            "oid": "591a2b12-77a6-4a20-8b6f-8557c6912d16",
                            "label": "Communication",
                            "open": false
                        },
                        {
                            id: 32,
                            "nameCn": "冰",
                            "oid": "2356b4da-f934-4aa4-9888-86dbca54eded",
                            "label": "Ice",
                            "open": false
                        },
                        {
                            id: 33,
                            "nameCn": "属性集",
                            "oid": "5171bd42-39a8-45ef-b539-952a95760a4e",
                            "label": "Attribute set",
                            "open": false
                        },
                        {
                            id: 34,
                            "nameCn": "测量",
                            "oid": "96122cd9-4451-4f86-9348-9b470b5c82d4",
                            "label": "measuring",
                            "open": false
                        },
                        {
                            id: 35,
                            "nameCn": "水文运输",
                            "oid": "1f2e3f7a-9017-40a7-90a9-9c54c7e3fcbe",
                            "label": "Hydrological transport",
                            "open": false
                        },
                        {
                            id: 36,
                            "nameCn": "水域表面",
                            "oid": "382abdea-6866-43c3-ac3e-9ffe87989794",
                            "label": "Water surface",
                            "open": false
                        },
                        {
                            id: 37,
                            "nameCn": "水体底板",
                            "oid": "f3d043f1-6316-4569-beb9-a351cf1a1785",
                            "label": "Water floor",
                            "open": false
                        },
                        {
                            id: 38,
                            "nameCn": "自然地理学",
                            "oid": "5d0cf3a6-4dd7-4e5e-b997-a39a0bdc9b61",
                            "label": "Natural Geography",
                            "open": false
                        },
                        {
                            id: 39,
                            "nameCn": "表层物质",
                            "oid": "160cef4c-2f2f-4556-8d47-a7156420e0b4",
                            "label": "Surface material",
                            "open": false
                        },
                        {
                            id: 40,
                            "nameCn": "表层",
                            "oid": "e8c86f24-4ba8-4123-80c9-a75b91d52636",
                            "label": "surface layer",
                            "open": false
                        },
                        {
                            id: 41,
                            "nameCn": "装备",
                            "oid": "65ec90b0-d881-462a-ba9c-a794c52b5cbc",
                            "label": "equipment",
                            "open": false
                        },
                        {
                            id: 42,
                            "nameCn": "港口",
                            "oid": "6a8eba6c-648f-4c42-ade6-b3ae72484436",
                            "label": "port",
                            "open": false
                        },
                        {
                            id: 43,
                            "nameCn": "运输",
                            "oid": "d131bf76-f5f3-4f26-84fb-b3d4d394c34d",
                            "label": "transport",
                            "open": false
                        },
                        {
                            id: 44,
                            "nameCn": "空间",
                            "oid": "08b00f05-b7b0-41d3-95f6-b6c43d820996",
                            "label": "space",
                            "open": false
                        },
                        {
                            id: 45,
                            "nameCn": "沿海地区",
                            "oid": "92b64bd2-6332-41ca-9308-b6f4bc5b39b4",
                            "label": "Coastal area",
                            "open": false
                        },
                        {
                            id: 46,
                            "nameCn": "抽象体",
                            "oid": "54525642-e596-47eb-94ec-ce4b703ad238",
                            "label": "Abstract body",
                            "open": false
                        },
                        {
                            id: 47,
                            "nameCn": "时间",
                            "oid": "f483dc38-da0e-430f-abfc-d135783b1e3b",
                            "label": "Time",
                            "open": false
                        },
                        {
                            id: 48,
                            "nameCn": "温度",
                            "oid": "5e364a5b-efd7-4ea0-887c-d271e7c2a264",
                            "label": "Temperature",
                            "open": false
                        },
                        {
                            id: 49,
                            "nameCn": "大气",
                            "oid": "cb7a25bd-dc36-49b3-aef6-dbdb7e19bc4a",
                            "label": "Atmosphere",
                            "open": false
                        },
                        {
                            id: 50,
                            "nameCn": "有机体",
                            "oid": "ac254d6c-b070-492d-bc63-e65929208317",
                            "label": "Organism",
                            "open": false
                        },
                        {
                            id: 51,
                            "nameCn": "用地",
                            "oid": "18fec44c-51e6-4bb3-a7b2-e8c6cc46c483",
                            "label": "Land",
                            "open": false
                        },
                        {
                            id: 52,
                            "nameCn": "娱乐",
                            "oid": "323dad49-0a05-4054-be84-ea1b52282b4a",
                            "label": "entertainment",
                            "open": false
                        },
                        {
                            id: 53,
                            "nameCn": "角度测量",
                            "oid": "0fdc4335-1a24-4eab-821a-ec1f1224dcdd",
                            "label": "The Angle measurement",
                            "open": false
                        },
                        {
                            id: 54,
                            "nameCn": "比率",
                            "oid": "78c8eb93-fe84-4e5e-87db-ef4dd268ec89",
                            "label": "ratio",
                            "open": false
                        },
                        {
                            id: 55,
                            "nameCn": "电磁现象",
                            "oid": "09ebec51-679f-4f19-be83-f1ce9ca6c9db",
                            "label": "Electromagnetic phenomenon",
                            "open": false
                        },
                        {
                            id: 56,
                            "nameCn": "基础建设",
                            "oid": "a7bafbe1-4c0f-4f28-8f09-f3d4ec877df8",
                            "label": "Infrastructure",
                            "open": false
                        }]
                },
                {
                    id: 57,
                    "oid": "8EJMTXTYB0QQ3RX02BV34BGBQXT0ILOL",
                    "label": "Earth System(in Chinese)",
                    children: [
                        {
                            id: 58,
                            "nameCn": "冰川地质学",
                            "oid": "1d7a0c62-3012-4399-b886-06db3672033b",
                            "label": "Glacial geology",
                            "open": false
                        },
                        {
                            id: 59,
                            "nameCn": "自然地理学",
                            "oid": "68b6b6fa-c140-474b-90b4-0df1ebfa54b4",
                            "label": "Physical geography",
                            "open": false
                        },
                        {
                            id: 60,
                            "nameCn": "城市地理学",
                            "oid": "c703668c-7931-47e2-8d72-1d0ea6f41bcd",
                            "label": "Urban geography",
                            "open": false
                        },
                        {
                            id: 61,
                            "nameCn": "地理信息系统",
                            "oid": "bcc34b38-f605-4093-968b-1f086c2bfd26",
                            "label": "Geographic Information System",
                            "open": false
                        },
                        {
                            id: 62,
                            "nameCn": "海洋地质学",
                            "oid": "13c689f2-38ac-4b0e-bbc0-2319a9f49c30",
                            "label": "Marine geology",
                            "open": false
                        },
                        {
                            id: 63,
                            "nameCn": "灾害地理学",
                            "oid": "34011836-c1c5-44d9-89f0-253b0a16c763",
                            "label": "Disaster geography",
                            "open": false
                        },
                        {
                            id: 64,
                            "nameCn": "遥感学",
                            "oid": "0f6afdb2-0b6c-4cee-808f-26c1f1642ee2",
                            "label": "Remote sensing",
                            "open": false
                        },
                        {
                            id: 65,
                            "nameCn": "断块构造说",
                            "oid": "4089a7bc-ff4b-4d78-8000-33b771c529ff",
                            "label": "Fault block construction",
                            "open": false
                        },
                        {
                            id: 66,
                            "nameCn": "多旋回构造说",
                            "oid": "bd060357-d1be-4cca-a281-3879118e4b5c",
                            "label": "Theory of polycycle",
                            "open": false
                        },
                        {
                            id: 67,
                            "nameCn": "历史地理学",
                            "oid": "2dc3821b-fa51-4e14-8b67-3a10031c502d",
                            "label": "Historical geography",
                            "open": false
                        },
                        {
                            id: 68,
                            "nameCn": "海洋地理学",
                            "oid": "84fe2988-b81f-4438-bf41-3c018efd8845",
                            "label": "Marine Geography",
                            "open": false
                        },
                        {
                            id: 69,
                            "nameCn": "地史学地层学",
                            "oid": "4e8c302f-0e5c-4e6b-99b1-3c3e13770c67",
                            "label": "Geostratigraphic stratigraphy",
                            "open": false
                        },
                        {
                            id: 70,
                            "nameCn": "水文地理学",
                            "oid": "043a4a44-85a6-4bdf-b06f-427550f17958",
                            "label": "Hydrography",
                            "open": false
                        },
                        {
                            id: 71,
                            "nameCn": "黄土地质学",
                            "oid": "edfabecd-cf6b-4f8d-8e7f-4b0f4c4b11ba",
                            "label": "Geology of loess",
                            "open": false
                        },
                        {
                            id: 72,
                            "nameCn": "地球概论",
                            "oid": "be1a4800-2264-4f54-9074-4f04328025bd",
                            "label": "Introduction to the Earth",
                            "open": false
                        },
                        {
                            id: 73,
                            "nameCn": "交通运输地理学",
                            "oid": "36f6a026-1de8-4b58-b007-4f6c0903d3b4",
                            "label": "Transportation geography",
                            "open": false
                        },
                        {
                            id: 74,
                            "nameCn": "地质力学",
                            "oid": "ce784f6c-3711-4674-8d36-4f6ee9d9f6c1",
                            "label": "Geomechanics",
                            "open": false
                        },
                        {
                            id: 75,
                            "nameCn": "区域地质学",
                            "oid": "08280971-866c-431b-8513-51dc7391af9d",
                            "label": "Regional geology",
                            "open": false
                        },
                        {
                            id: 76,
                            "nameCn": "土壤学",
                            "oid": "0dfef883-f42b-4024-b0d5-59056ad4d6aa",
                            "label": "Soil Science",
                            "open": false
                        },
                        {
                            id: 77,
                            "nameCn": "政治地理学",
                            "oid": "84797bf8-1550-4a7d-98a2-5d1cb4a99053",
                            "label": "Political geography",
                            "open": false
                        },
                        {
                            id: 78,
                            "nameCn": "社会地理学",
                            "oid": "82c58a79-2a81-40c8-96fe-603bed8b1167",
                            "label": "Social geography",
                            "open": false
                        },
                        {
                            id: 79,
                            "nameCn": "军事地理学",
                            "oid": "8e502ddd-9b45-498c-8ae5-6550ecf415ba",
                            "label": "Military Geography",
                            "open": false
                        },
                        {
                            id: 80,
                            "nameCn": "地洼构造说",
                            "oid": "bc87a9dd-7a10-4fe1-ac37-7352b0a591cd",
                            "label": "DIWA structure theory",
                            "open": false
                        },
                        {
                            id: 81,
                            "nameCn": "化学地理学",
                            "oid": "eb6ec237-a265-4417-b5b7-746d53998d4b",
                            "label": "Chemical geography",
                            "open": false
                        },
                        {
                            id: 82,
                            "nameCn": "人文、经济地理学",
                            "oid": "4076f83f-838c-4c8b-81a0-7a4ecd9a87ca",
                            "label": "Human and economic geography",
                            "open": false
                        },
                        {
                            id: 83,
                            "nameCn": "农业地理学与乡村地理学",
                            "oid": "f7f6542a-8496-4b35-8e74-8fda9344d2e9",
                            "label": "Agricultural geography and rural geography",
                            "open": false
                        },
                        {
                            id: 84,
                            "nameCn": "外动力地质学",
                            "oid": "99468eec-73e2-4893-a742-924faa1a619a",
                            "label": "External dynamic geology",
                            "open": false
                        },
                        {
                            id: 85,
                            "nameCn": "矿物学",
                            "oid": "f3a52df3-1aa5-441c-ba4f-9642f553ea86",
                            "label": "Mineralogy",
                            "open": false
                        },
                        {
                            id: 86,
                            "nameCn": "工业地理学",
                            "oid": "d0a7710e-6b42-4420-be58-9a3e695e7865",
                            "label": "Industrial Geography",
                            "open": false
                        },
                        {
                            id: 87,
                            "nameCn": "沉积学与沉积岩石学",
                            "oid": "646eaf6d-bfb2-49ae-a348-a479a4a143d2",
                            "label": "Sedimentology and sedimentary petrology",
                            "open": false
                        },
                        {
                            id: 88,
                            "nameCn": "资源与能源地理学",
                            "oid": "9d48148a-571b-4882-8da5-aa7861e399fe",
                            "label": "Resource and energy geography",
                            "open": false
                        },
                        {
                            id: 89,
                            "nameCn": "商业地理学",
                            "oid": "40faf1b0-1acb-460f-9592-ab724b7e8d2e",
                            "label": "Commercial Geography",
                            "open": false
                        },
                        {
                            id: 90,
                            "nameCn": "环境地理学",
                            "oid": "8421c148-1e09-43fa-a519-abd080908c30",
                            "label": "Environmental Geography",
                            "open": false
                        },
                        {
                            id: 91,
                            "nameCn": "地震地质学",
                            "oid": "cfd834cb-6063-427f-b9c8-baa96766984c",
                            "label": "Earthquake geology",
                            "open": false
                        },
                        {
                            id: 92,
                            "nameCn": "火成岩石学",
                            "oid": "582a0a2d-518c-40d2-837e-bcc316f4ea12",
                            "label": "Igneous petrology",
                            "open": false
                        },
                        {
                            id: 93,
                            "nameCn": "地质学",
                            "oid": "4a964590-fa3e-4a7f-a737-be78b4ea1a43",
                            "label": "Geology",
                            "open": false
                        },
                        {
                            id: 94,
                            "nameCn": "地图学与测绘学",
                            "oid": "d2bb45d7-1bc4-4cd1-bbe6-c184bd885ab7",
                            "label": "Cartography and surveying",
                            "open": false
                        },
                        {
                            id: 95,
                            "nameCn": "人口地理学",
                            "oid": "b31ada6c-a96a-47cf-9679-c410f57436af",
                            "label": "Population geography",
                            "open": false
                        },
                        {
                            id: 96,
                            "nameCn": "构造运动期(幕)",
                            "oid": "2a4837eb-6a3b-45aa-b52b-cc9085eddcf2",
                            "label": "Tectonic movement",
                            "open": false
                        },
                        {
                            id: 97,
                            "nameCn": "地貌学",
                            "oid": "21131ddf-baeb-4bb6-a886-cf74d41c1367",
                            "label": "Geomorphology",
                            "open": false
                        },
                        {
                            id: 98,
                            "nameCn": "变质岩石学",
                            "oid": "a5211f98-1641-493d-ae89-d5ce55ce4734",
                            "label": "Metamorphic petrology",
                            "open": false
                        },
                        {
                            id: 99,
                            "nameCn": "旅游地理学",
                            "oid": "871cf59b-3cc3-4c10-b5c1-d636186f14c5",
                            "label": "Tourism Geography",
                            "open": false
                        },
                        {
                            id: 100,
                            "nameCn": "活动构造与新构造学",
                            "oid": "00829155-961a-4b54-bfe2-d99b296b615d",
                            "label": "Active tectonics and neotectonics",
                            "open": false
                        },
                        {
                            id: 101,
                            "nameCn": "气象气候学",
                            "oid": "e6f27596-bcab-4688-b34b-dff5ce6e8c02",
                            "label": "Meteorological climatology",
                            "open": false
                        },
                        {
                            id: 102,
                            "nameCn": "医学地理学",
                            "oid": "0a7451cd-8b82-4ac1-848c-e5ba2c4adfc1",
                            "label": "Medical geography",
                            "open": false
                        },
                        {
                            id: 103,
                            "nameCn": "岩溶地质学",
                            "oid": "e3a98a18-cce2-451d-ae1d-e658c920428e",
                            "label": "Karstology",
                            "open": false
                        },
                        {
                            id: 104,
                            "nameCn": "古生物学",
                            "oid": "75be31ab-4f9a-429c-a1f9-ed79eb3e39cb",
                            "label": "Paleontology",
                            "open": false
                        },
                        {
                            id: 105,
                            "nameCn": "火山地质学",
                            "oid": "e9f5d7ec-ad92-4ce0-afc9-ef1ee2cc81b1",
                            "label": "Volcanic geology",
                            "open": false
                        },
                        {
                            id: 106,
                            "nameCn": "古人类学",
                            "oid": "f4ac48a4-9735-4e54-8690-f775d2e4ad32",
                            "label": "Ancient anthropology",
                            "open": false
                        },
                        {
                            id: 107,
                            "nameCn": "第四纪地质学",
                            "oid": "a3054d71-ec1f-43c8-b537-fb3c30ede0ac",
                            "label": "Quaternary Geology",
                            "open": false
                        },
                        {
                            id: 108,
                            "nameCn": "古地理学",
                            "oid": "31ab1e9b-e396-4aae-9861-fc4aa432d790",
                            "label": "Palaeogeography",
                            "open": false
                        },
                        {
                            id: 109,
                            "nameCn": "文化地理学",
                            "oid": "28c318ae-41a6-4489-bd83-fdd93317e424",
                            "label": "Cultural Geography",
                            "open": false
                        }
                    ]
                }
            ],

            defaultProps: {
                children: 'children',
                label: 'label'
            },
            cls: [],
            clsStr: '',
            parId: "",
            related: [""],
            relatedOid: [],

            conceptInfo: {},

            socket: "",

            concept_oid: "",

            editType:'create',

            toCreate: 1,

            startDraft:0,

            draft:{
                oid:'',
            },

            draftOid:'',

            itemInfoImage:'',

        }
    },
    methods: {

        getLanguageList(){
            // $.get("/static/languageList.json",{},(content)=>{
            //     this.languageList = content;
            //     console.log(this.languageList)
            // }

            // $.get("/static/languageList.json",function(data,status){
            //     alert("Data: " + data + "\nStatus: " + status);
            // });
        },
        addLocalization(){
            this.languageAdd.show = true;
        },
        confirmAddLocal(){

            if(this.languageAdd.local.label==undefined){
                this.$message({
                    message: 'Please selcet a language!',
                    type: 'warning'
                });
                return;
            }
            for(i=0;i<this.localizationList.length;i++){
                let localization = this.localizationList[i];
                if(localization.localName==this.languageAdd.local.label){
                    this.$message({
                        message: 'This language already exists!',
                        type: 'warning'
                    });
                    return;
                }
            }

            let newLocalization = {
                localCode:this.languageAdd.local.value,
                localName:this.languageAdd.local.label,
                name:"",
                description:"",
            };
            this.localizationList.push(newLocalization);
            this.languageAdd.local={};

            this.changeLocalization(newLocalization);
        },
        cancelAddLocal(){
            this.languageAdd.show = false;
        },
        deleteLocalization(row){
            this.$confirm('Do you want to delete <b>'+row.localName+'</b> description?', 'Warning', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
            }).then(() => {

                for(i=0;i<this.localizationList.length;i++){
                    let localization = this.localizationList[i]
                    if(localization.localName==row.localName){
                        this.localizationList.splice(i,1);
                        break;
                    }
                }
                if(this.localizationList.length>0){
                    this.changeLocalization(this.localizationList[0]);
                }else{
                    this.changeLocalization(null);
                }

                this.$message({
                    type: 'success',
                    message: 'Delete '+row.localName+' successfully!',
                });
            }).catch(() => {

            });

        },
        changeLocalization(row){
            if(row==null){
                this.currentLocalization={
                    localCode:"",
                    localName:"",
                    name:"",
                    description:"",
                };
                tinymce.activeEditor.setContent("");
                // tinymce.undoManager.clear();
            }else {
                for (i = 0; i < this.localizationList.length; i++) {
                    this.$set(this.localizationList[i], "selected", false);
                    if (this.currentLocalization.localName == this.localizationList[i].localName) {
                        this.localizationList[i].name = this.currentLocalization.name;
                        this.localizationList[i].description = tinymce.activeEditor.getContent();
                    }
                }
                this.$set(row, "selected", true);
                this.currentLocalization = row;
                tinymce.activeEditor.setContent(row.description);
                // tinymce.undoManager.clear();
            }
        },

        handleSelect(index, indexPath) {
            this.setSession("index", index);
            window.location.href = "/user/userSpace"
        },
        handleCheckChange(data, checked, indeterminate) {
            let checkedNodes = this.$refs.tree2.getCheckedNodes();
            let classes = [];
            let str = '';
            for (let i = 0; i < checkedNodes.length; i++) {
                // console.log(checkedNodes[i].children)
                if (checkedNodes[i].children != undefined) {
                    continue;
                }

                classes.push(checkedNodes[i].oid);
                str += checkedNodes[i].label;
                if (i != checkedNodes.length - 1) {
                    str += ", ";
                }
            }
            this.cls = classes;
            this.clsStr = str;

        },
        handleCurrentChange(data, checked, indeterminate) {
            this.pageOption.searchResult = [];
            this.pageOption.total = 0;
            this.pageOption.paginationShow = false;
            this.currentClass = data.label;
            let classes = [];
            classes.push(data.oid);
            this.classifications1 = classes;
            this.getChildren(data.children)
            this.pageOption.currentPage = 1;
            this.searchText = "";
            this.getConcepts();
        },
        selectConcept() {
            this.relatedStr = "hello"
        },
        changeOpen(n) {
            this.activeIndex = n;
        },
        setSession(name, value) {
            window.sessionStorage.setItem(name, value);
        },

        search() {
            this.pageOption.currentPage = 1;
            this.getConcepts();
        },
        getConcepts() {
            this.pageOption.progressBar = true;
            var data = {
                asc: this.pageOption.sortAsc,
                page: this.pageOption.currentPage - 1,
                pageSize: this.pageOption.pageSize,
                searchText: this.searchText,
                classifications: this.classifications1.length == 0 ? ["all"] : this.classifications1

            };
            this.Query(data, this.queryType);
        },
        Query(data, type) {
            let query = {};
            query.oid = data.classifications[0];
            query.page = data.page;
            query.sortType = this.pageOption.sortType;
            if (data.asc) {
                query.asc = 0;
            } else {
                query.asc = 1;
            }
            query.searchText = data.searchText;

            let url = "";
            if (query.searchText.trim() == "") {
                url = "/repository/getConceptList";
            } else {
                url = "/repository/searchConcept";
                this.classifications1 = [""];
                this.currentClass = "ALL";
                this.$refs.tree1.setCurrentKey(null);
            }

            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(query),
                async: true,
                contentType: "application/json",
                success: (json) => {
                    if (json.code == 0) {
                        let data = json.data;
                        this.pageOption.total = data.total;
                        for (var i = 0; i < data.list.length; i++) {
                            data.list[i].exist = false;
                        }
                        this.pageOption.searchResult = data.list;
                        this.pageOption.progressBar = false;
                        this.pageOption.paginationShow = true;

                        for (var i = 0; i < this.pageOption.searchResult.length; i++) {
                            for (var j = 0; j < this.relatedOid.length; j++) {
                                if (this.relatedOid[j] == this.pageOption.searchResult[i].oid) {
                                    this.pageOption.searchResult[i].exist = true;
                                    break;
                                } else {
                                    this.pageOption.searchResult[i].exist = false;
                                }
                            }
                        }
                    } else {
                        console.log("query error!")
                    }
                }
            })
        },
        //页码change
        handlePageChange(val) {
            this.pageOption.currentPage = val;
            window.scrollTo(0, 0);
            this.getConcepts();
        },
        getChildren(children) {
            if (children != null) {
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    this.classifications1.push(child.oid);
                    this.getChildren(child.children);
                }
            }
        },
        //添加related
        addRelated(event) {

            console.log(event);
            this.pageOption.searchResult[event].exist = true;

            con = this.pageOption.searchResult[event].name;
            oid = this.pageOption.searchResult[event].oid;

            this.related.push(con);
            this.relatedOid.push(oid);

            $('#related').tagEditor('destroy')
            $('#related').tagEditor({
                initialTags: this.related,
                forceLowercase: false,
                placeholder: 'Enter keywords ...'
            });
        },
        deleteRelated(event) {
            console.log(event);
            this.pageOption.searchResult[event].exist = false;

            con = this.pageOption.searchResult[event].name;
            oid = this.pageOption.searchResult[event].oid;

            this.related = this.related.filter(function (item) {
                return item != con;
            });
            this.relatedOid = this.relatedOid.filter(function (item) {
                return item != oid;
            });

            $('#related').tagEditor('destroy')
            $('#related').tagEditor({
                initialTags: this.related,
                forceLowercase: false,
                placeholder: 'Enter keywords ...'
            });
        },
        searchByOid(oid) {
            $.ajax({
                url: "/repository/getConceptInfo/" + oid,
                type: 'GET',
                data: {},
                async: false,
                success: (result) => {
                    console.log(result);
                    var basicInfo = result.data;
                    var relate = basicInfo.name;
                    this.related.push(relate);
                }
            })
        },

        insertInfo(basicInfo){
            let user_num = 0;

            this.conceptInfo = basicInfo;

            //cls
            this.cls = basicInfo.classifications;
            this.status = basicInfo.status;
            let ids = [];
            for (i = 0; i < this.cls.length; i++) {
                for (j = 0; j < 2; j++) {
                    for (k = 0; k < this.treeData[j].children.length; k++) {
                        if (this.cls[i] == this.treeData[j].children[k].oid) {
                            ids.push(this.treeData[j].children[k].id);
                            this.parid = this.treeData[j].children[k].id;
                            this.clsStr += this.treeData[j].children[k].label;
                            if (i != this.cls.length - 1) {
                                this.clsStr += ", ";
                            }
                            break;
                        }
                    }
                    if (ids.length - 1 == i) {
                        break;
                    }
                }
            }

            this.$refs.tree2.setCheckedKeys(ids);

            $(".providers").children(".panel").remove();

            $("#nameInput").val(basicInfo.name);
            $("#descInput").val(basicInfo.description);

            //image
            if (basicInfo.image != "") {
                this.itemInfoImage = basicInfo.image
            }

            //related
            this.relatedOid = basicInfo.related;
            for (var i = 0; i < this.relatedOid.length; i++) {
                this.searchByOid(this.relatedOid[i]);
            }

            $('#related').tagEditor('destroy')
            $('#related').tagEditor({
                initialTags: this.related,
                forceLowercase: false,
                placeholder: 'Enter keywords ...'
            });

            //detail
            // if (basicInfo.detail != null) {
            //     $("#comceptText").html(basicInfo.detail);
            // }

            initTinymce('textarea#conceptText')
            this.localizationList = basicInfo.localizationList;
            let interval = setInterval(()=> {
                this.changeLocalization(this.localizationList[0])
                clearInterval(interval);
            },1000);

            //alias
            $('#aliasInput').tagEditor('destroy');
            $('#aliasInput').tagEditor({
                initialTags: basicInfo.alias ,
                forceLowercase: false,
                // placeholder: 'Enter alias ...'
            });

        },

        getItemContent(trigger,callBack){
            let itemObj = {}

            itemObj.classifications = this.cls;
            itemObj.name = $("#nameInput").val();
            itemObj.alias = $("#aliasInput").val().split(",");
            itemObj.uploadImage = this.itemInfoImage
            itemObj.description = $("#descInput").val();
            itemObj.related = this.relatedOid;
            itemObj.status = this.status;
            itemObj.localizationList = this.localizationList;

            if(this.editType == 'modify') {

                for (i = 0; i < this.localizationList.length; i++) {
                    if (this.currentLocalization.localName == this.localizationList[i].localName) {
                        this.localizationList[i].name = this.currentLocalization.name;
                        this.localizationList[i].description = tinymce.activeEditor.getContent();
                        break;
                    }
                }
                itemObj.localizationList = this.localizationList;

            }else {
                itemObj.localizationList = [];

                this.currentLocalization.description = tinymce.activeEditor.getContent();
                this.currentLocalization.localCode = this.languageAdd.local.value;
                this.currentLocalization.localName = this.languageAdd.local.label;

                itemObj.localizationList.push(this.currentLocalization);
            }

            if(callBack){
                callBack(itemObj)
            }

            return itemObj;
        },

        //draft
        onInputName(){
            console.log(1)
            if(this.toCreate==1){
                this.toCreate=0
                this.startDraft=1
                this.timeOut=setTimeout(()=>{
                    this.toCreate=1
                },30000)
                setTimeout(()=>{
                    this.createDraft()
                },300)

            }
        },

        getStep(){
            let domID=$('.step-tab-panel.active')[0].id
            return parseInt(domID.substring(domID.length-1,domID.length))
        },

        createDraft(){//请求后台创建一个草稿实例,如果存在则更新

            var step = this.getStep()
            let content=this.getItemContent(step)

            let urls=window.location.href.split('/')
            let item=urls[6]
            item=item.substring(6,item.length)
            let obj={
                content:content,
                editType:this.editType,
                itemType:item,
                user:this.userId,
                oid:this.draft.oid,
            }
            if(this.editType) {
                obj.itemOid=this.$route.params.editId?this.$route.params.editId:null
                obj.itemName= this.itemName;
            }

            this.$refs.draftBox.createDraft(obj)
        },

        loadMatchedCreateDraft(){
            this.$refs.draftBox.loadMatchedCreateDraft()
        },

        deleteDraft(){
            this.$refs.draftBox.deleteDraft(this.draft.oid)
        },

        initDraft(editType,backUrl,oidFrom,oid){
            this.$refs.draftBox.initDraft(editType,backUrl,oidFrom,oid)
        },

        draftJump(){
            window.location.href = '/user/userSpace#/communities/concept&semantic';
        },

        getDraft(){
            return this.$refs.draftBox.getDraft();
        },

        insertDraft(draftContent){
            this.insertInfo(draftContent)
        },

        cancelEditClick(){
            if(this.getDraft()!=null){
                this.$refs.draftBox.cancelDraftDialog=true
            }else{
                setTimeout(() => {
                    window.location.href = "/user/userSpace#/communities/concept&semantic";
                }, 305)
            }
        },

        sendcurIndexToParent() {
            this.$emit('com-sendcurindex', this.curIndex)
        },

        sendUserToParent(userId) {
            this.$emit('com-senduserinfo', userId)
        },

        init: function () {

            // if ('WebSocket' in window) {
            //     // this.socket = new WebSocket("ws://localhost:8080/websocket");
            //     this.socket = new WebSocket(websocketAddress);
            //     // 监听socket连接
            //     this.socket.onopen = this.open;
            //     // 监听socket错误信息
            //     this.socket.onerror = this.error;
            //     // 监听socket消息
            //     this.socket.onmessage = this.getMessage;
            //
            // }
            // else {
            //     alert('当前浏览器 Not support websocket');
            //     console.log("websocket 无法连接");
            // }
        },
        open: function () {
            console.log("socket连接成功")
        },
        error: function () {
            console.log("连接错误");
        },
        getMessage: function (msg) {
            console.log(msg.data);
        },
        send: function (msg) {
            this.socket.send(msg);
        },
        close: function () {
            console.log("socket已经关闭")
        },

        imgFile() {
            $("#imgOne").click();
        },

        preImg() {


            var file = $('#imgOne').get(0).files[0];
            //创建用来读取此文件的对象
            var reader = new FileReader();
            //使用该对象读取file文件
            reader.readAsDataURL(file);
            //读取文件成功后执行的方法函数
            reader.onload =  (e) => {
                //读取成功后返回的一个参数e，整个的一个进度事件
                //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
                //的base64编码格式的地址
                this.itemInfoImage = e.target.result
            }


        },

        deleteImg(){
            let obj = document.getElementById('imgOne')
            // obj.outerHTML=obj.outerHTML
            obj.value = ''
            this.itemInfoImage = ''
        },

        getMessageNum(concept_oid) {
            this.message_num_socket = 0;//初始化消息数目
            let data = {
                type: 'concept',
                oid: concept_oid,
            };

            //根据oid去取该作者的被编辑的条目数量
            $.ajax({
                url: "/theme/getAuthorMessageNum",
                type: "GET",
                data: data,
                async: false,
                success: (json) => {
                    this.message_num_socket = json;
                }
            });
            let data_theme = {
                type: 'concept',
                oid: concept_oid,
            };
            $.ajax({
                url: "/theme/getThemeMessageNum",
                async: false,
                type: "GET",
                data: data_theme,
                success: (json) => {
                    console.log(json);
                    for (let i = 0; i < json.length; i++) {
                        for (let k = 0; k < 4; k++) {
                            let type;
                            switch (k) {
                                case 0:
                                    type = json[i].subDetails;
                                    break;
                                case 1:
                                    type = json[i].subClassInfos;
                                    break;
                                case 2:
                                    type = json[i].subDataInfos;
                                    break;
                                case 3:
                                    type = json[i].subApplications;
                                    break;
                            }
                            if (type != null && type.length > 0) {
                                for (let j = 0; j < type.length; j++) {
                                    if (k == 0) {
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    } else if (k == 1) {
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    } else if (k == 2) {
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    } else if (k == 3) {
                                        switch (type[j].status) {
                                            case "0":
                                                this.message_num_socket++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }
    },

    destroyed() {
        // 销毁监听
        this.socket.onclose = this.close
    },

    mounted() {

        let that = this;
        that.init();
        //初始化的时候吧curIndex传给父组件，来控制bar的高亮显示
        this.sendcurIndexToParent()

        $(() => {
            let height = document.documentElement.clientHeight;
            this.ScreenMinHeight = (height) + "px";
            this.ScreenMaxHeight = (height) + "px";

            window.onresize = () => {
                console.log('come on ..');
                height = document.documentElement.clientHeight;
                this.ScreenMinHeight = (height) + "px";
                this.ScreenMaxHeight = (height) + "px";
            };
        })

        var oid = this.$route.params.editId;//取得所要edit的id
        this.draft.oid=window.localStorage.getItem('draft');//取得保存的草稿的Oid

        this.search();

        var user_num = 0;

        if ((oid === "0") || (oid === "") || (oid === null) || (oid === undefined)) {

            // $("#title").text("Create Concept & Semantic")
            $("#subRteTitle").text("/Create Concept & Semantic")

            $('#aliasInput').tagEditor({
                forceLowercase: false
            });

            this.editType = 'create';

            let interval = setInterval(function () {
                initTinymce('textarea#singleDescription')
                clearInterval(interval);
            },500);

            this.$set(this.languageAdd.local,"value","en-US");
            this.$set(this.languageAdd.local,"label","English (United States)");

            if(this.draft.oid!=''&&this.draft.oid!=null&&typeof (this.draft.oid)!="undefined"){
                // this.loadDraftByOid()
                this.initDraft('create','/user/userSpace#/models/modelitem','draft',this.draft.oid)
            }else{
                this.loadMatchedCreateDraft();
            }

        } else {

            this.editType = 'modify';
            if(this.draft.oid==''||this.draft.oid==null||typeof (this.draft.oid)=="undefined"){
                this.initDraft('edit','/user/userSpace#/models/modelitem','item',this.$route.params.editId)
            }else{
                this.initDraft('edit','/user/userSpace#/models/modelitem','draft',this.draft.oid)
            }
            // $("#title").text("Modify Concept & Semantic")
            $("#subRteTitle").text("/Modify Concept & Semantic")
            // document.title = "Modify Concept & Semantic | OpenGMS"

            if(window.localStorage.getItem('draft')==null) {
                $.ajax({
                    url: "/repository/getConceptInfo/" + oid,
                    type: "get",
                    data: {},

                    success: (result) => {
                        console.log(result);
                        var basicInfo = result.data;

                        this.insertInfo(basicInfo)
                    }
                })
            }

            $('#aliasInput').tagEditor({
                forceLowercase: false
            });
            window.sessionStorage.setItem("editConcept_id", "");
        }
        window.localStorage.removeItem('draft')


        $("#step").steps({
            onFinish: function () {
                alert('Wizard Completed');
            },
            onChange: (currentIndex, newIndex, stepDirection) => {
                if (currentIndex === 0 && stepDirection === "forward") {
                    if (this.cls.length == 0) {
                        new Vue().$message({
                            message: 'Please select at least one classification!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    }
                    else if ($("#nameInput").val().trim() == "") {
                        new Vue().$message({
                            message: 'Please enter name!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    }else if ($("#descInput").val().trim() == ""){
                        new Vue().$message({
                            message: 'Please enter overview!',
                            type: 'warning',
                            offset: 70,
                        });
                        return false;
                    } else {
                        if(this.draft.oid!='')
                            this.createDraft();
                        return true;
                    }
                } else {
                    return true;
                }
            }

        });

        //related
        $('#related').tagEditor({
            initialTags: this.related,
            forceLowercase: false,
            placeholder: 'Enter keywords ...'
        });


        //判断是否登录
        $.ajax({
            type: "GET",
            url: "/user/load",
            data: {},
            cache: false,
            async: false,
            success: (data) => {
                console.log(data);
                if (data.oid == "") {
                    alert("Please login");
                    window.location.href = "/user/login";
                } else {
                    this.userId = data.oid;
                    this.userName = data.name;

                    this.sendUserToParent(this.userId)
                }
            }
        })

        let height = document.documentElement.clientHeight;
        this.ScreenMaxHeight = (height) + "px";
        this.IframeHeight = (height - 20) + "px";

        window.onresize = () => {
            console.log('come on ..');
            height = document.documentElement.clientHeight;
            this.ScreenMaxHeight = (height) + "px";
            this.IframeHeight = (height - 20) + "px";
        }


        var conceptObj = {};

        $(".finish").click(() => {
            let loading = this.$loading({
                lock: true,
                text: "Uploading...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            if(this.editType=='modify') {
                this.changeLocalization(this.currentLocalization);
            }
            for(i=0;i<this.localizationList.length;i++){
                let local = this.localizationList[i];
                if(local.localName.trim()==""||local.localCode.trim()==""){
                    this.$alert('<b>'+local.localName+'</b> localized name or description has not been filled in, please fill it or delete the localization language.', 'Warning', {
                        confirmButtonText: 'OK',
                        type: 'warning',
                        dangerouslyUseHTMLString: true,
                        callback: action => {

                        }
                    });
                    return;
                }
            }

            conceptObj = this.getItemContent('finish')

            let formData = new FormData();
            if ((oid === "0") || (oid === "") || (oid == null)) {
                let file = new File([JSON.stringify(conceptObj)], 'ant.txt', {
                    type: 'text/plain',
                });
                formData.append("info", file);
                $.ajax({
                    url: "/repository/addConcept",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,
                    success: (result)=> {
                        loading.close();
                        if (result.code == "0") {
                            this.deleteDraft()
                            this.$confirm('<div style=\'font-size: 18px\'>Create concept successfully!</div>', 'Tip', {
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: 'View',
                                cancelButtonText: 'Go Back',
                                cancelButtonClass: 'fontsize-15',
                                confirmButtonClass: 'fontsize-15',
                                type: 'success',
                                center: true,
                                showClose: false,
                            }).then(() => {
                                window.location.href = "/repository/concept/" + result.data;
                            }).catch(() => {
                                window.location.href = "/user/userSpace#/communities/concept&semantic";
                            });

                        } else if (result.code == -1) {
                            this.$alert('Please login first!', 'Error', {
                                type:"error",
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href="/user/login";
                                }
                            });
                        } else {
                            this.$alert('Created failed!', 'Error', {
                                type:"error",
                                confirmButtonText: 'OK',
                                callback: action => {

                                }
                            });
                        }
                    }
                })
            } else {
                conceptObj["oid"] = oid;
                let file = new File([JSON.stringify(conceptObj)], 'ant.txt', {
                    type: 'text/plain',
                });
                formData.append("info", file)
                $.ajax({
                    url: "/repository/updateConcept",
                    type: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    async: true,
                    data: formData,
                    success: (result)=> {
                        loading.close();
                        if (result.code === 0) {
                            this.deleteDraft()
                            if (result.data.method === "update") {
                                this.$confirm('<div style=\'font-size: 18px\'>Update concept successfully!</div>', 'Tip', {
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: 'View',
                                    cancelButtonText: 'Go Back',
                                    cancelButtonClass: 'fontsize-15',
                                    confirmButtonClass: 'fontsize-15',
                                    type: 'success',
                                    center: true,
                                    showClose: false,
                                }).then(() => {
                                    window.location.href = "/repository/concept/" + result.data.oid;
                                }).catch(() => {
                                    window.location.href = "/user/userSpace#/communities/concept&semantic";
                                });
                            } else {
                                let currentUrl = window.location.href;
                                let index = currentUrl.lastIndexOf("\/");
                                that.concept_oid = currentUrl.substring(index + 1, currentUrl.length);
                                console.log(that.concept_oid);
                                //当change submitted时，其实数据库中已经更改了，但是对于消息数目来说还没有及时改变，所以在此处获取消息数目，实时更新导航栏消息数目，
                                // that.getMessageNum(that.concept_oid);
                                // let params = that.message_num_socket;
                                // that.send(params);

                                this.$alert('Changes have been submitted, please wait for the author to review.', 'Success', {
                                    type:"success",
                                    confirmButtonText: 'OK',
                                    callback: action => {
                                        window.location.href = "/user/userSpace";
                                    }
                                });

                            }
                        } else if (result.code == -2) {
                            this.$alert('Please login first!', 'Error', {
                                type:"error",
                                confirmButtonText: 'OK',
                                callback: action => {
                                    window.location.href="/user/login";
                                }
                            });
                        } else {
                            this.$alert(result.msg, 'Error', {
                                type:"error",
                                confirmButtonText: 'OK',
                                callback: action => {

                                }
                            });
                        }
                    }
                })
            }
        });
        // $(".prev").click(()=>{
        //
        // });

        const timer = setInterval(()=>{
            if(this.itemName!=''&&this.startDraft==1){
                this.createDraft()
            }
        },30000)

        this.$once('hook:beforeDestroy', ()=>{
            clearInterval(timer)
            clearTimeout(this.timeOut)
        })

        $(document).on("keyup", ".username", function () {

            if ($(this).val()) {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html($(this).val());
            } else {
                $(this).parents('.panel').eq(0).children('.panel-heading').children().children().html("NEW");
            }
        });

        this.getLanguageList();

    }
})