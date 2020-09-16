package njgis.opengms.portal.utils;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Properties;


public class MyMailUtils {

    public static String receiver = "opengms@126.com";

    public static String myEmailSMTPHost = "smtp.qq.com";//需要根据发件人修改

    public static void sendMail(String sender,String sendPassword,String content){
        // 1. 创建参数配置, 用于连接邮件服务器的参数配置
        Properties props = new Properties();                    // 参数配置
        props.setProperty("mail.transport.protocol", "smtp");   // 使用的协议（JavaMail规范要求）
        props.setProperty("mail.smtp.host", myEmailSMTPHost);   // 发件人的邮箱的 SMTP 服务器地址
        props.setProperty("mail.smtp.auth", "true");            // 需要请求认证


        Authenticator authenticator = new Authenticator() {

            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(sender, sendPassword);
            }

        };

        // 使用环境属性和授权信息，创建邮件会话
        Session mailSession = Session.getInstance(props, authenticator);
        // 设置为debug模式, 可以查看详细的发送 log
        mailSession.setDebug(true);

        try {
            System.out.println("--send--"+content);
            // Instantiate a message
            Message msg = new MimeMessage(mailSession);

            //Set message attributes
            msg.setFrom(new InternetAddress(sender));
            InternetAddress[] address = {new InternetAddress(receiver)};
            msg.setRecipients(Message.RecipientType.TO, address);
            msg.setSubject("hhh");
            msg.setSentDate(new Date());
            msg.setContent(content , "text/html;charset=utf-8");

            //Send the message
            Transport.send(msg);
        }
        catch (MessagingException mex) {
            mex.printStackTrace();
        }

    }

}
