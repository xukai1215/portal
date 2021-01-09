package njgis.opengms.portal.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

@Repository
public class UserUpdateDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private DataItemDao dataItemDao;

    @Autowired
    private DataHubsDao dataHubsDao;

    @Autowired DataApplicationDao dataApplicationDao;

    // 更新用户信息, 我就更新了dataitems和datamethods的条目数据信息
    public void updateUser(String oid) {
        Query query = new Query();
        query.addCriteria(Criteria.where("oid").is(oid));
        Update update = new Update();
        update.set("dataItems", dataItemDao.countAllByAuthor(oid));
        update.set("dataItemHubs", dataHubsDao.countAllByAuthor(oid));
        update.set("dataMethods", dataApplicationDao.countAllByAuthor(oid));
        mongoTemplate.updateFirst(query, update, "user");
    }
}
