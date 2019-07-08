package njgis.opengms.portal.controller;

import njgis.opengms.portal.PortalApplication;
import njgis.opengms.portal.dto.dataItem.DataItemFindDTO;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.service.DataItemService;
import njgis.opengms.portal.utils.ResultUtils;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;


import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

@Controller
public class DataItemController {


    @Autowired
    DataItemService dataItemService;

    //todo 待优化：在请求一次接口生成缓存html后，下次访问不在重新生成，减少本接口压力
    @RequestMapping("/dataItem/repository")
    public ModelAndView getModelItems(DataItemFindDTO dataItemFindDTO

                                      ) throws IOException {

        System.out.println("data items");
//        Page<DataItem> dataItems=dataItemService.list(dataItemFindDTO);

        ModelAndView modelAndView = new ModelAndView();

        modelAndView.setViewName("data_items");
//        modelAndView.setViewName("data_items_static_homePage");

//        modelAndView.addObject("name","OpenGMS");
//        modelAndView.addObject("data",dataItems);




        return modelAndView;
    }















}
