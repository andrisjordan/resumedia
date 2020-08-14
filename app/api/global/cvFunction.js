var fs = require('fs');
const Promise = require('bluebird');
const pdf = Promise.promisifyAll(require('html-pdf'));
var options = {
    format: 'A4',
    footer: {
        "height": "28mm",
        "contents": {
            default: '<div style="width: 100%; text-align: center;"><span style="color: #444; font-size: 12px;">{{page}}</span>/<span style="font-size: 12px;">{{pages}}</span></div>', // fallback value
        }
    },
    header: {
        "height": "14mm",
        "contents": {
            default: '<div style="width: 100%; text-align: center;"></div>', // fallback value
        }
    }
};

const education = '<div style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"><div style="line-height: 1.2; font-size: 12px; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">&nbsp;</p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;">{{school_name}} | {{start_date}} - {{end_date}}</span></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><strong><span style="font-size: 14px;">{{study}}</span></strong></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;">{{description}}</span></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">&nbsp;</p></div></div>'

const experience = '<div style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"><div style="line-height: 1.2; font-size: 12px; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">&nbsp;</p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;">{{company_name}} | {{start_date}} - {{end_date}}</span></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><strong><span style="font-size: 14px;">{{function}}</span></strong></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;">{{description}}</span></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">&nbsp;</p></div></div>'


module.exports = {
    exportCV: function (user, cv) {
        var html = fs.readFileSync(__dirname + "/cvTemplate.html")
        if (html) {
            html = html.toString()

            var cvTitles

            if (user.language == "NL") {
                cvTitles = require("../local/NL.json")
            } else {
                cvTitles = require("../local/EN.json")
            }
            html = html.replace("{{email_lang}}", cvTitles.email)
            html = html.replace("{{email}}", user.email)
            html = html.replace("{{firstname_lang}}", cvTitles.firstname)
            html = html.replace("{{firstname}}", user.firstName)
            html = html.replace("{{lastname_lang}}", cvTitles.lastname)
            html = html.replace("{{lastname}}", user.lastName)
            html = html.replace("{{phone_lang}}", cvTitles.phone_number)
            html = html.replace("{{phone}}", user.phoneNumber)
            html = html.replace("{{place_lang}}", cvTitles.place)
            html = html.replace("{{place}}", user.place)
            html = html.replace("{{education_lang}}", cvTitles.education)
            html = html.replace("{{experience_lang}}", cvTitles.experience)

            var alleducations = ""
            for (var eduInd = 0; eduInd < cv.educations.length; eduInd++) {
                var startDate =  new Date(cv.educations[eduInd].start_date)
                var endDate 
                var endDateString
                if(cv.educations[eduInd].end_date_present){
                    endDateString = cvTitles.present
                } else {
                    endDate =  new Date(cv.educations[eduInd].end_date)
                    endDateString = endDate.getMonth() + 1 + "/" + endDate.getFullYear
                }
                var startDateString = startDate.getMonth() + 1 + "/" + startDate.getFullYear
                const currentEducation = education.replace("{{start_date}}", startDateString).replace("{{end_date}}", endDateString).replace("{{study}}", cv.educations[eduInd].study).replace("{{description}}", cv.educations[eduInd].description).replace("{{school_name}}", cv.experiences[eduInd].school_name)
                alleducations += currentEducation
            }

            var allexperiences = ""
            for (var eduInd = 0; eduInd < cv.experiences.length; eduInd++) {
                var startDate =  new Date(cv.experiences[eduInd].start_date)
                var endDate 
                var endDateString
                if(cv.experiences[eduInd].end_date_present){
                    endDateString = cvTitles.present
                } else {
                    endDate =  new Date(cv.experiences[eduInd].end_date)
                    endDateString = endDate.getMonth() + 1 + "/" + endDate.getFullYear
                }
                var startDateString = startDate.getMonth() + 1 + "/" + startDate.getFullYear
                const currentExp = experience.replace("{{start_date}}", startDateString).replace("{{end_date}}", endDateString).replace("{{function}}", cv.experiences[eduInd].study).replace("{{description}}", cv.experiences[eduInd].description).replace("{{company_name}}", cv.experiences[eduInd].company_name)
                allexperiences += currentExp
            }

            html = html.replace("{{experiences}}", allexperiences)
            html = html.replace("{{educations}}", alleducations)

            var filename = './app/cv/' + cv._id + '.pdf'
            options.filename = filename

            return pdf.createAsync(html, options)

        } else {
            console.log(err)
            return new Promise((resolve, reject) => { reject(false) })
        }
    }

}