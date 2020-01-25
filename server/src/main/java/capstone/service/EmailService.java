package capstone.service;

import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import capstone.util.Constants;

@Service
@Transactional
public class EmailService {
	@Autowired
	private JavaMailSender mailSender;
	
    public Boolean sendEmail(String subjectLine, String messageBody, String toEmail ) {
    		MimeMessagePreparator preparator = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws Exception {
                mimeMessage.setRecipient(Message.RecipientType.TO,
                        new InternetAddress(toEmail));
                mimeMessage.setFrom(new InternetAddress(Constants.CSCI401_EMAIL));
                mimeMessage.setSubject(subjectLine);
                mimeMessage.setContent(getContent(messageBody), "text/html; charset=utf-8");
            }
        };

        try {
            this.mailSender.send(preparator);
            return true;
        }
        catch (MailException ex) {
            // simply log it and go on...
            System.err.println(ex.getMessage());
        }
        return false;
	}

  public String getContent(String body) {
    String html = "<html style=\"width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;\">" +
"<body style=\"width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;\">" +
  "<div style=\"background-color:#F6F6F6;\">"+
    "<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;\">"+
      "<tr style=\"border-collapse:collapse;\">"+
        "<td valign=\"top\" style=\"padding:0;Margin:0;\">"+
          "<table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;\">"+
           "<tr style=\"border-collapse:collapse;\">"+
              "<td align=\"center\" style=\"padding:0;Margin:0;background-color:transparent;\" bgcolor=\"transparent\">"+
                "<div>"+
                  "<table bgcolor=\"transparent\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;\">"+
                    "<tr style=\"border-collapse:collapse;\">"+
                      "<td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;\">"+
                        "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;\">"+
                          "<tr style=\"border-collapse:collapse;\">"+
                            "<td width=\"560\" align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;\">"+
                              "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;\">"+
                                "<tr style=\"border-collapse:collapse;\">"+
                                  "<td align=\"center\" style=\"padding:0;Margin:0;\"><img "+
                                      "src=\"https://16mhpx3atvadrnpip2kwi9or-wpengine.netdna-ssl.com/wp-content/uploads/2016/10/USC-Shield.png\""+
                                      "alt"+
                                      "style=\"display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;\""+
                                      "width=\"400\"></td>"+
                                "</tr>"+
                                "<tr style=\"border-collapse:collapse;\">"+
                                  "<td align=\"center\" height=\"0\" style=\"padding:0;Margin:0;\"></td>"+
                                "</tr>"+
                              "</table>"+
                            "</td>"+
                          "</tr>"+
                        "</table>"+
                      "</td>"+
                    "</tr>"+
                    "<tr style=\"border-collapse:collapse;\">"+
                      "<td align=\"left\" style=\"padding:0;Margin:0;padding-left:30px;padding-right:30px;\">"+
                        "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\""+
                          "style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;\">"+
                          "<tr style=\"border-collapse:collapse;\">"+
                            "<td width=\"540\" align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;\">"+
                              "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\""+
                                "style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;\">"+
                                "<tr style=\"border-collapse:collapse;\">"+
                                  "<td align=\"center\" style=\"padding:0;Margin:0;padding-top:5px;padding-bottom:5px;\">"+
                                    "<h1 style=\"Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#212121;\">"+
                                      "CSCI401 Capstone"+
                                    "</h1>"+
                                  "</td>"+
                                "</tr>"+
                              "</table>"+
                            "</td>"+
                          "</tr>"+
                        "</table>"+
                      "</td>"+
                    "</tr>"+
                  "</table>"+
                "</div>"+
              "</td>"+
            "</tr>"+
          "</table>"+
          "<table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;\">"+
            "<tr style=\"border-collapse:collapse;\">"+
              "<td align=\"center\" bgcolor=\"transparent\" style=\"padding:0;Margin:0;background-color:transparent;\">"+
                "<table bgcolor=\"transparent\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;\">"+
                  "<tr style=\"border-collapse:collapse;\">"+
                    "<td align=\"left\" style=\"Margin:0;padding-top:15px;padding-bottom:15px;padding-left:30px;padding-right:30px;border-radius:10px 10px 0px 0px;background-color:#FFFFFF;background-position:left bottom;\" bgcolor=\"#ffffff\">"+
                     "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;\">"+
                        "<tr style=\"border-collapse:collapse;\">"+
                          "<td width=\"540\" align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;\">"+
                            "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left bottom;\">"+
                             " <tr style=\"border-collapse:collapse;\">"+
                               " <td align=\"center\" style=\"padding:0;Margin:0;\">"+
                                  "<p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#131313;\">"+
                                    body +
                                  "</p>" +
                                "</td>"+
                              "</tr>"+
                            "</table>"+
                          "</td>"+
                        "</tr>"+
                      "</table>"+
                   "</td>"+
                  "</tr>"+
                "</table>"+
              "</td>"+
            "</tr>"+
          "</table>"+
          "<table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;\">"+
           "<tr style=\"border-collapse:collapse;\">"+
             "<td align=\"center\" style=\"padding:0;Margin:0;\">"+
                "<table bgcolor=\"#ffffff\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;\">"+
                  "<tr style=\"border-collapse:collapse;\">"+
                   "<td align=\"left\" style=\"padding:0;Margin:0;padding-top:20px;padding-left:30px;padding-right:30px;\">"+
                      "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;\">"+
                        "<tr style=\"border-collapse:collapse;\">"+
                         "<td width=\"540\" align=\"center\" valign=\"top\" style=\"padding:0;Margin:0;\">"+
                            "<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;\">"+
                              "<tr style=\"border-collapse:collapse;\">"+
                                "<td align=\"center\" style=\"padding:0;Margin:0;display:none;\"></td>"+
                              "</tr>"+
                            "</table>"+
                          "</td>"+
                        "</tr>"+
                      "</table>"+
                    "</td>"+
                  "</tr>"+
                "</table>"+
              "</td>"+
            "</tr>"+
          "</table>"+
        "</td>"+
      "</tr>"+
    "</table>"+
  "</div>"+
"</body>"+
"</html>";
    return html;
  }
}
