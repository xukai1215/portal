package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document
public class Hardware {
    String hostName;
    String system;
    String cpuInfo;
    String totalMemory;
    String freeMemory;
    int cpu_Core;
    String diskAvailable;
    String diskAll;
    String platform;
    String version;

}
