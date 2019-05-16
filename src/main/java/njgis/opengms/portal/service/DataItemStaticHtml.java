package njgis.opengms.portal.service;

import njgis.opengms.portal.PortalApplication;
import njgis.opengms.portal.dao.DataItemDao;
import njgis.opengms.portal.entity.DataItem;
import njgis.opengms.portal.enums.ResultEnum;
import njgis.opengms.portal.exception.MyException;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class DataItemStaticHtml {
    @Autowired
    DataItemDao dataItemDao;



}
