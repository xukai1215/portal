package njgis.opengms.portal.dao;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.WriteConcern;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import org.bson.conversions.Bson;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ModelDao {

	private final static String HOST = "localhost";
	private final static int PORT = 27017;
	private final static int POOLSIZE = 100;
	private final static int BLOCKSIZE = 100;
	private static MongoClient client= null;
	private static InputStream in=ModelDao.class.getClassLoader().getResourceAsStream("application.properties");
	private static Properties properties;

	static{
		properties = new Properties();
		try {
			properties.load(in);
			String host = properties.getProperty("host");
			String port = properties.getProperty("port");
			System.out.println("��ʼ����");
			MongoClientOptions.Builder builder = new MongoClientOptions.Builder();

			builder.connectionsPerHost(10);
			builder.connectTimeout(10000);
			builder.maxWaitTime(120000);
			builder.socketKeepAlive(false);
			builder.cursorFinalizerEnabled(true);
			builder.threadsAllowedToBlockForConnectionMultiplier(5000);
			builder.writeConcern(WriteConcern.SAFE);
			MongoClientOptions options = builder.build();

			client = new MongoClient(host,options);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	private void initMongoDB(){
		properties = new Properties();
		try {
			properties.load(in);
			String host = properties.getProperty("host");
			String port = properties.getProperty("port");

			MongoClientOptions.Builder builder = new MongoClientOptions.Builder();

			builder.connectionsPerHost(10);
			builder.connectTimeout(10000);
			builder.maxWaitTime(120000);
			builder.socketKeepAlive(false);
			builder.cursorFinalizerEnabled(true);
			builder.threadsAllowedToBlockForConnectionMultiplier(5000);// �̶߳���������������߳������˶��оͻ��׳���Out of semaphores to get db������
			builder.writeConcern(WriteConcern.SAFE);
			MongoClientOptions options = builder.build();

			client = new MongoClient(host,options);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}


	public String GetModelTree() {
		return null;
	}


	public MongoDatabase GetDB(String dbName) {
		// TODO Auto-generated method stub
		if (dbName != null && !"".equals(dbName)) {
			if(client==null){
				initMongoDB();
			}
			MongoDatabase database = client.getDatabase(dbName);
			return database;
		}
		return null;
	}


	public MongoCollection<Document> GetCollection(String dbName, String collName) {
		// TODO Auto-generated method stub
		if (null == collName || "".equals(collName)) {
			return null;
		}
		if (null == dbName || "".equals(dbName)) {
			return null;
		}
		MongoCollection<Document> collection = GetDB(dbName).getCollection(collName);
		return collection;
	}


	public boolean CreateCollection(String collectionName) {
		return false;
	}

	public boolean InsertDoc(Document doc) {
		// TODO Auto-generated method stub
		return false;
	}


	public boolean DeleteDocById(String Id) {
		// TODO Auto-generated method stub
		return false;
	}


	public boolean UpdateDocById(String Id) {
		// TODO Auto-generated method stub
		return false;
	}


	public Document RetrieveDocsByName(MongoCollection<Document> coll, String modelName) {
		// TODO ��������Collection��document
		Document docs = null;
		try {
			docs = coll.find(Filters.eq("name", modelName)).first();
		} catch (Exception e) {
			return null;
		}
		return docs;

	}




	/*
	 * ��������id��document
	 * @see com.geomodel.dao.IModelDao#RetrieveDocById(com.mongodb.client.MongoCollection, java.lang.String)
	 */
	public Document RetrieveDocById(MongoCollection<Document> coll, String id) {
		// TODO Auto-generated method stub
		if(client==null){
			initMongoDB();
		}
		Document myDoc = null;
		try {
			myDoc = coll.find(Filters.eq("UID", id)).first();
		} catch (Exception e) {
			return null;
		}
		return myDoc;
	}


	/*
	 *������ѯ
	 * @see com.geomodel.dao.IModelDao#RetrieveDocsByFilter(com.mongodb.client.MongoCollection, org.bson.conversions.Bson)
	 */
	public MongoCursor<Document> RetrieveDocsByFilter(
            MongoCollection<Document> coll, Bson filter) {
		// TODO Auto-generated method stub
		return coll.find(filter).iterator();
	}



	public Document RetrieveDocByOneField(
            MongoCollection<Document> coll, String dbFieldName,
            String fieldName) {
		// TODO Auto-generated method stub
		if(client==null){
			initMongoDB();
		}
		Document myDoc = null;
		try {
			myDoc = coll.find(Filters.eq(dbFieldName, fieldName)).first();
		} catch (Exception e) {
			return null;
		}
		return myDoc;
	}


	public MongoCursor<Document> RetrieveDocsLimit(MongoCollection<Document> col, Bson filter, BasicDBObject nameFilter, int page) {
		if(filter==null){
			return col.find().sort(nameFilter).limit(10).skip((page)*10).iterator();
		}else{
			return col.find(filter).sort(nameFilter).limit(10).skip((page)*10).iterator();
		}
	}

	public FindIterable<Document> RetrieveDocs(MongoCollection<Document> col, Bson filter, BasicDBObject nameFilter) {
		if(filter==null){
			return col.find().sort(nameFilter);
		}else{
			return col.find(filter).sort(nameFilter);
		}
	}


	public MongoCursor<Document> RetrieveDocsLimitByTime(MongoCollection<Document> col, Bson filter, BasicDBObject timeFilter, int page) {
		return col.find(filter).sort(timeFilter).limit(10).skip((page-1)*10).iterator();
	}

	public BasicDBObject getSort(String sortType, Boolean asc){
		BasicDBObject sortObj = new BasicDBObject();
		int asc_num=asc.equals(true)?1:0;
		if(sortType.equals("name")){
			sortObj.append("name",asc_num);
		}else if(sortType.equals("time")){
			sortObj.append("createTime",asc_num);
		}else{
			sortObj.append("viewCount",-1);
		}
		return sortObj;
	}

	public BasicDBObject getSort(String sortType, int asc){
		BasicDBObject sortObj = new BasicDBObject();

		if(sortType.equals("name")){
			sortObj.append("name",asc);
		}else if(sortType.equals("time")){
			sortObj.append("createTime",asc);
		}else{
			sortObj.append("viewCount",-1);
		}
		return sortObj;
	}




	public Boolean ping(String ipAddress, String port, int timeOut) {
		try {
			URL url  = new URL("http://"+ipAddress+":"+port+"/ping");
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setConnectTimeout(timeOut);
			connection.connect();

			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(),"utf-8"));//���ñ���,������������
			String lines="";
			String strResponse ="";
			while ((lines = reader.readLine()) != null){
				strResponse +=lines;
			}

			if(strResponse.equals("OK")){
				return true;
			}else{
				return false;
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
		return false;
	}

	private int getCheckResult(String line) {
		Pattern pattern = Pattern.compile("(\\d+ms)(\\s+)(TTL=\\d+)",    Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(line);
		while (matcher.find()) {
			return 1;
		}
		return 0;
	}
}
