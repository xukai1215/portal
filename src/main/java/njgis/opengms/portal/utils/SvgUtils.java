package njgis.opengms.portal.utils;

import org.apache.batik.transcoder.Transcoder;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;

import java.io.*;

public class SvgUtils {


    public static void convertSvg2Png(String svgCode, String destPath) throws IOException,TranscoderException
    {

        File png=new File(destPath);
        if (!png.exists() && !png.isDirectory()) {
            png.mkdirs();
        }
        byte[] bytes = svgCode.getBytes("utf-8");

        OutputStream out = new FileOutputStream(png);
        out = new BufferedOutputStream(out);

        Transcoder transcoder = new PNGTranscoder();
        try {
            TranscoderInput input = new TranscoderInput(new ByteArrayInputStream(bytes));
            try {
                TranscoderOutput output = new TranscoderOutput(out);
                transcoder.transcode(input, output);
            } finally {
                out.close();
            }
        } catch (Exception e){

        }
    }
}
