package njgis.opengms.portal.utils;

import com.github.abel533.echarts.axis.CategoryAxis;
import com.github.abel533.echarts.axis.ValueAxis;
import com.github.abel533.echarts.code.Magic;
import com.github.abel533.echarts.code.Orient;
import com.github.abel533.echarts.code.Tool;
import com.github.abel533.echarts.code.Trigger;
import com.github.abel533.echarts.feature.MagicType;
import com.github.abel533.echarts.json.GsonOption;
import com.github.abel533.echarts.series.Bar;
import com.github.abel533.echarts.series.EMap;
import com.github.abel533.echarts.series.Line;
import com.github.abel533.echarts.series.Pie;
import com.github.abel533.echarts.style.ItemStyle;
import com.github.abel533.echarts.style.itemstyle.Normal;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import njgis.opengms.portal.utils.Object.ChartOption;
import org.springframework.stereotype.Component;
import org.springframework.util.ClassUtils;

import java.io.*;
import java.util.*;

@Slf4j
@Component
public class ChartUtils {

    private static String resourcePath = PropertyUtils.getProperty("resourcePath");

    private static String phantomjs = PropertyUtils.getProperty("phantomjs");

    private static final String JSpath = ClassUtils.getDefaultClassLoader().getResource("static/").getPath().substring(1)+"echarts-convert/echarts-convert1.js";

    public static void main(String[] args) {
////        String optiona = "{\"title\":{\"text\":\"电流图\",\"subtext\":\"电流图\",\"x\":\"left\"},\"toolbox\":{\"feature\":{\"saveAsImage\":{\"show\":true,\"title\":\"保存为图片\",\"type\":\"png\",\"lang\":[\"点击保存\"]}},\"show\":true},\"tooltip\":{\"trigger\":\"axis\"},\"legend\":{\"data\":[\"邮件营销\",\"联盟广告\",\"视频广告\"]},\"xAxis\":[{\"type\":\"category\",\"boundaryGap\":false,\"data\":[\"周一\",\"周二\",\"周三\",\"周四\",\"周五\",\"周六\",\"周日\"]}],\"yAxis\":[{\"type\":\"value\"}],\"series\":[{\"name\":\"邮件营销\",\"type\":\"line\",\"stack\":\"总量\",\"data\":[120,132,101,134,90,230,210]},{\"name\":\"联盟广告\",\"type\":\"line\",\"stack\":\"总量\",\"data\":[220,182,191,234,290,330,310]},{\"name\":\"视频广告\",\"type\":\"line\",\"stack\":\"总量\",\"data\":[150,232,201,154,190,330,410]}]}";
//        String optiona = generateLine();
//        Map<String,Object> resultMap=new HashMap<>();
//
//        generateEChart(optiona);

    }

    public static String generateEChart(String options) {
        String name=UUID.randomUUID().toString().substring(0, 8);
        String dataPath = writeFile(options,name);
        String fileName = name + ".png";
        String path = resourcePath+"/chart/image/"+fileName;
        try {
            File file = new File(path);     //文件路径（路径+文件名）
            if (!file.exists()) {   //文件不存在则创建文件，先创建目录
                File dir = new File(file.getParent());
                dir.mkdirs();
                file.createNewFile();
            }

            String cmd = phantomjs + " " + JSpath + " -infile " + dataPath + " -outfile " + path;
            System.out.println(cmd);
            Process process = Runtime.getRuntime().exec(cmd);
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line = "";
            while ((line = input.readLine()) != null) {
                log.info(line);
            }
            input.close();
            System.out.println(ClassUtils.getDefaultClassLoader().getResource("").getPath());

        } catch (IOException e) {
            e.printStackTrace();
        }finally{
            return path;
        }
    }

