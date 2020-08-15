var fs = require('fs');
const Promise = require('bluebird');
const pdf = Promise.promisifyAll(require('html-pdf'));
var options = {
    format: 'A4',
    footer: {
        "height": "28mm",
        "contents": {
            default: '<div style="width: 100%; text-align: center;"></div>', // fallback value
        }
    },
    header: {
        "height": "14mm",
        "contents": {
            default: '<div style="width: 100%; text-align: center;"></div>', // fallback value
        }
    }
};


module.exports = {
    exportCV: function (user, template) {
        var html = fs.readFileSync(__dirname + "/" + template + "/" + template + ".html")
        var htmledu = fs.readFileSync(__dirname + "/" + template + "/" + template + "Edu.html")
        var htmlexp = fs.readFileSync(__dirname + "/" + template + "/" + template + "Exp.html")
        if (html) {
            html = html.toString()

            const education = htmledu.toString()
            const experience = htmlexp.toString()

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

            var alleducations = insertElements(user.educations, cvTitles, education, "edu")

            var allexperiences = insertElements(user.experiences, cvTitles, experience, "exp")

            html = html.replace("{{experiences}}", allexperiences)
            html = html.replace("{{educations}}", alleducations)

            var filename = './app/cv/' + user._id + '.pdf'
            options.filename = filename

            return pdf.createAsync(html, options)

        } else {
            console.log(err)
            return new Promise((resolve, reject) => {
                reject(false)
            })
        }
    }

}

function monthWithZero(date) {
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    return month
}

function insertElements(elements, cvTitles, html, type){
    var all = ""
    for (var ind = 0; ind < elements.length; ind++) {
        var startDate = new Date(elements[ind].start_date)
        var endDate
        var endDateString
        if (elements[ind].end_date_present) {
            endDateString = cvTitles.present
        } else {
            endDate = new Date(elements[ind].end_date)
            endDateString = monthWithZero(endDate) + " / " + endDate.getFullYear()
        }
        var startDateString = monthWithZero(startDate) + " / " + startDate.getFullYear()
        var current
        if(type == "edu"){
            current = html.replace("{{start_date}}", startDateString).replace("{{end_date}}", endDateString).replace("{{study}}", elements[ind].study).replace("{{description}}", elements[ind].description).replace("{{school_name}}", elements[ind].school_name)
        } else {
            current = html.replace("{{start_date}}", startDateString).replace("{{end_date}}", endDateString).replace("{{function}}", elements[ind].function).replace("{{description}}", elements[ind].description).replace("{{company_name}}", elements[ind].company_name)
        }
        all += current
    }
    return all
}