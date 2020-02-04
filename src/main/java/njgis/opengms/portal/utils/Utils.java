package njgis.opengms.portal.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.BASE64Decoder;

import javax.servlet.http.HttpSession;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class Utils {

    static int count=0;

    public static class Method {
        public static String POST = "POST";
        public static String GET = "GET";
    }

    public static String checkLoginStatus(HttpSession httpSession){

        Object object=httpSession.getAttribute("uid");
        if(object==null){
            return null;
        }
        else{
            return object.toString();
        }

    }

    public static JSONObject postJSON(String urlStr, JSONObject jsonParam) {
        try {

            //System.out.println(obj);
            // 创建url资源
            URL url = new URL(urlStr);
            // 建立http连接
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            // 设置允许输出
            conn.setDoOutput(true);

            conn.setDoInput(true);

            // 设置不用缓存
            conn.setUseCaches(false);
            // 设置传递方式
            conn.setRequestMethod("POST");
            // 设置维持长连接
            conn.setRequestProperty("Connection", "Keep-Alive");
            // 设置文件字符集:
            conn.setRequestProperty("Charset", "UTF-8");
            //转换为字节数组
            byte[] data = (jsonParam.toJSONString()).getBytes();

            // 设置文件长度
            conn.setRequestProperty("Content-Length", String.valueOf(data.length));

            // 设置文件类型:
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");


            // 开始连接请求
            conn.connect();
            OutputStream out = conn.getOutputStream();
            // 写入请求的字符串
            out.write(data);
            out.flush();
            out.close();

            System.out.println(conn.getResponseCode());
            System.out.println(conn.getResponseMessage());

            // 请求返回的状态
            if (conn.getResponseCode() == 200) {
                System.out.println("连接成功");
                // 请求返回的数据
                InputStream in = conn.getInputStream();
                String a = null;
                try {
                    byte[] data1 = new byte[in.available()];
                    in.read(data1);
                    // 转成字符串
                    a = new String(data1);
                    System.out.println(a);
                    return JSONObject.parseObject(a);
                } catch (Exception e1) {
                    // TODO Auto-generated catch block
                    e1.printStackTrace();
                    return null;
                }
            } else {
                System.out.println("no++");
                return null;
            }

        } catch (Exception e) {
            System.out.println(e);
            return null;
        }

    }

    public static JSONObject connentURL(String method, String urlStr) {
        try {
            URL url = new URL(urlStr);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod(method);
            connection.setConnectTimeout(3000);
            connection.connect();
            // 取得输入流，并使用Reader读取
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));//设置编码,否则中文乱码
            String lines = "";
            String strResponse = "";
            while ((lines = reader.readLine()) != null) {
                strResponse += lines;
            }
            JSONObject jsonResponse = JSONObject.parseObject(strResponse);

            reader.close();

            connection.disconnect();

            return jsonResponse;


        } catch (MalformedURLException e) {
            e.printStackTrace();
            return null;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

    }

    public static List<String> saveFiles(List<MultipartFile> files, String path, String uid, String suffix,List<String> result) {
        new File(path).mkdirs();


        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            fileName = "/" + uid + "/" + new Date().getTime() + "_" + fileName;
            result.add(suffix + fileName);
            int size = (int) file.getSize();
            System.out.println(fileName + "-->" + size);

            if (file.isEmpty()) {
                continue;
            } else {
                File dest = new File(path + "/" + fileName);
                if (!dest.getParentFile().exists()) { // 判断文件父目录是否存在
                    dest.getParentFile().mkdir();
                }
                try {
                    file.transferTo(dest);
                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                    return null;
                }
            }
        }
        return result;
    }


    /**
     * 根据路径删除指定的目录或文件，无论存在与否
     *
     * @param sPath 要删除的目录或文件
     * @return 删除成功返回 true，否则返回 false。
     */
    public static boolean delete(String sPath) {
        boolean flag = false;
        File file = new File(sPath);
        // 判断目录或文件是否存在
        if (!file.exists()) {  // 不存在返回 false
            return flag;
        } else {
            // 判断是否为文件
            if (file.isFile()) {  // 为文件时调用删除文件方法
                return deleteFile(sPath);
            } else {  // 为目录时调用删除目录方法
                return deleteDirectory(sPath);
            }
        }
    }

    /**
     * 删除单个文件
     *
     * @param sPath 被删除文件的文件名
     * @return 单个文件删除成功返回true，否则返回false
     */
    public static boolean deleteFile(String sPath) {
        Boolean flag = false;
        File file = new File(sPath);
        // 路径为文件且不为空则进行删除
        if (file.isFile() && file.exists()) {
            file.delete();
            flag = true;
        }
        return flag;
    }

    /**
     * 删除目录（文件夹）以及目录下的文件
     *
     * @param sPath 被删除目录的文件路径
     * @return 目录删除成功返回true，否则返回false
     */
    public static boolean deleteDirectory(String sPath) {
        //如果sPath不以文件分隔符结尾，自动添加文件分隔符
        if (!sPath.endsWith(File.separator)) {
            sPath = sPath + File.separator;
        }
        File dirFile = new File(sPath);
        //如果dir对应的文件不存在，或者不是一个目录，则退出
        if (!dirFile.exists() || !dirFile.isDirectory()) {
            return false;
        }
        boolean flag = true;
        //删除文件夹下的所有文件(包括子目录)
        File[] files = dirFile.listFiles();
        for (int i = files.length - 1; i >= 0; i--) {
            //删除子文件
            if (files[i].isFile()) {
                flag = deleteFile(files[i].getAbsolutePath());
                if (!flag) break;
            } //删除子目录
            else {
                flag = deleteDirectory(files[i].getAbsolutePath());
                if (!flag) break;
            }
        }
        if (!flag) return false;
        //删除当前目录
        if (dirFile.delete()) {
            return true;
        } else {
            return false;
        }
    }

    public static JSONObject convertMdl(String mdl) {
        JSONObject mdlObj = new JSONObject();
        try {
            Document mdlDoc = DocumentHelper.parseText(mdl);
            Element rootElement = mdlDoc.getRootElement();
            mdlObj.put("name", rootElement.attributeValue("name"));


            Element AttributeSet = rootElement.element("AttributeSet");
            Element Behavior = rootElement.element("Behavior");

            //基本属性开始
            Element Category = AttributeSet.element("Categories").element("Category");
            mdlObj.put("principle", Category.attributeValue("principle"));
            mdlObj.put("path", Category.attributeValue("path"));

            List<Element> LocalAttributes = AttributeSet.element("LocalAttributes").elements();
            if (LocalAttributes.size() > 0) {
                for (Element LocalAttribute : LocalAttributes) {
                    JSONObject local = new JSONObject();
                    local.put("localName", LocalAttribute.attributeValue("localName"));
                    Element Keywords = LocalAttribute.element("Keywords");
                    local.put("keywords", Keywords.getText());
                    Element Abstract = LocalAttribute.element("Abstract");
                    local.put("abstract", Abstract.getText());
                    if (LocalAttribute.attributeValue("local").equals("EN_US")) {
                        mdlObj.put("enAttr", local);
                    } else {
                        mdlObj.put("cnAttr", local);
                    }
                }
            }
            //基本属性结束

            //相关数据开始


            Element RelatedDatasets = Behavior.element("RelatedDatasets");
            if (RelatedDatasets == null) {
                RelatedDatasets = Behavior.element("DatasetDeclarations");
            }
            List<Element> DatasetItems = RelatedDatasets.elements();
            if (DatasetItems.size() > 0) {
                String relatedDatasets = mdl.substring(mdl.indexOf("<RelatedDatasets>") + 17, mdl.indexOf("</RelatedDatasets>"));
                JSONArray DatasetItemArray = new JSONArray();
                for (Element DatasetDeclaration : DatasetItems) {
                    JSONArray dataset = new JSONArray();
                    JSONObject root = new JSONObject();
                    root.put("text", DatasetDeclaration.attributeValue("name"));
                    if (DatasetDeclaration.attribute("description") != null) {
                        root.put("desc", DatasetDeclaration.attributeValue("description"));
                    } else {
                        root.put("desc", "");
                    }
                    root.put("dataType", DatasetDeclaration.attributeValue("type"));
                    if (DatasetDeclaration.attributeValue("type").equals("external")) {
                        String external = "";
                        if (DatasetDeclaration.attribute("externalId") != null) {
                            external = DatasetDeclaration.attributeValue("externalId");
                            root.put("externalId", external);
                        } else if (DatasetDeclaration.attribute("external") != null) {
                            external = DatasetDeclaration.attributeValue("external");
                            root.put("externalId", external);
                        }
                        root.put("parentId", "null");
                        dataset.add(root);
                    } else {
                        Element UDXDeclaration;
                        if (DatasetDeclaration.element("UdxDeclaration") != null) {
                            UDXDeclaration = DatasetDeclaration.element("UdxDeclaration");
                        } else {
                            UDXDeclaration = DatasetDeclaration.element("UDXDeclaration");
                        }
                        String rootId = "";
                        if (UDXDeclaration.attribute("id") != null) {
                            rootId = "root" + UDXDeclaration.attributeValue("id");
                        } else {
                            rootId = "root" + UUID.randomUUID().toString();
                        }
                        root.put("Id", rootId);
                        root.put("parentId", "null");

                        Element udxNode;
                        if (UDXDeclaration.element("UDXNode") != null) {
                            udxNode = UDXDeclaration.element("UDXNode");
                        } else {
                            udxNode = UDXDeclaration.element("UdxNode");
                        }
                        List<Element> UdxNodes = udxNode.elements();
                        if (UdxNodes.size() > 0) {
                            root.put("schema",Utils.getUdxSchema(relatedDatasets,root.getString("text")));
                            root.put("nodes", new JSONArray());
                            convertData(UdxNodes, root);
                        }
                        dataset.add(root);
                    }
                    DatasetItemArray.add(dataset);
                }
                mdlObj.put("DataItems", DatasetItemArray);
            }
            //相关数据结束

            //State开始
            Element States = Behavior.element("StateGroup").element("States");
            List<Element> StateList = States.elements();
            JSONArray states = new JSONArray();
            if (StateList.size() > 0) {
                for (Element State : StateList) {
                    JSONObject stateObj = new JSONObject();
                    stateObj.put("name", State.attributeValue("name"));
                    stateObj.put("type", State.attributeValue("type"));
                    stateObj.put("desc", State.attributeValue("description"));
                    stateObj.put("Id", State.attributeValue("id"));
                    List<Element> EventList = State.elements();
                    JSONArray event = new JSONArray();
                    for (Element Event : EventList) {
                        JSONObject eventObj = new JSONObject();
                        eventObj.put("eventId", UUID.randomUUID().toString());
                        eventObj.put("eventName", Event.attributeValue("name"));
                        eventObj.put("eventType", Event.attributeValue("type"));
                        eventObj.put("eventDesc", Event.attributeValue("description"));
                        Element Parameter = null;
                        if (Event.attributeValue("type").equals("response")) {
                            Parameter = Event.element("ResponseParameter");
                            if (Event.attribute("optional") != null) {
                                if (Event.attributeValue("optional").equalsIgnoreCase("True")) {
                                    if (Event.element("ControlParameter") != null) {
                                        Parameter = Event.element("ControlParameter");
                                    }
                                    eventObj.put("optional", true);
                                } else {
                                    eventObj.put("optional", false);
                                }
                            }
                        } else {
                            Parameter = Event.element("DispatchParameter");
                            if (Event.attribute("optional") != null) {
                                if (Event.attributeValue("optional").equalsIgnoreCase("True")) {
                                    if (Event.element("ControlParameter") != null) {
                                        Parameter = Event.element("ControlParameter");
                                    }
                                    eventObj.put("optional", true);
                                } else {
                                    eventObj.put("optional", false);
                                }
                            }
                        }

                        for (int i = 0; i < mdlObj.getJSONArray("DataItems").size(); i++) {
                            JSONArray currentDataSet = mdlObj.getJSONArray("DataItems").getJSONArray(i);
                            JSONObject rootData = currentDataSet.getJSONObject(0);
                            if (Parameter == null) {
                                break;
                            }
                            if (rootData.getString("text").equals(Parameter.attributeValue("datasetReference"))) {
                                eventObj.put("data", currentDataSet);
                            }
                        }
                        event.add(eventObj);
                    }
                    stateObj.put("event", event);
                    states.add(stateObj);
                }
            }
            mdlObj.put("states", states);
            //State结束
        } catch (DocumentException e) {
            System.out.println(mdl);
            e.printStackTrace();
        }
        JSONObject result = new JSONObject();
        result.put("mdl", mdlObj);
        return result;
    }

    public static void convertData(List<Element> udxNodes, JSONObject root) {
        if (udxNodes.size() > 0) {
            for (Element udxNode : udxNodes) {
                JSONObject node = new JSONObject();
                node.put("text", udxNode.attributeValue("name"));
                String dataType=udxNode.attributeValue("type");
                String dataType_result="";
//                switch (dataType) {
//                    case "DTKT_INT | DTKT_LIST":
//                        dataType_result = "int_array";
//                        break;
//                    default:
//                        String[] strings=dataType.split("_");
//                        for(int i=0;i<strings.length;i++){
//                            if(!strings[i].equals("DTKT")){
//                                dataType_result+=strings[i];
//                                if(i!=strings.length-1){
//                                    dataType_result+="_";
//                                }
//                            }
//                        }
//                }
                String[] dataTypes=dataType.split("\\|");
                if(dataTypes.length>1){
                    for(int j=0;j<dataTypes.length;j++){
                        String[] strings=dataTypes[j].trim().split("_");
                        if(strings[1].equals("LIST")){
                            strings[1]="ARRAY";
                        }
                        dataType_result+=strings[1];
                        if(j!=dataTypes.length-1){
                            dataType_result+="_";
                        }
                    }
                }
                else{
                    String[] strings=dataType.split("_");
                    dataType_result=strings[1];
                }

                node.put("dataType", dataType_result);
                node.put("desc", udxNode.attributeValue("description"));
                if (udxNode.attributeValue("type").equals("external")) {
                    node.put("externalId", udxNode.attributeValue("externalId"));
                }
                List<Element> nodeChildren = udxNode.elements();
                if (nodeChildren.size() > 0) {
                    node.put("nodes", new JSONArray());
                    convertData(nodeChildren, node);
                }
                JSONArray nodes = root.getJSONArray("nodes");
                nodes.add(node);
            }
        } else {
            return;
        }
    }

    public static String getUdxSchema(String text,String name){
        int findIndex=text.indexOf(name);
        int startIndex=text.indexOf(">",findIndex+name.length())+1;
        int endIndex=text.indexOf("</DatasetItem>",startIndex);
        return text.substring(startIndex,endIndex);
    }

    public static boolean isChinese(String str) {
        String regEx = "[\u4e00-\u9fa5]";
        Pattern pat = Pattern.compile(regEx);
        Matcher matcher = pat.matcher(str);
        boolean flg = false;
        if (matcher.find())
            flg = true;

        return flg;
    }

    public static String saveBase64Image(String content,String oid,String resourcePath,String htmlLoadPath){
        int startIndex = 0, endIndex = 0, index = 0;
        while (content.indexOf("src=\"data:im", startIndex) != -1) {
            int Start = content.indexOf("src=\"data:im", startIndex) + 5;
            int typeStart = content.indexOf("/", Start) + 1;
            int typeEnd = content.indexOf(";", typeStart);
            String type = content.substring(typeStart, typeEnd);
            startIndex = typeEnd + 8;
            endIndex = content.indexOf("\"", startIndex);
            String imgStr = content.substring(startIndex, endIndex);

            String imageName = "/detailImage/" + oid + "/" + oid + "_" + (index++) + "." + type;
            Utils.base64StrToImage(imgStr, resourcePath + imageName);

            content = content.substring(0, Start) + htmlLoadPath + imageName + content.substring(endIndex, content.length());
        }
        return content;
    }

    //base64字符串转化成图片
    public static boolean base64StrToImage(String imgStr, String path) {
        if (imgStr == null)
            return false;
        BASE64Decoder decoder = new BASE64Decoder();
        try {
            // 解密
            byte[] b = decoder.decodeBuffer(imgStr);
            // 处理数据
            for (int i = 0; i < b.length; ++i) {
                if (b[i] < 0) {
                    b[i] += 256;
                }
            }
            //文件夹不存在则自动创建
            File tempFile = new File(path);
            if (!tempFile.getParentFile().exists()) {
                tempFile.getParentFile().mkdirs();
            }
            OutputStream out = new FileOutputStream(tempFile);
            out.write(b);
            out.flush();
            out.close();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static void count(){
        System.out.println("finish:"+(++count));
    }
}
