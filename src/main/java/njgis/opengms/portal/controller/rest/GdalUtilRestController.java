package njgis.opengms.portal.controller.rest;

import org.gdal.gdal.gdal;
import org.gdal.osr.CoordinateTransformation;
import org.gdal.osr.SpatialReference;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/GDAL")
public class GdalUtilRestController {

    @RequestMapping(value="/transformSpactialRef",method = RequestMethod.POST)
    public double[] transformSpactialRef(@RequestBody Map<String,String> transformInfo){
        String inputRefName = transformInfo.get("inputRefName");
        double inputRefX = Double.parseDouble(transformInfo.get("inputRefX"));
        double inputRefY = Double.parseDouble(transformInfo.get("inputRefY"));
        String outputRefName = transformInfo.get("outputRefName");
//        double outputRefX = Double.parseDouble(transformInfo.get("outputRefX"));
//        double outputRefY = Double.parseDouble(transformInfo.get("outputRefY"));

        SpatialReference inputRef = new SpatialReference();
        SpatialReference outputRef = new SpatialReference();

        gdal.AllRegister();

        gdal.SetConfigOption("PROJ_LIB","portal/proj.db");
        int refCode = 0;

        if(inputRefName.indexOf("EPSG")!=-1){
            refCode = Integer.parseInt(inputRefName.split("\\.")[1]);
            inputRef.ImportFromEPSG(refCode);
        }
        if(outputRefName.indexOf("EPSG")!=-1){
            refCode = Integer.parseInt(outputRefName.split("\\.")[1]);
            outputRef.ImportFromEPSG(refCode);
        }

        inputRef.ImportFromWkt(transformInfo.get("inputRefWkt"));
        outputRef.ImportFromWkt(transformInfo.get("outputRefWkt"));

        CoordinateTransformation coordinateTransformation = new CoordinateTransformation(inputRef,outputRef);

        double[] result = coordinateTransformation.TransformPoint(inputRefX,inputRefY);

        return result;
    }
}
