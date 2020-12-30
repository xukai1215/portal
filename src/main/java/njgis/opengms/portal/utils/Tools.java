package njgis.opengms.portal.utils;

import de.odysseus.staxon.json.JsonXMLConfig;
import de.odysseus.staxon.json.JsonXMLConfigBuilder;
import de.odysseus.staxon.json.JsonXMLInputFactory;
import de.odysseus.staxon.json.JsonXMLOutputFactory;
import de.odysseus.staxon.xml.util.PrettyXMLEventWriter;
import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONArray;
import net.sf.json.xml.XMLSerializer;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLEventWriter;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLOutputFactory;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @Author mingyuan
 * @Date 2020.12.23 20:41
 */
@Slf4j
public class Tools {
    /**
     * xml convert to json
     *
     * @param xmlString
     * @return
     */
    public static String xmlToJson(String xmlString) {
        StringReader input = new StringReader(xmlString);
        StringWriter output = new StringWriter();
        JsonXMLConfig config = new JsonXMLConfigBuilder().autoArray(true).autoPrimitive(true).prettyPrint(true).build();
        try {
            XMLEventReader reader = XMLInputFactory.newInstance().createXMLEventReader(input);
            XMLEventWriter writer = new JsonXMLOutputFactory(config).createXMLEventWriter(output);
            writer.add(reader);
            reader.close();
            writer.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                output.close();
                input.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return output.toString();
    }

    /**
     * json convert to xml
     *
     * @param jsonString
     * @return
     */
    public static String JsonToXml(String jsonString) {
        StringReader input = new StringReader(jsonString);
        StringWriter output = new StringWriter();
        JsonXMLConfig config = new JsonXMLConfigBuilder().multiplePI(false).repairingNamespaces(false).build();
        try {
            XMLEventReader reader = new JsonXMLInputFactory(config).createXMLEventReader(input);
            XMLEventWriter writer = XMLOutputFactory.newInstance().createXMLEventWriter(output);
            writer = new PrettyXMLEventWriter(writer);
            writer.add(reader);
            reader.close();
            writer.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                output.close();
                input.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        // remove <?xml version="1.0" encoding="UTF-8"?>
        if (output.toString().length() >= 38) {
            return output.toString().substring(39);
        }
        return output.toString();
    }

    /**
     * 去掉xml中的换行和空格
     *
     * @param jsonString
     * @return
     */
    public static String JsonToXmlReplaceBlank(String jsonString) {
        String str = JsonToXml(jsonString);
        String dest = "";
        if (str != null) {
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");
            Matcher m = p.matcher(str);
            dest = m.replaceAll("");
        }
        return dest;
    }

    public static String jsonToXML(String json) {
        XMLSerializer xmlSerializer = new XMLSerializer();
        // 根节点名称
        xmlSerializer.setRootName("xml");
        // 不对类型进行设置
        xmlSerializer.setTypeHintsEnabled(false);
        String xmlStr = "";
        if (json.contains("[") && json.contains("]")) {
            // jsonArray
            JSONArray jobj = JSONArray.fromObject(json);
            xmlStr = xmlSerializer.write(jobj);
        } else {
            // jsonObject
            net.sf.json.JSONObject jobj = net.sf.json.JSONObject.fromObject(json);
            xmlStr = xmlSerializer.write(jobj);
        }
        log.info("转换后的参数：" + xmlStr);
        return xmlStr;
    }
}
