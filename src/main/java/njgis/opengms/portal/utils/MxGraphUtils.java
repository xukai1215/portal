package njgis.opengms.portal.utils;

import com.mxgraph.canvas.mxGraphicsCanvas2D;
import com.mxgraph.canvas.mxICanvas2D;
import com.mxgraph.reader.mxSaxOutputHandler;
import com.mxgraph.util.mxUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;

import javax.imageio.ImageIO;
import javax.xml.parsers.SAXParserFactory;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.StringReader;

public class MxGraphUtils {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 导出图片文件
     * @param w 图片宽
     * @param h 图片高
     * @param xml graph对应的xml代码
     */
    public void exportImage(int w, int h,String xml,String path,String name) throws Exception {
        long t0 = System.currentTimeMillis();
        BufferedImage image = mxUtils.createBufferedImage(w, h, Color.WHITE);

        // Creates handle and configures anti-aliasing
        Graphics2D g2 = image.createGraphics();
        mxUtils.setAntiAlias(g2, true, true);
        long t1 = System.currentTimeMillis();

        // Parses request into graphics canvas
        mxGraphicsCanvas2D gc2 = new mxGraphicsCanvas2D(g2);
        parseXmlSax(xml, gc2);
        long t2 = System.currentTimeMillis();

        logger.info("before mkdirs");

        File file=new File(path);
        if (!file.exists() && !file.isDirectory()) {
            file.mkdirs();
        }

        logger.info("after mkdirs");

        ImageIO.write(image, "png", new File(path+name));
        long t3 = System.currentTimeMillis();

        logger.info("saved");

    }
    /**
     * 创建并返回请求的图片
     *
     */
    protected void parseXmlSax(String xml, mxICanvas2D canvas) {
        // Creates SAX handler for drawing to graphics handle
        mxSaxOutputHandler handler = new mxSaxOutputHandler(canvas);
        // Creates SAX parser for handler
        XMLReader reader;
        try {
            reader = SAXParserFactory.newInstance().newSAXParser()
                    .getXMLReader();
            reader.setContentHandler(handler);
            // Renders XML data into image
            reader.parse(new InputSource(new StringReader(xml)));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
