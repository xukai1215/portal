package njgis.opengms.portal.controller.rest;

import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dto.Template.TemplateFindDTO;
import njgis.opengms.portal.entity.Template;
import njgis.opengms.portal.service.TemplateService;
import njgis.opengms.portal.utils.ResultUtils;
import njgis.opengms.portal.dao.DataItemDao;
import org.apache.http.entity.ContentType;
import org.omg.PortableInterceptor.SYSTEM_EXCEPTION;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.spring.web.json.Json;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value="/template")
public class TemplateRestController {
    @Autowired
    TemplateService templateService;



    @RequestMapping (value = "/listTemplatesByOid",method = RequestMethod.GET)
    JsonResult listSpatialByUserOid(TemplateFindDTO templateFindDTO,
                                    @RequestParam(value="oid") String oid, HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        oid= URLDecoder.decode(oid);
        return ResultUtils.success(templateService.getTemplatesByUserId(oid,templateFindDTO,loadUser));
    }

    @RequestMapping(value="/searchByNameByOid",method= RequestMethod.GET)
    JsonResult searchByTitle(TemplateFindDTO templateFindDTO, String oid, HttpServletRequest request){
        HttpSession session = request.getSession();
        String loadUser = null;
        if(session.getAttribute("oid")!=null)
            loadUser =  session.getAttribute("oid").toString() ;
        oid = URLDecoder.decode(oid);
        return ResultUtils.success(templateService.searchByTitleByOid(templateFindDTO,oid,loadUser));
    }

//    @RequestMapping(value="/{oid}",method= RequestMethod.GET)
//    JsonResult getXmlByOid(@PathVariable("oid") String oid){
//        String template=templateService.searchByOid(oid);
//        if(template==null){
//            return ResultUtils.error(-1,"no template");
//        }
//        else {
//            return ResultUtils.success(template);
//        }
//    }
    @RequestMapping(value = "/all",method = RequestMethod.GET)
    JsonResult getTemplateByClassfications(){
        List<Template> template = templateService.searchALL();
        if(template==null){
            return ResultUtils.error(-1,"no template");
        }
        else {
            return ResultUtils.success(template);
        }
    }

    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    JsonResult getTemplateByName(@PathVariable("name") String name){
        List<Template> template = templateService.searchByName(name);
        if(template==null){
            return ResultUtils.error(-1,"no template");
        }
        else {
            return ResultUtils.success(template);
        }
    }

    @PostMapping(value = "/uploadFiles")
    public JsonResult upload(MultipartFile uploadFile, HttpServletRequest request) {
        String realPath = "E:/data";
        File folder = new File(realPath);
        try {
            Collection<Part> parts = null;
            try {
                parts = request.getParts();
            } catch (ServletException e) {
                e.printStackTrace();
            }
            for (Part part: parts){
                String oldName = part.getSubmittedFileName();
                MultipartFile multipartFile = new MockMultipartFile(ContentType.APPLICATION_OCTET_STREAM.toString(),part.getInputStream());
                part.getSize();
                multipartFile.transferTo(new File(folder, oldName));
                System.out.println(ResultUtils.success());
                return ResultUtils.success();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ResultUtils.error(-1,"fail");
    }

    @RequestMapping(value = "/{fileName}", method = RequestMethod.POST)
    JsonResult deleteFileByName(@PathVariable("fileName") String fileName){
        String path = "E:/data/" + fileName;
        File file = new File(path);
        try{
            if(!file.exists()){
                return ResultUtils.error(-1,"no such file");
            }
            file.delete();
            return  ResultUtils.success();
        } catch (Exception e){
            e.printStackTrace();
        }
        return ResultUtils.error(-1,"fail");
    }
}
