package p2p.service;

import java.util.Properties;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class EmailService {
    public static void sendOtpEmail(String toEmail, String otp) throws Exception {
        System.out.println("HOST = " + System.getenv("SMTP_HOST"));
        System.out.println("PORT = " + System.getenv("SMTP_PORT"));
        System.out.println("EMAIL = " + System.getenv("SMTP_EMAIL"));
        System.out.println("PASS = " + System.getenv("SMTP_PASSWORD"));
        String host = System.getenv("SMTP_HOST");
        String port = System.getenv("SMTP_PORT");
        String fromEmail = System.getenv("SMTP_EMAIL");
        String password = System.getenv("SMTP_PASSWORD");

        if (host == null || port == null || fromEmail == null || password == null ||
            host.isBlank() || port.isBlank() || fromEmail.isBlank() || password.isBlank()) {
            System.err.println("=========================================");
            System.err.println("SMTP configuration is incomplete in environment variables.");
            System.err.println("Skip sending mail. Printed OTP code: " + otp);
            System.err.println("=========================================");
            return;
        }

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);
        props.put("mail.smtp.ssl.protocols", "TLSv1.2 TLSv1.3");

        if ("465".equals(port)) {
            props.put("mail.smtp.socketFactory.port", "465");
            props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            props.put("mail.smtp.socketFactory.fallback", "false");
            props.put("mail.smtp.ssl.enable", "true");
        }

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(fromEmail, "PeerLink Support"));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
        message.setSubject("Your PeerLink Verification Code");
        
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;\">"
                + "<h2 style=\"color: #6366f1; text-align: center;\">PeerLink Verification</h2>"
                + "<p style=\"color: #374151;\">Hello,</p>"
                + "<p style=\"color: #374151;\">Thank you for registering with PeerLink. Please use the verification code below to complete your registration. This code is valid for <strong>5 minutes</strong>.</p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<span style=\"font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e1b4b; background-color: #f3f4f6; padding: 10px 20px; border-radius: 8px; border: 1px dashed #6366f1; display: inline-block;\">" + otp + "</span>"
                + "</div>"
                + "<p style=\"color: #374151;\">If you did not request this code, you can safely ignore this email.</p>"
                + "<hr style=\"border: none; border-top: 1px solid #e5e7eb; margin-top: 30px;\">"
                + "<p style=\"font-size: 11px; color: #9ca3af; text-align: center;\">This is an automated message. Please do not reply to this email.</p>"
                + "</div>";

        message.setContent(htmlContent, "text/html; charset=utf-8");

        try { Transport.send(message); } catch(Exception e) { e.printStackTrace(); throw e; }
        System.out.println("OTP email sent successfully to: " + toEmail);
    }
}
