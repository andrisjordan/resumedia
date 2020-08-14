

var fs = require('fs');
var pdf = require('html-pdf');
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

let education =  '<div style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"><div style="line-height: 1.2; font-size: 12px; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">&nbsp;</p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;">{{school_name}} | {{start_date}} - {{end_date}}</span></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><strong><span style="font-size: 14px;">{{study}}</span></strong></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;">{{description}}</span></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">&nbsp;</p></div></div>'

let experience =  '<div style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"><div style="line-height: 1.2; font-size: 12px; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;"><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">&nbsp;</p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;">{{company_name}} | {{start_date}} - {{end_date}}</span></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><strong><span style="font-size: 14px;">{{function}}</span></strong></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;">{{description}}</span></p><p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">&nbsp;</p></div></div>'


module.exports = {
    readHTMLFile: function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                callback(err);

                throw err;
            }
            else {
                callback(null, html);
            }
        })
    },
    exportCV: function (user, cv) {
        this.readHTMLFile(__dirname + "/cvTemplate.html", function (err, html) {
            if (html) {
                html = html.toString()

                ///Changing placeholders for param values      
                html = html.replace("{{publicId}}", params.publicId)
                html = html.replace("{{startDate}}", params.startDate)
                html = html.replace("{{endDate}}", params.endDate)
                html = html.replace("{{percentageFee}}", params.percentageFee)
                html = html.replace("{{administrationFee}}", params.administrationFee)
                html = html.replace("{{vendorName}}", params.vendorName)
                html = html.replace("{{vendorEmail}}", params.vendorEmail)
                html = html.replace("{{items}}", newItems)
                html = html.replace("{{totalOrders}}", totalOrders)
                html = html.replace("{{totalSum}}", totalSum)
                html = html.replace("{{totalVAT}}", totalVatString)
                html = html.replace("{{total}}", params.total)

                var filename = './app/cv/' + cv._id + '.pdf'

                pdf.create(html, options).toFile(filename, function (err, res) {
                    if (err) return console.log(err);
                    console.log(res); // { filename: '/app/businesscard.pdf' }
                });


            } else {
                console.log(err)
            }
        })
    }

}



