var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "smtp.qq.com",
    secureConnection: true,
    port: 465,
    auth: {
        user: "19616158@qq.com",
        pass: "uwbrezlxtzrcbhfa"
    }
});

module.exports = {
    sendMail: function(mailObj){
        var question = "来自" + mailObj.company + "的" + mailObj.name + ", 职务为：" + mailObj.title + "<br>" +
                "联系电话: " + mailObj.phoneNumber + "<br>" +
            "询问" + mailObj.queryType + "的问题：<br>" + mailObj.question;

        var mailObj = {
            from: "19616158@qq.com",
            to: "19616158@qq.com",
            subject: "有人联系我们",
            html: question
        }

        smtpTransport.sendMail(mailObj, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }
            smtpTransport.close();
        });
    }
}