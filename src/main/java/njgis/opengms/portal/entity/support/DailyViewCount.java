package njgis.opengms.portal.entity.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyViewCount implements Comparable<DailyViewCount> {
    Date date;
    int count;

    boolean flag = true;

    public DailyViewCount(Date date, int count){
        this.date = date;
        this.count = count;
    }

    @Override
    public int compareTo(DailyViewCount dailyViewCount){
        return date.compareTo(dailyViewCount.date);
    }
}
