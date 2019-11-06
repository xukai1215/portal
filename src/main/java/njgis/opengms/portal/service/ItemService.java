package njgis.opengms.portal.service;

import njgis.opengms.portal.entity.Item;
import njgis.opengms.portal.entity.support.DailyViewCount;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @ClassName ModelItemService
 * @Description todo
 * @Author Kai
 * @Date 2019/2/21
 * @Version 1.0.0
 * TODO
 */

@Service

public class ItemService {

    public Item recordViewCount(Item item){
        Date now = new Date();
        DailyViewCount newViewCount = new DailyViewCount(now, 1);

        List<DailyViewCount> dailyViewCountList=item.getDailyViewCount();
        if(dailyViewCountList==null){
            List<DailyViewCount> newList=new ArrayList<>();
            newList.add(newViewCount);
            dailyViewCountList=newList;
        }
        else if(dailyViewCountList.size()>0) {
            DailyViewCount dailyViewCount = dailyViewCountList.get(dailyViewCountList.size() - 1);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            if (sdf.format(dailyViewCount.getDate()).equals(sdf.format(now))) {
                dailyViewCount.setCount(dailyViewCount.getCount() + 1);
                dailyViewCountList.set(dailyViewCountList.size() - 1, dailyViewCount);
            } else {
                dailyViewCountList.add(newViewCount);
            }
        }
        else{
            dailyViewCountList.add(newViewCount);
        }

        item.setDailyViewCount(dailyViewCountList);
        item.setViewCount(item.getViewCount()+1);

        return item;
    }

}
