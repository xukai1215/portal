new Vue({
    el: '#app',
    components: {
        'avatar': VueAvatar.Avatar
    },
    data: function () {
        return {
            activeIndex:'8-1',
            queryType: 'normal',
            searchText: '',
            classifications1: ["13b822a2-fecd-4af7-aeb8-0503244abe8f"],
            classifications2: ["13b822a2-fecd-4af7-aeb8-0503244abe8f"],

            currentClass: "Lighting and visibility",

            pageOption: {
                paginationShow:false,
                progressBar: true,
                sortAsc: false,
                currentPage: 1,
                pageSize: 10,
                sortType: "default",
                total: 0,
                searchResult: [],
            },

            treeData: [
                {
                    id: 1,
                    "oid": "34WEEZ1426Y0IGXWKS8SFXOSXC7D8ZLP",
                    "label": "Sedris",
                    children: [
                    {
                        id: 100,
                        "nameCn": "照明和能见度",
                        "oid": "13b822a2-fecd-4af7-aeb8-0503244abe8f",
                        "label": "Lighting and visibility",
                        "open": true
                    },
                    {
                        "nameCn": "遮蔽物",
                        "oid": "197182c8-8e6d-4e7c-89d4-052d4b053cb5",
                        "label": "shelter ",
                        "open": false
                    },
                    {
                        "nameCn": "建筑",
                        "oid": "16f91b87-f1d5-49ac-b318-0ac5e6e42f2a",
                        "label": "architecture ",
                        "open": false
                    },
                    {
                        "nameCn": "工业",
                        "oid": "45f5fd4a-1852-42a6-bc2e-0ce1ec0d9642",
                        "label": "Industry",
                        "open": false
                    },
                    {
                        "nameCn": "交通工具",
                        "oid": "8666edec-2ae3-46a0-8cb9-117cd7b13c78",
                        "label": "Means of transportation ",
                        "open": false
                    },
                    {
                        "nameCn": "维度",
                        "oid": "39acd6eb-f0fc-465b-86d6-12abc41aa1f8",
                        "label": "dimension",
                        "open": false
                    },
                    {
                        "nameCn": "限界",
                        "oid": "6ded5005-3d59-43c5-94ca-1463565fe1fe",
                        "label": "limit",
                        "open": false
                    },
                    {
                        "nameCn": "军事学",
                        "oid": "31da4c13-07f9-47f8-9304-1b3466a47369",
                        "label": "Military",
                        "open": false
                    },
                    {
                        "nameCn": "相关算法",
                        "oid": "41e035ea-7c57-41be-bbb9-261f9f1d3981",
                        "label": "The relevant algorithm ",
                        "open": false
                    },
                    {
                        "nameCn": "土地产业",
                        "oid": "141d2158-515c-4473-9977-2a46abb0aa3c",
                        "label": "Land industry",
                        "open": false
                    },
                    {
                        "nameCn": "宗教",
                        "oid": "4df148e6-4def-494e-8ab5-2f25f700c05d",
                        "label": "religions",
                        "open": false
                    },
                    {
                        "nameCn": "水文地理学",
                        "oid": "8532c6fb-253b-4fde-b3dc-39eba3b17a9b",
                        "label": "Hydrography",
                        "open": false
                    },
                    {
                        "nameCn": "支撑结构",
                        "oid": "7ed8ca41-0018-439d-b871-3e91284d5fcd",
                        "label": "Support structure ",
                        "open": false
                    },
                    {
                        "nameCn": "定位",
                        "oid": "99e2b782-74b0-430e-b421-407baf6b3afd",
                        "label": "localize",
                        "open": false
                    },
                    {
                        "nameCn": "人工水路",
                        "oid": "c4a653e0-be41-4ecc-99f9-41d1f8a59e67",
                        "label": "Artificial waterway",
                        "open": false
                    },
                    {
                        "nameCn": "声学现象",
                        "oid": "fc924203-0a90-410a-a9d3-4275dd23b4cd",
                        "label": "Acoustic phenomenon",
                        "open": false
                    },
                    {
                        "nameCn": "流动情况",
                        "oid": "fea62b5f-b720-4ff3-86d9-48b4b800df56",
                        "label": "flows",
                        "open": false
                    },
                    {
                        "nameCn": "水文工业",
                        "oid": "96263dc7-60c1-4209-8799-49fa08b007f0",
                        "label": "Hydrological industry",
                        "open": false
                    },
                    {
                        "nameCn": "颜色",
                        "oid": "a0bd5392-0c23-4590-bbd9-4cc1275c2c4a",
                        "label": "colour",
                        "open": false
                    },
                    {
                        "nameCn": "风媒颗粒",
                        "oid": "9390dd39-54b5-48b8-83bf-563a9ccb4504",
                        "label": "Wind particles",
                        "open": false
                    },
                    {
                        "nameCn": "行政机构",
                        "oid": "b3059045-6058-415b-8505-5b850042a508",
                        "label": "Administration",
                        "open": false
                    },
                    {
                        "nameCn": "身份证明",
                        "oid": "2c235858-a664-479d-bb38-643cddad228e",
                        "label": "Proof of oidentity ",
                        "open": false
                    },
                    {
                        "nameCn": "动物",
                        "oid": "eaf6546e-e714-44d8-ba89-6dae130343f6",
                        "label": "animal",
                        "open": false
                    },
                    {
                        "nameCn": "水域",
                        "oid": "5ea11b37-62d6-4126-96a3-6db5761154d8",
                        "label": "Waters",
                        "open": false
                    },
                    {
                        "nameCn": "农业",
                        "oid": "83392f3b-c02b-479f-9b10-76afd2b53407",
                        "label": "agriculture",
                        "open": false
                    },
                    {
                        "nameCn": "陆地运输",
                        "oid": "a7f1c599-1a24-46aa-85e9-7bc8e15db0a4",
                        "label": "Land transport",
                        "open": false
                    },
                    {
                        "nameCn": "空中运输",
                        "oid": "d3bde192-beaa-47ff-b0c3-7e8a92b2a6df",
                        "label": "Air transport",
                        "open": false
                    },
                    {
                        "nameCn": "原料",
                        "oid": "83e4fed1-83e2-453e-b655-8349315daf3f",
                        "label": "raw material",
                        "open": false
                    },
                    {
                        "nameCn": "植物",
                        "oid": "1f4e93d8-07b4-405d-8d3d-84075f2f37e4",
                        "label": "plant",
                        "open": false
                    },
                    {
                        "nameCn": "通信",
                        "oid": "591a2b12-77a6-4a20-8b6f-8557c6912d16",
                        "label": "Communication",
                        "open": false
                    },
                    {
                        "nameCn": "冰",
                        "oid": "2356b4da-f934-4aa4-9888-86dbca54eded",
                        "label": "Ice",
                        "open": false
                    },
                    {
                        "nameCn": "属性集",
                        "oid": "5171bd42-39a8-45ef-b539-952a95760a4e",
                        "label": "Attribute set",
                        "open": false
                    },
                    {
                        "nameCn": "测量",
                        "oid": "96122cd9-4451-4f86-9348-9b470b5c82d4",
                        "label": "measuring",
                        "open": false
                    },
                    {
                        "nameCn": "水文运输",
                        "oid": "1f2e3f7a-9017-40a7-90a9-9c54c7e3fcbe",
                        "label": "Hydrological transport",
                        "open": false
                    },
                    {
                        "nameCn": "水域表面",
                        "oid": "382abdea-6866-43c3-ac3e-9ffe87989794",
                        "label": "Water surface",
                        "open": false
                    },
                    {
                        "nameCn": "水体底板",
                        "oid": "f3d043f1-6316-4569-beb9-a351cf1a1785",
                        "label": "Water floor",
                        "open": false
                    },
                    {
                        "nameCn": "自然地理学",
                        "oid": "5d0cf3a6-4dd7-4e5e-b997-a39a0bdc9b61",
                        "label": "Natural Geography",
                        "open": false
                    },
                    {
                        "nameCn": "表层物质",
                        "oid": "160cef4c-2f2f-4556-8d47-a7156420e0b4",
                        "label": "Surface material",
                        "open": false
                    },
                    {
                        "nameCn": "表层",
                        "oid": "e8c86f24-4ba8-4123-80c9-a75b91d52636",
                        "label": "surface layer",
                        "open": false
                    },
                    {
                        "nameCn": "装备",
                        "oid": "65ec90b0-d881-462a-ba9c-a794c52b5cbc",
                        "label": "equipment",
                        "open": false
                    },
                    {
                        "nameCn": "港口",
                        "oid": "6a8eba6c-648f-4c42-ade6-b3ae72484436",
                        "label": "port",
                        "open": false
                    },
                    {
                        "nameCn": "运输",
                        "oid": "d131bf76-f5f3-4f26-84fb-b3d4d394c34d",
                        "label": "transport",
                        "open": false
                    },
                    {
                        "nameCn": "空间",
                        "oid": "08b00f05-b7b0-41d3-95f6-b6c43d820996",
                        "label": "space",
                        "open": false
                    },
                    {
                        "nameCn": "沿海地区",
                        "oid": "92b64bd2-6332-41ca-9308-b6f4bc5b39b4",
                        "label": "Coastal area",
                        "open": false
                    },
                    {
                        "nameCn": "抽象体",
                        "oid": "54525642-e596-47eb-94ec-ce4b703ad238",
                        "label": "Abstract body",
                        "open": false
                    },
                    {
                        "nameCn": "时间",
                        "oid": "f483dc38-da0e-430f-abfc-d135783b1e3b",
                        "label": "Time",
                        "open": false
                    },
                    {
                        "nameCn": "温度",
                        "oid": "5e364a5b-efd7-4ea0-887c-d271e7c2a264",
                        "label": "Temperature",
                        "open": false
                    },
                    {
                        "nameCn": "大气",
                        "oid": "cb7a25bd-dc36-49b3-aef6-dbdb7e19bc4a",
                        "label": "Atmosphere",
                        "open": false
                    },
                    {
                        "nameCn": "有机体",
                        "oid": "ac254d6c-b070-492d-bc63-e65929208317",
                        "label": "Organism",
                        "open": false
                    },
                    {
                        "nameCn": "用地",
                        "oid": "18fec44c-51e6-4bb3-a7b2-e8c6cc46c483",
                        "label": "Land",
                        "open": false
                    },
                    {
                        "nameCn": "娱乐",
                        "oid": "323dad49-0a05-4054-be84-ea1b52282b4a",
                        "label": "entertainment",
                        "open": false
                    },
                    {
                        "nameCn": "角度测量",
                        "oid": "0fdc4335-1a24-4eab-821a-ec1f1224dcdd",
                        "label": "The Angle measurement",
                        "open": false
                    },
                    {
                        "nameCn": "比率",
                        "oid": "78c8eb93-fe84-4e5e-87db-ef4dd268ec89",
                        "label": "ratio",
                        "open": false
                    },
                    {
                        "nameCn": "电磁现象",
                        "oid": "09ebec51-679f-4f19-be83-f1ce9ca6c9db",
                        "label": "Electromagnetic phenomenon",
                        "open": false
                    },
                    {
                        "nameCn": "基础建设",
                        "oid": "a7bafbe1-4c0f-4f28-8f09-f3d4ec877df8",
                        "label": "Infrastructure",
                        "open": false
                    }]
                },
                {
                    "oid": "8EJMTXTYB0QQ3RX02BV34BGBQXT0ILOL",
                    "label": "Earth System(in Chinese)",
                    children:[
                        {
                            "nameCn": "冰川地质学",
                            "oid": "1d7a0c62-3012-4399-b886-06db3672033b",
                            "label": "Glacial geology",
                            "open": false
                        },
                        {
                            "nameCn": "自然地理学",
                            "oid": "68b6b6fa-c140-474b-90b4-0df1ebfa54b4",
                            "label": "Physical geography",
                            "open": false
                        },
                        {
                            "nameCn": "城市地理学",
                            "oid": "c703668c-7931-47e2-8d72-1d0ea6f41bcd",
                            "label": "Urban geography",
                            "open": false
                        },
                        {
                            "nameCn": "地理信息系统",
                            "oid": "bcc34b38-f605-4093-968b-1f086c2bfd26",
                            "label": "Geographic Information System",
                            "open": false
                        },
                        {
                            "nameCn": "海洋地质学",
                            "oid": "13c689f2-38ac-4b0e-bbc0-2319a9f49c30",
                            "label": "Marine geology",
                            "open": false
                        },
                        {
                            "nameCn": "灾害地理学",
                            "oid": "34011836-c1c5-44d9-89f0-253b0a16c763",
                            "label": "Disaster geography",
                            "open": false
                        },
                        {
                            "nameCn": "遥感学",
                            "oid": "0f6afdb2-0b6c-4cee-808f-26c1f1642ee2",
                            "label": "Remote sensing",
                            "open": false
                        },
                        {
                            "nameCn": "断块构造说",
                            "oid": "4089a7bc-ff4b-4d78-8000-33b771c529ff",
                            "label": "Fault block construction",
                            "open": false
                        },
                        {
                            "nameCn": "多旋回构造说",
                            "oid": "bd060357-d1be-4cca-a281-3879118e4b5c",
                            "label": "Theory of polycycle",
                            "open": false
                        },
                        {
                            "nameCn": "历史地理学",
                            "oid": "2dc3821b-fa51-4e14-8b67-3a10031c502d",
                            "label": "Historical geography",
                            "open": false
                        },
                        {
                            "nameCn": "海洋地理学",
                            "oid": "84fe2988-b81f-4438-bf41-3c018efd8845",
                            "label": "Marine Geography",
                            "open": false
                        },
                        {
                            "nameCn": "地史学地层学",
                            "oid": "4e8c302f-0e5c-4e6b-99b1-3c3e13770c67",
                            "label": "Geostratigraphic stratigraphy",
                            "open": false
                        },
                        {
                            "nameCn": "水文地理学",
                            "oid": "043a4a44-85a6-4bdf-b06f-427550f17958",
                            "label": "Hydrography",
                            "open": false
                        },
                        {
                            "nameCn": "黄土地质学",
                            "oid": "edfabecd-cf6b-4f8d-8e7f-4b0f4c4b11ba",
                            "label": "Geology of loess",
                            "open": false
                        },
                        {
                            "nameCn": "地球概论",
                            "oid": "be1a4800-2264-4f54-9074-4f04328025bd",
                            "label": "Introduction to the Earth",
                            "open": false
                        },
                        {
                            "nameCn": "交通运输地理学",
                            "oid": "36f6a026-1de8-4b58-b007-4f6c0903d3b4",
                            "label": "Transportation geography",
                            "open": false
                        },
                        {
                            "nameCn": "地质力学",
                            "oid": "ce784f6c-3711-4674-8d36-4f6ee9d9f6c1",
                            "label": "Geomechanics",
                            "open": false
                        },
                        {
                            "nameCn": "区域地质学",
                            "oid": "08280971-866c-431b-8513-51dc7391af9d",
                            "label": "Regional geology",
                            "open": false
                        },
                        {
                            "nameCn": "土壤学",
                            "oid": "0dfef883-f42b-4024-b0d5-59056ad4d6aa",
                            "label": "Soil Science",
                            "open": false
                        },
                        {
                            "nameCn": "政治地理学",
                            "oid": "84797bf8-1550-4a7d-98a2-5d1cb4a99053",
                            "label": "Political geography",
                            "open": false
                        },
                        {
                            "nameCn": "社会地理学",
                            "oid": "82c58a79-2a81-40c8-96fe-603bed8b1167",
                            "label": "Social geography",
                            "open": false
                        },
                        {
                            "nameCn": "军事地理学",
                            "oid": "8e502ddd-9b45-498c-8ae5-6550ecf415ba",
                            "label": "Military Geography",
                            "open": false
                        },
                        {
                            "nameCn": "地洼构造说",
                            "oid": "bc87a9dd-7a10-4fe1-ac37-7352b0a591cd",
                            "label": "DIWA structure theory",
                            "open": false
                        },
                        {
                            "nameCn": "化学地理学",
                            "oid": "eb6ec237-a265-4417-b5b7-746d53998d4b",
                            "label": "Chemical geography",
                            "open": false
                        },
                        {
                            "nameCn": "人文、经济地理学",
                            "oid": "4076f83f-838c-4c8b-81a0-7a4ecd9a87ca",
                            "label": "Human and economic geography",
                            "open": false
                        },
                        {
                            "nameCn": "农业地理学与乡村地理学",
                            "oid": "f7f6542a-8496-4b35-8e74-8fda9344d2e9",
                            "label": "Agricultural geography and rural geography",
                            "open": false
                        },
                        {
                            "nameCn": "外动力地质学",
                            "oid": "99468eec-73e2-4893-a742-924faa1a619a",
                            "label": "External dynamic geology",
                            "open": false
                        },
                        {
                            "nameCn": "矿物学",
                            "oid": "f3a52df3-1aa5-441c-ba4f-9642f553ea86",
                            "label": "Mineralogy",
                            "open": false
                        },
                        {
                            "nameCn": "工业地理学",
                            "oid": "d0a7710e-6b42-4420-be58-9a3e695e7865",
                            "label": "Industrial Geography",
                            "open": false
                        },
                        {
                            "nameCn": "沉积学与沉积岩石学",
                            "oid": "646eaf6d-bfb2-49ae-a348-a479a4a143d2",
                            "label": "Sedimentology and sedimentary petrology",
                            "open": false
                        },
                        {
                            "nameCn": "资源与能源地理学",
                            "oid": "9d48148a-571b-4882-8da5-aa7861e399fe",
                            "label": "Resource and energy geography",
                            "open": false
                        },
                        {
                            "nameCn": "商业地理学",
                            "oid": "40faf1b0-1acb-460f-9592-ab724b7e8d2e",
                            "label": "Commercial Geography",
                            "open": false
                        },
                        {
                            "nameCn": "环境地理学",
                            "oid": "8421c148-1e09-43fa-a519-abd080908c30",
                            "label": "Environmental Geography",
                            "open": false
                        },
                        {
                            "nameCn": "地震地质学",
                            "oid": "cfd834cb-6063-427f-b9c8-baa96766984c",
                            "label": "Earthquake geology",
                            "open": false
                        },
                        {
                            "nameCn": "火成岩石学",
                            "oid": "582a0a2d-518c-40d2-837e-bcc316f4ea12",
                            "label": "Igneous petrology",
                            "open": false
                        },
                        {
                            "nameCn": "地质学",
                            "oid": "4a964590-fa3e-4a7f-a737-be78b4ea1a43",
                            "label": "Geology",
                            "open": false
                        },
                        {
                            "nameCn": "地图学与测绘学",
                            "oid": "d2bb45d7-1bc4-4cd1-bbe6-c184bd885ab7",
                            "label": "Cartography and surveying",
                            "open": false
                        },
                        {
                            "nameCn": "人口地理学",
                            "oid": "b31ada6c-a96a-47cf-9679-c410f57436af",
                            "label": "Population geography",
                            "open": false
                        },
                        {
                            "nameCn": "构造运动期(幕)",
                            "oid": "2a4837eb-6a3b-45aa-b52b-cc9085eddcf2",
                            "label": "Tectonic movement",
                            "open": false
                        },
                        {
                            "nameCn": "地貌学",
                            "oid": "21131ddf-baeb-4bb6-a886-cf74d41c1367",
                            "label": "Geomorphology",
                            "open": false
                        },
                        {
                            "nameCn": "变质岩石学",
                            "oid": "a5211f98-1641-493d-ae89-d5ce55ce4734",
                            "label": "Metamorphic petrology",
                            "open": false
                        },
                        {
                            "nameCn": "旅游地理学",
                            "oid": "871cf59b-3cc3-4c10-b5c1-d636186f14c5",
                            "label": "Tourism Geography",
                            "open": false
                        },
                        {
                            "nameCn": "活动构造与新构造学",
                            "oid": "00829155-961a-4b54-bfe2-d99b296b615d",
                            "label": "Active tectonics and neotectonics",
                            "open": false
                        },
                        {
                            "nameCn": "气象气候学",
                            "oid": "e6f27596-bcab-4688-b34b-dff5ce6e8c02",
                            "label": "Meteorological climatology",
                            "open": false
                        },
                        {
                            "nameCn": "医学地理学",
                            "oid": "0a7451cd-8b82-4ac1-848c-e5ba2c4adfc1",
                            "label": "Medical geography",
                            "open": false
                        },
                        {
                            "nameCn": "岩溶地质学",
                            "oid": "e3a98a18-cce2-451d-ae1d-e658c920428e",
                            "label": "Karstology",
                            "open": false
                        },
                        {
                            "nameCn": "古生物学",
                            "oid": "75be31ab-4f9a-429c-a1f9-ed79eb3e39cb",
                            "label": "Paleontology",
                            "open": false
                        },
                        {
                            "nameCn": "火山地质学",
                            "oid": "e9f5d7ec-ad92-4ce0-afc9-ef1ee2cc81b1",
                            "label": "Volcanic geology",
                            "open": false
                        },
                        {
                            "nameCn": "古人类学",
                            "oid": "f4ac48a4-9735-4e54-8690-f775d2e4ad32",
                            "label": "Ancient anthropology",
                            "open": false
                        },
                        {
                            "nameCn": "第四纪地质学",
                            "oid": "a3054d71-ec1f-43c8-b537-fb3c30ede0ac",
                            "label": "Quaternary Geology",
                            "open": false
                        },
                        {
                            "nameCn": "古地理学",
                            "oid": "31ab1e9b-e396-4aae-9861-fc4aa432d790",
                            "label": "Palaeogeography",
                            "open": false
                        },
                        {
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

            sortTypeName:"View Count",
            sortFieldName:"viewCount",
            sortOrder:"Desc.",
        }
    },
    methods: {

        //显示功能引导框
        showDriver(){
            if(!this.driver){
                this.driver = new Driver({
                    "className": "scope-class",
                    "allowClose": false,
                    "opacity" : 0.1,
                    "prevBtnText": "Previous",
                    "nextBtnText": "Next"
                });
                this.stepsConfig = [
                    {
                        "element" : ".categoryList",
                        "popover" : {
                            "title" : "Repository Collections",
                            "description" : "You can query concepts & semantics by choosing a collection.",
                            "position" : "right-center",
                        }
                    },
                    {
                        "element": ".searcherInputPanel",
                        "popover": {
                            "title": "Search",
                            "description": "You can also search concepts & semantics by name.",
                            "position": "bottom-right",
                        }
                    },
                    {
                        "element": ".modelPanel",
                        "popover": {
                            "title": "Overview",
                            "description": "Here is query result, you can browse concepts & semantics' overview. Click name to check detail.",
                            "position": "top",
                        }
                    },
                    {
                        "element" : "#contributeBtn",
                        "popover" : {
                            "title" : "Contribute",
                            "description" : "You can share concepts & semantics on OpenGMS, and get a OpenGMS unique identifier!",
                            "position" : "bottom",
                        }
                    }
                ];
            }

            if(document.body.clientWidth < 1000){
                this.stepsConfig[1].popover.position = "top";
            }
            this.driver.defineSteps(this.stepsConfig);
            this.driver.start();
        },

        changeSortField(ele){
            this.sortTypeName = ele;
            let field = ele.replace(" ","").replace(ele[0],ele[0].toLowerCase());
            this.sortFieldName = field;
            this.getModels();
        },

        changeSortOrder(ele){
            this.sortOrder=ele;

            this.pageOption.sortAsc = ele==="Asc.";

            this.getModels();
        },
        contribute(){
            $.ajax({
                url: '/user/load',
                type: 'get',
                // data对象中的属性名要和服务端控制器的参数名一致 login(name, password)
                // dataType : 'json',
                success: function (result) {
                    var json = result;
                    if (json.oid != '') {
                        window.location.href="/user/userSpace#/community/createConcept";
                    }
                    else{
                        window.location.href="/user/login";
                    }
                },
                error: function (e) {
                    alert("load user error");
                }
            });
        },
        search() {
            this.pageOption.currentPage = 1;
            this.getModels();
        },
        //页码change
        handlePageChange(val) {

            this.pageOption.currentPage = val;

            window.scrollTo(0, 0);
            this.getModels();
        },
        handleCurrentChange(data, checked, indeterminate) {
            // this.pageOption.searchResult=[];
            this.pageOption.total=0;
            this.pageOption.paginationShow=false;
            this.currentClass=data.label;
            let classes = [];
            classes.push(data.oid);
            this.classifications1 = classes;
            this.getChildren(data.children)
            this.pageOption.currentPage=1;
            this.searchText="";
            this.getModels();
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
        handleCheckChange(data, checked, indeterminate) {
            // this.pageOption.searchResult=[];
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
        getModels() {
            this.pageOption.progressBar = true;
            var data = {
                asc: this.pageOption.sortAsc,
                page: this.pageOption.currentPage - 1,
                pageSize: this.pageOption.pageSize,
                searchText : this.searchText,
                classifications : this.classifications1.length == 0 ? ["all"] : this.classifications1

            };
            this.Query(data, this.queryType);
        },
        Query(data, type) {
            let query={ };
            query.oid=data.classifications[0];
            query.page=data.page;
            query.sortField= this.sortFieldName;
            if(data.asc){
                query.asc= 1;
            }else{
                query.asc = 0;
            }
            query.searchText=data.searchText;

            let url="";
            if(query.searchText.trim()==""){
                url="/repository/getConceptList";
            }
            else{
                url="/repository/searchConcept";
                this.classifications1=[""];
                this.currentClass="ALL";
                this.$refs.tree1.setCurrentKey(null);
            }

            let sendDate = (new Date()).getTime();
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(query),
                async: true,
                contentType: "application/json",
                success: (json) => {
                    if (json.code == 0) {
                        let data = json.data;
                        let receiveDate = (new Date()).getTime();
                        let responseTimeMs = receiveDate - sendDate;
                        let timeoutTime=0;
                        console.log(responseTimeMs)
                        if(responseTimeMs<450){
                            timeoutTime=450-responseTimeMs;
                        }
                        setTimeout(() => {
                            this.pageOption.total = data.total;
                            // this.pageOption.pages = data.pages;
                            this.pageOption.searchResult = data.list;
                            this.pageOption.users = data.users;
                            this.pageOption.progressBar = false;
                            this.pageOption.paginationShow=true;
                        }, timeoutTime);
                    }
                    else {
                        console.log("query error!")
                    }
                }
            })
        },
    },
    mounted() {

        this.getModels();

        //expend
        $("#expend").click(() => {
            this.queryType = "advanced";
            $(".searcherPanel").css("display", "none");
            $(".advancedSearch").css("display", "block");
            $("#tree1").css("display", "none");
            $("#tree2").css("display", "block");
            this.getModels();
        })
        $("#drawback").click(() => {
            this.queryType = "normal";
            $(".searcherPanel").css("display", "block");
            $(".advancedSearch").css("display", "none");
            $("#tree2").css("display", "none");
            $("#tree1").css("display", "block");
            this.getModels();
        })

        //field select
        $(document).on("click", ".propName", function () {
            var downArrow = "<span class=\"caret\"></span>";
            $(this).parents(".input-group-btn").children("button").html($(this).text() + downArrow);
        })

        //add
        $(".fa-plus").click(function () {

            var field;
            var lineCount = $(".lines").children(".line").length;
            switch (lineCount) {
                case 1:
                    field = "Keyword";
                    break;
                case 2:
                    field = "Overview";
                    break;
                case 3:
                    field = "Description";
                    break;
                case 4:
                    field = "Provider";
                    break;
                case 5:
                    field = "Reference";
                    break;
            }

            var line = "<div class=\"line\">\n" +
                "                                <div class=\"input-group col-md-1 pull-left\">\n" +
                "                                    <select class=\"form-control connect\">\n" +
                "                                        <option>AND</option>\n" +
                "                                        <option>OR</option>\n" +
                "                                        <option>NOT</option>\n" +
                "                                    </select>\n" +
                "                                </div>\n" +
                "                                <div class=\"input-group col-md-5 pull-left\">\n" +
                "                                    <div class=\"input-group-btn\">\n" +
                "                                        <button type=\"button\" class=\"btn btn-default dropdown-toggle prop\"\n" +
                "                                                data-toggle=\"dropdown\">" + field + "<span class=\"caret\"></span></button>\n" +
                "                                        <ul class=\"dropdown-menu\">\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Model Name</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Keyword</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Overview</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Description</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Provider</a></li>\n" +
                "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Reference</a></li>\n" +
                "                                        </ul>\n" +
                "                                    </div>\n" +
                "                                    <input type=\"text\" class=\"form-control value\">\n" +
                "                                </div>\n" +
                "                                <div class=\"input-group col-md-1 pull-left\">\n" +
                "                                    <select class=\"form-control connect\">\n" +
                "                                        <option>AND</option>\n" +
                "                                        <option>OR</option>\n" +
                "                                        <option>NOT</option>\n" +
                "                                    </select>\n" +
                "                                </div>\n" +
                "                                <div class=\"input-group col-md-5 pull-left\">\n" +
                // "                                    <div class=\"input-group-btn\">\n" +
                // "                                        <button type=\"button\" class=\"btn btn-default dropdown-toggle prop\"\n" +
                // "                                                data-toggle=\"dropdown\">\n" +
                // "                                            "+field+"<span class=\"caret\"></span></button>\n" +
                // "                                        <ul class=\"dropdown-menu\">\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Model Name</a></li>\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Keyword</a></li>\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Overview</a></li>\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Description</a></li>\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Provider</a></li>\n" +
                // "                                            <li><a class=\"propName\" href=\"javascript:void(0);\">Reference</a></li>\n" +
                // "                                        </ul>\n" +
                // "                                    </div>\n" +
                "                                    <input type=\"text\" class=\"form-control value\">\n" +
                "                                </div>\n" +
                "                            </div>";

            if (lineCount <= 5) {
                $(".lines").append(line)
            }
        })
        //delete
        $(".fa-minus").click(function () {
            var lines = $(".lines").children(".line");
            if (lines.length > 1) {
                lines.eq(lines.length - 1).remove();
            }
        })

        if(document.cookie.indexOf("communityRep=1")==-1){
            this.showDriver();
            var t=new Date(new Date().getTime()+1000*60*60*24*60);
            document.cookie="communityRep=1; expires="+t.toGMTString();
        }
    }
})