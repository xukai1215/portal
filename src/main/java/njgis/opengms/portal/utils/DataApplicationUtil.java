package njgis.opengms.portal.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * @Author mingyuan
 * @Date 2020.12.16 19:58
 */
public class DataApplicationUtil {
    public static void zipUncompress(String inputFile,String destDirPath) throws Exception {
        File srcFile = new File(inputFile);
        if (!srcFile.exists()){
            throw new Exception(srcFile.getPath() + "所指文件不存在");
        }
        ZipFile zipFile = new ZipFile(srcFile);
        Enumeration<?> entries = zipFile.entries();
        while (entries.hasMoreElements()) {
            ZipEntry entry = (ZipEntry) entries.nextElement();
            // 如果是文件夹，就创建个文件夹
            if (entry.isDirectory()) {
                String dirPath = destDirPath + "/" + entry.getName();
                srcFile.mkdirs();
            } else {
                // 如果是文件，就先创建一个文件，然后用io流把内容copy过去
                File targetFile = new File(destDirPath + "/" + entry.getName());
                // 保证这个文件的父文件夹必须要存在
                if (!targetFile.getParentFile().exists()) {
                    targetFile.getParentFile().mkdirs();
                }
                targetFile.createNewFile();
                // 将压缩文件内容写入到这个文件中
                InputStream is = zipFile.getInputStream(entry);
                FileOutputStream fos = new FileOutputStream(targetFile);
                int len;
                byte[] buf = new byte[1024];
                while ((len = is.read(buf)) != -1) {
                    fos.write(buf, 0, len);
                }
                // 关流顺序，先打开的后关闭

                fos.close();
                is.close();
            }
        }
        zipFile.close();
    }

    public static boolean deleteFolder(String sPath) {
        boolean delLog = false;

        File file = new File(sPath);
        // 判断目录或文件是否存在
        if (!file.exists()) {
            return delLog;
        } else {
            // 判断是否为文件
            if (file.isFile()) {  // 为文件时调用删除文件方法
                return deleteFile(sPath);
            } else {  // 为目录时调用删除目录方法
                return deleteDirectory(sPath);
            }
        }
    }

    //删除单个文件
    public static boolean deleteFile(String sPath) {
        boolean delLog;
        delLog = false;
        File file = new File(sPath);
        // 路径为文件且不为空则进行删除
        if (file.isFile() && file.exists()) {
            file.delete();
            delLog = true;
        }
        return delLog;
    }

    //删除目录（文件夹）以及目录下的文件
    public static boolean deleteDirectory(String sPath) {
        boolean delLog;
        //如果sPath不以文件分隔符结尾，自动添加文件分隔符
        if (!sPath.endsWith(File.separator)) {
            sPath = sPath + File.separator;
        }
        File dirFile = new File(sPath);
        //如果dir对应的文件不存在，或者不是一个目录，则退出
        if (!dirFile.exists() || !dirFile.isDirectory()) {
            return false;
        }
        delLog = true;
        //删除文件夹下的所有文件(包括子目录)
        File[] files = dirFile.listFiles();
        for (int i = 0; i < files.length; i++) {
            //删除子文件
            if (files[i].isFile()) {
                delLog = deleteFile(files[i].getAbsolutePath());
                if (!delLog) break;
            } //删除子目录
            else {
                delLog = deleteDirectory(files[i].getAbsolutePath());
                if (!delLog) break;
            }
        }
        if (!delLog) return false;
        //删除当前目录
        if (dirFile.delete()) {
            return true;
        } else {
            return false;
        }
    }
}