    public static String writeFile(String options,String name) {
        String dataPath=resourcePath+"/chart/json/"+ name +".json";
        try {
            /* 写入Txt文件 */
            File writename = new File(dataPath); // 相对路径，如果没有则要建立一个新的output.txt文件
            if (!writename.exists()) {   //文件不存在则创建文件，先创建目录
                File dir = new File(writename.getParent());
                dir.mkdirs();
                writename.createNewFile(); // 创建新文件
            }
            BufferedWriter out = new BufferedWriter(new FileWriter(writename));
            out.write(options); // \r\n即为换行
            out.flush(); // 把缓存区内容压入文件
            out.close(); // 最后记得关闭文件
        } catch (IOException e) {
            e.printStackTrace();
        }
        return dataPath;
    }

    /**
     * 柱状图
     *
     */
    public static String generateBar(ChartOption chartOption, int barType) {
        String[] types = chartOption.getTypes();//{ "广州", "深圳", "珠海", "汕头", "韶关", "佛山" };
        int[][] datas = chartOption.getData();//{ 6030, 7800, 5200, 3444, 2666, 5708 };
        String[] colors = { "#ff7c7c", "#feb64d", "#5bc49f", "#32d3eb", "#60acfc"};
        String title = chartOption.getTitle();//"地市数据";

        GsonOption option = new GsonOption();

        option.title().text(chartOption.getTitle()).subtext(chartOption.getSubTitle()).x(chartOption.getTitlePosition()).y("90%").textStyle().fontSize(24); // 标题
        // 工具栏
        option.toolbox().show(false).feature(Tool.mark, // 辅助线
                Tool.dataView, // 数据视图
                new MagicType(Magic.line, Magic.bar),// 线图、柱状图切换
                Tool.restore,// 还原
                Tool.saveAsImage);// 保存为图片

        option.tooltip().show(true).formatter("{a} <br/>{b} : {c}");//显示工具提示,设置提示格式
        option.grid().height("75%").width("96%").x("2%").y("8%");
        option.legend().data(types).textStyle().fontSize(20);// 图例


        CategoryAxis category = new CategoryAxis();// 轴分类
        category.data(chartOption.getValXis());// 轴数据类别
        category.setBoundaryGap(true);
        category.axisLabel().setInterval(0);

        if(barType == 1) {
            // 循环数据
            for (int i = 0; i < datas.length; i++) {
                Bar bar = new Bar();
                String type = types[i];
                bar.name(type);//.stack("总量");
                for (int j = 0; j < datas[0].length; j++)
                    bar.data(datas[i][j]);
                option.series().add(bar);

            }
        }else {

            // 循环数据
            Bar bar = new Bar(title);// 图类别(柱状图)
            bar.barWidth(100);
            for (int i = 0; i < types.length; i++) {
                int data = datas[0][i];
                String color = colors[i];
                // 类目对应的柱状图
                Map<String, Object> map = new HashMap<String, Object>(2);
                map.put("value", data);
                map.put("itemStyle", new ItemStyle().normal(new Normal().color(color)));
                bar.data(map);
            }
            option.series(bar);
        }


        option.xAxis(category);// x轴
        option.yAxis(new ValueAxis());// y轴


        return generateEChart(new Gson().toJson(option));
    }

