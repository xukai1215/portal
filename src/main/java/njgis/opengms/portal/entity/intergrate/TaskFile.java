package njgis.opengms.portal.entity.intergrate;

import lombok.Data;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@Data
public class TaskFile {
  FileSystemResource file;
  String userName;
}
