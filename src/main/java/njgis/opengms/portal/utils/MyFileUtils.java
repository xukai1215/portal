package njgis.opengms.portal.utils;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.FileUtils;
import org.apache.http.entity.ContentType;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import java.io.*;
import java.nio.file.Files;

/**
 * Created by wang ming on 2019/5/14.
 */
public class MyFileUtils {

    public static InputStream getInputStream(File file) {
        try {
            return FileUtils.openInputStream(file);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void copy(String srcPathStr, String desPathStr)
    {
        //获取源文件的名称
        String newFileName = srcPathStr.substring(srcPathStr.lastIndexOf("\\")+1); //目标文件地址
        System.out.println("源文件:"+newFileName);
        desPathStr = desPathStr + newFileName; //源文件地址
        System.out.println("目标文件地址:"+desPathStr);
        try
        {
            FileInputStream fis = new FileInputStream(srcPathStr);//创建输入流对象
            FileOutputStream fos = new FileOutputStream(desPathStr); //创建输出流对象
            byte datas[] = new byte[1024*8];//创建搬运工具
            int len = 0;//创建长度
            while((len = fis.read(datas))!=-1)//循环读取数据
            {
                fos.write(datas,0,len);
            }
            fis.close();//释放资源
            fis.close();//释放资源
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    public static MultipartFile getMultipartFile(FileSystemResource resource) throws IOException {
        File file = resource.getFile();
        FileInputStream fileInputStream = null;
        MultipartFile multipartFile = null;
        // 需要导入commons-fileupload的包
        FileItem fileItem = new DiskFileItem("copyfile.txt", Files.probeContentType(file.toPath()),false,file.getName(),(int)file.length(),file.getParentFile());
        byte[] buffer = new byte[4096];
        int n;
        try (InputStream inputStream = new FileInputStream(file); OutputStream os = fileItem.getOutputStream()){
            while ( (n = inputStream.read(buffer,0,4096)) != -1){
                os.write(buffer,0,n);
            }
            //也可以用IOUtils.copy(inputStream,os);
            multipartFile = new CommonsMultipartFile(fileItem);
            System.out.println(multipartFile.getName());
        }catch (IOException e){
            e.printStackTrace();
        }
        return multipartFile;
    }


    public static void writeTxt(String txtPath,String content){
        FileOutputStream fileOutputStream = null;
        File file = new File(txtPath);
        try {
            if(file.exists()){
                //判断文件是否存在，如果不存在就新建一个txt
                file.createNewFile();
            }
            fileOutputStream = new FileOutputStream(file);
            fileOutputStream.write(content.getBytes());
            fileOutputStream.flush();
            fileOutputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
