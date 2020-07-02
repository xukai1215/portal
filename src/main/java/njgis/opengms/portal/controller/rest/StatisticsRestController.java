package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONObject;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.dao.UserDao;
import njgis.opengms.portal.entity.User;
import njgis.opengms.portal.service.StatisticsService;
import njgis.opengms.portal.service.UserService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.File;
import java.io.FileOutputStream;

@RestController
@RequestMapping(value="/statistics")
public class StatisticsRestController {

    @Autowired
    StatisticsService statisticsService;

    @Autowired
    UserDao userDao;

    @Autowired
    UserService userService;


    @Autowired
    TemplateEngine templateEngine;

    @RequestMapping(value="",method= RequestMethod.GET)
    ModelAndView serverIndex(){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("statistics");

        return modelAndView;
    }

    @RequestMapping(value="/computableModel/{oid}",method= RequestMethod.GET)
    ModelAndView show(@PathVariable("oid") String oid){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("modelStatistics");
        JSONObject statistics = statisticsService.getComputableModelStatisticsInfo(oid, 90);
        modelAndView.addObject("statistics",statistics);

        return modelAndView;
    }

    @RequestMapping(value="/getStats/computableModel/{oid}/{days}",method= RequestMethod.GET)
    JsonResult getStats(@PathVariable("oid") String oid, @PathVariable("days") int days){

        JSONObject statistics = statisticsService.getComputableModelStatisticsInfo(oid, days);

        return ResultUtils.success(statistics);
    }

    @RequestMapping(value="/email",method = RequestMethod.GET)
    ModelAndView email(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("modelStatisticsEmail");
        return modelAndView;
    }


    @RequestMapping(value="/pdf",method = RequestMethod.GET)
    void pdf(){
        try {
            User user = userDao.findFirstByOid("24");
            final File outputFile = File.createTempFile("test", ".pdf");
            FileOutputStream out = new FileOutputStream(outputFile);
            ITextRenderer renderer = new ITextRenderer();

            Context ctx = new Context();
            String pdf = templateEngine.process("modelStatisticsPDF.html",ctx);
            renderer.setDocumentFromString(pdf);

            renderer.layout();
            renderer.createPDF(out, false);
            renderer.finishPDF();
            System.out.println("==pdf created successfully==");
            System.out.println(outputFile.getAbsolutePath());
        }catch (Exception e){

        }
    }



}