    /**
     *  折线图
     */
    public static String generateLine(ChartOption chartOption) {
        String[] types = chartOption.getTypes();//{ "邮件营销"};
        int[][] datas = chartOption.getData();//{ { 120, 132, 101, 134, 90, 230, 210 } };
//        String title = "";
//        String[] valXis={"周一", "周二", "周三", "周四", "周五", "周六", "周日"};

        GsonOption option = new GsonOption();

        option.title().text(chartOption.getTitle()).subtext(chartOption.getSubTitle()).x(chartOption.getTitlePosition()).y("90%").textStyle().fontSize(24);// 大标题、小标题、位置

        // 提示工具
        option.tooltip().trigger(Trigger.axis);// 在轴上触发提示数据
        // 工具栏
//        option.toolbox().show(true).feature(Tool.saveAsImage);// 显示保存为图片
        option.grid().height("75%").width("95%").x("2.5%").y("8%");
        option.legend().data(types).textStyle().fontSize(20);// 图例

        CategoryAxis category = new CategoryAxis();// 轴分类
        category.data(chartOption.getValXis());
        category.boundaryGap(true);// 起始和结束两端空白策略

        // 循环数据
        for (int i = 0; i < datas.length; i++) {
            Line line = new Line();// 三条线，三个对象
            String type = types[i];
            line.name(type);//.stack("总量");
            for (int j = 0; j < datas[0].length; j++)
                line.data(datas[i][j]);
            option.series().add(line);
        }

        option.xAxis(category);// x轴
        option.yAxis(new ValueAxis());// y轴

        return generateEChart(new Gson().toJson(option));

//        if (isHorizontal) {// 横轴为类别、纵轴为值
//            option.xAxis(category);// x轴
//            option.yAxis(new ValueAxis());// y轴
//        } else {// 横轴为值、纵轴为类别
//            option.xAxis(new ValueAxis());// x轴
//            option.yAxis(category);// y轴
//        }

    }

    public static String generateMap(List<String> countries, List<Integer> counts){

        GsonOption option = new GsonOption();
        option.backgroundColor("transparent");
        option.title().text("Locations of Viewers and Invokes").x("center").y("90%").textStyle().fontSize(30);
        option.dataRange().show(true).y(300).calculable(true).min(0).max(20).color(Arrays.asList("#e42515","#fad3d0")).text(Arrays.asList("High","Low"));
//        option.legend().show(true);

        EMap eMap = new EMap();
//        eMap.setName("Viewers' Location");
        eMap.setRoam(false);
        eMap.setMapType("world");
        ItemStyle itemStyle =new ItemStyle();
        itemStyle.normal().label().setShow(false);
        eMap.setItemStyle(itemStyle);


        for(int i=0;i<countries.size();i++){
            Map<String, Object> map = new HashMap<String, Object>(2);
            map.put("name",countries.get(i));
            map.put("value",counts.get(i));
            eMap.data(map);
        }

        option.series(eMap);


        return generateEChart(new Gson().toJson(option));
    }

    /**
     *  饼图
     */
    public static String generatePie(ChartOption chartOption,String radius,String center_x,String center_y,String legend_y) {
        String[] types = chartOption.getTypes();//{ "邮件营销", "联盟广告", "视频广告" };
        int[] datas = chartOption.getData()[0];//{ 120, 132, 101 };
        String title = chartOption.getTitle();//"广告数据";
        GsonOption option = new GsonOption();

        option.title().text(title).subtext(chartOption.getSubTitle()).x(chartOption.getTitlePosition()).y("90%").textStyle().fontSize(24);// 大标题、小标题、标题位置

        // 提示工具 鼠标在每一个数据项上，触发显示提示数据
        option.tooltip().trigger(Trigger.item).formatter("{a} <br/>{b} : {c} ({d}%)");

        // 工具栏
//        option.toolbox().show(true).feature(new Mark().show(true),// 辅助线
//                new DataView().show(true).readOnly(false),// 数据视图
//                new MagicType().show(true).type(new Magic[] { Magic.pie, Magic.funnel }), //饼图、漏斗图切换
//                new Option().series(new Funnel().x("25%").width("50%").funnelAlign(X.left).max(1548)),// 漏斗图设置
//                Tool.restore,// 还原
//                Tool.saveAsImage);// 保存为图片

        option.legend().orient(Orient.vertical).x("left").y(legend_y).data(types).textStyle().fontSize(20);// 图例及位置

        option.calculable(true);// 拖动进行计算

        Pie pie = new Pie();

        // 标题、半径、位置
        pie.name(title).radius(radius).center(center_x, center_y);

        // 循环数据
        for (int i = 0; i < types.length; i++) {
            Map<String, Object> map = new HashMap<String, Object>(2);
            map.put("value", datas[i]);
            map.put("name", types[i]);
            pie.data(map);
        }

        option.series(pie);

        return generateEChart(new Gson().toJson(option));
    }

}
