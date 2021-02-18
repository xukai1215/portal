const sectionData = [{"label": "1 Config the process of integrated task", "children": []}, {
    "label": "2 Load data of each model and data method",
    "children": []
}, {
    "label": "3 Execute the integrated task",
    "children": []
}]

const supportDoc = [{
    "title": "1 Config the process of integrated task",
    "content": "<p>In this demo, we will show you how to run a integrated task online in OpenGMS.</p>\n" +
        "<p>First, you should log in , then you can <a href='http://geomodeling.njnu.edu.cn/computableModel/integratedModel'>click here</a>  , or click the quick card in model application and user space to open the integrated modeling page. </p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image001.jpg\" ></p>\n" +
        "<p>Click the block ‘Start’ to identify the start of the task.</p>\n" +
        "<p>Click the button ‘Select Model’ to select the computable model you want add into a integrated task.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image002.jpg\" ></p>\n" +
        "<p>Click button to add the model into task. In this demo, First add the model ‘TAUDEM – Pit remove’.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image003.jpg\" ></p>\n" +
        "<p>Inputs and outputs of this model will be shown in the data bus behind the graph.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image004.jpg\" ></p>\n" +
        "<p>Also you can click button ‘Select Data Method’ to add a data method. In this demo, we select the method ‘Tiffclip’ to processing the data for the model to use.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image005.jpg\" ></p>\n"+
        "<p>Click the cell in the graph, all the cell of inputs and outputs will be shown in right sidebar.Drag them into graph. We want the model ‘Tandem – Pit Remove’ to use the output of the data method ‘Tiffclip’, so link the data cell of them.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image006.jpg\" ></p>\n"+
        "<p>Then we add more models into the task. And link the output and input of them.</p>\n" +
        "<p>These models are the following:</p>\n" +
        "<p>‘TAUDEM- D-Infinity Flow Direction’,’TAUDEM - D8 Contributing Area’,’ TauDEM_D8FlowDir’, ‘TAUDEM - D-Infinity Contributing Area’,’TAUDEM - Slope Area Combination’,’TAUDEM - D8 Extreme Upslope Value’,’ Stream Definition By Threshold’,’ TauDEM - StreamNet’. </p>\n" +
        "<p>And the data links are linked as the following picture.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image007.png\" ></p>\n"
}, {
    "title": "2 Load data of each model and data method",
    "content": "<p>Scroll to the data bus, click the button ‘config’:</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image008.png\" ></p>\n" +
        "<p>or click the data cell in the graph, click the button ‘config’ in the right sidebar.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image009.jpg\" ></p>\n" +
        "<p>The data config dialog will be shown:</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image010.jpg\" ></p>\n" +
        "<p>Click the button <span><img src=\"/static/img/demo/demo2/image011.jpg\" ></span> to load data. Or you can click the button in the panel ‘Current Action’, to config all the data of one action.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image012.jpg\" ></p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image013.jpg\" ></p>\n" +
        "<p>The data used in this demo will be show in a table following.</p>\n" +
        "<table align=\"center\" class=MsoTableGrid border=1 cellspacing=0 cellpadding=0\n" +
        " style='border-collapse:collapse;border:none'>\n" +
        " <tr style='height:1.5pt'>\n" +
        "  <td width=297 valign=top style='width:222.8pt;border:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt;height:1.5pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>Action name</span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border:solid windowtext 1.0pt;\n" +
        "  border-left:none;padding:0cm 5.4pt 0cm 5.4pt;height:1.5pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>Input name</span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border:solid windowtext 1.0pt;\n" +
        "  border-left:none;padding:0cm 5.4pt 0cm 5.4pt;height:1.5pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>Input Data</span></p>\n" +
        "  <p class=MsoNormal><span lang=EN-US style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr style='height:1.5pt'>\n" +
        "  <td width=297 rowspan=6 valign=top style='width:222.8pt;border:solid windowtext 1.0pt;\n" +
        "  border-top:none;padding:0cm 5.4pt 0cm 5.4pt;height:1.5pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>Tiffclip</span></p>\n" +
        "  </td>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt;height:1.5pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>AOICilp.shp</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt;height:1.5pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/95c5cccf-8461-4281-a53d-cc8fcc270894'>http://221.226.60.2:8082/data/95c5cccf-8461-4281-a53d-cc8fcc270894</a></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>AOICilp.dbf</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/b328ce74-2197-43b7-930f-238043308e30'>http://221.226.60.2:8082/data/b328ce74-2197-43b7-930f-238043308e30</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>AOICilp.sbn</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/113956c7-9d56-4261-81b1-66b6640a7714'>http://221.226.60.2:8082/data/113956c7-9d56-4261-81b1-66b6640a7714</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>AOICilp.sbx</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/7e0d5ab0-5820-4eb1-992f-7755cea0ca6e'>http://221.226.60.2:8082/data/7e0d5ab0-5820-4eb1-992f-7755cea0ca6e</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>AOICilp.shx</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/6aaec736-d700-417d-91fe-250154bf41b2'>http://221.226.60.2:8082/data/6aaec736-d700-417d-91fe-250154bf41b2</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>Afghanistan.tif</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/f927c2d2-9b81-4120-8bb3-24b348f80c10'>http://221.226.60.2:8082/data/f927c2d2-9b81-4120-8bb3-24b348f80c10</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=297 rowspan=2 valign=top style='width:222.8pt;border:solid windowtext 1.0pt;\n" +
        "  border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>TAUDEM - D8 Contributing Area</span></p>\n" +
        "  </td>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>Outlets</span></span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/385b4459-8b3b-43df-b921-d262d3704e70'>http://221.226.60.2:8082/data/385b4459-8b3b-43df-b921-d262d3704e70</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>WeightGrid</span></span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/ca0fc392-4666-487f-919b-17fd9dc74a71'>http://221.226.60.2:8082/data/ca0fc392-4666-487f-919b-17fd9dc74a71</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=297 valign=top style='width:222.8pt;border:solid windowtext 1.0pt;\n" +
        "  border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>TAUDEM - D-Infinity Contributing Area</span></span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>Outlets</span></span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/d8542bf4-c809-48b2-a856-44f72883f9bf'>http://221.226.60.2:8082/data/d8542bf4-c809-48b2-a856-44f72883f9bf</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=297 valign=top style='width:222.8pt;border:solid windowtext 1.0pt;\n" +
        "  border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>TAUDEM - Slope Area Combination</span></span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>Input Suffixes</span></span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/3f7e1c60-0463-42c7-b0e7-613b35186d88'>http://221.226.60.2:8082/data/3f7e1c60-0463-42c7-b0e7-613b35186d88</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=297 rowspan=2 valign=top style='width:222.8pt;border:solid windowtext 1.0pt;\n" +
        "  border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 width=283\n" +
        "   style='width:212.0pt;border-collapse:collapse'>\n" +
        "   <tr style='height:15.6pt'>\n" +
        "    <td width=283 nowrap rowspan=2 style='width:212.0pt;padding:0cm 5.4pt 0cm 5.4pt;\n" +
        "    height:15.6pt'>\n" +
        "    <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "    style='font-size:11.0pt;color:black'>TAUDEM - D8 Extreme Upslope Value</span></p>\n" +
        "    </td>\n" +
        "    <td style='height:15.6pt;border:none' width=0 height=21></td>\n" +
        "   </tr>\n" +
        "   <tr style='height:15.6pt'>\n" +
        "    <span lang=EN-US style='font-size:11.0pt;font-family:����;color:black'>\n" +
        "    <td style='height:15.6pt;border:none' width=0 height=21></td>\n" +
        "    </span>\n" +
        "   </tr>\n" +
        "  </table>\n" +
        "  <p class=MsoNormal></p>\n" +
        "  </td>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal><span lang=EN-US style='font-size:11.0pt;color:black'>D8FlowDirection</span></span></p>\n" +
        "  <p class=MsoNormal><span lang=EN-US style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal><span lang=EN-US style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/22c9c545-d17c-4a9a-84ca-68bc9465db26'>http://221.226.60.2:8082/data/22c9c545-d17c-4a9a-84ca-68bc9465db26</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>Outlets</span></span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/278e7ae4-3e55-4616-a42f-e4c4b03fda50'>http://221.226.60.2:8082/data/278e7ae4-3e55-4616-a42f-e4c4b03fda50</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=297 valign=top style='width:222.8pt;border:solid windowtext 1.0pt;\n" +
        "  border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>Stream Definition By Threshold</span></span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>ThresholdValue</span></span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/a4d556e6-f30c-4d4b-ac80-254dcd1f372c'>http://221.226.60.2:8082/data/a4d556e6-f30c-4d4b-ac80-254dcd1f372c</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        " <tr>\n" +
        "  <td width=297 valign=top style='width:222.8pt;border:solid windowtext 1.0pt;\n" +
        "  border-top:none;padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>TauDEM - StreamNet</span></span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=118 valign=top style='width:88.55pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>PitRemove</span></span></p>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'>&nbsp;</span></p>\n" +
        "  </td>\n" +
        "  <td width=277 valign=top style='width:207.4pt;border-top:none;border-left:\n" +
        "  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;\n" +
        "  padding:0cm 5.4pt 0cm 5.4pt'>\n" +
        "  <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US\n" +
        "  style='font-size:11.0pt;color:black'><a href='http://221.226.60.2:8082/data/a0633329-55f0-4a87-8399-0e65503fad65'>http://221.226.60.2:8082/data/a0633329-55f0-4a87-8399-0e65503fad65</a></span></span></p>\n" +
        "  </td>\n" +
        " </tr>\n" +
        "</table>\n"
}, {
    "title": "3 Execute the integrated task",
    "content": "<p>Now, after loading all the data required, click the block ‘end’ to identify the end of this task. We can click the button ‘Execute’ to config the base info of this task, then execute it.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image013.jpg\" ></p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image014.png\" ></p>\n" +
        "<p>Completed action will turn to green, Running action will turn to yellow in the graph.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image015.jpg\" ></p>\n" +
        "<p>When all the action cells turn to green, we run the task successful.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image016.png\" ></p>\n" +
        "<p>The output of one data can be downloaded by click the button in the data bus, once an action is completed, the outputs of it can be downloaded.</p>\n" +
        "<p align=\"center\"><img src=\"/static/img/demo/demo2/image017.png\" ></p>\n" +
        "<p>And all your integrated tasks can be checked in your space.</p>\n" +
        "<p align=\"center\" width='502'><img src=\"/static/img/demo/demo2/image018.png\" ></p>\n"
}]