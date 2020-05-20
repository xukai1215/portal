package njgis.opengms.portal.controller.rest;

import com.alibaba.fastjson.JSONArray;
import njgis.opengms.portal.bean.JsonResult;
import njgis.opengms.portal.service.ComputerResourceService;
import njgis.opengms.portal.utils.ResultUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @Author: wangming
 * @Date: 2020-05-18 22:28
 */
@RestController
@RequestMapping(value = "/computerResource")
public class ComputerResourceRestController {

    @Autowired
    ComputerResourceService computerResourceService;

    @RequestMapping(value = "/all",method = RequestMethod.GET)
    JsonResult getAll(){
        JSONArray computerResources = computerResourceService.getAllComputerResource();
        return ResultUtils.success(computerResources);
    }

    @RequestMapping(value = "/getComputerResourceByUserName", method = RequestMethod.GET)
    JsonResult getComputerResourceByUserName(HttpServletRequest request){
        HttpSession session = request.getSession();
        if (session.getAttribute("uid") == null) {
            return ResultUtils.error(-1, "no login");
        }
        String userName = session.getAttribute("uid").toString();
        return ResultUtils.success(computerResourceService.getComputerResourceByUser(userName));
    }
}
