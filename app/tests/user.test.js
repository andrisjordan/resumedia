const request = require('supertest')
let token
let id

describe('User Endpoints', function () {
    var app = require('../app')
    it('create new user', function (done) {
        request(app)
            .post('/user/signup')
            .send({
                "firstName": "Andras",
                "lastName": "Demszky",
                "email": "andrisjordan3@gmail.com",
                "password": "1234",
                "phoneNumber": "+31646879795",
                "gender": "M",
                "place": "Groningen",
                "language": "NL",
                "educations": [{
                    "start_date": "2020-08-14T20:21:15.723Z",
                    "end_date": "2018-08-14T20:21:15.723Z",
                    "school_name": "Nelson Mandela School",
                    "study": "Ib diploma",
                    "description": "Obtained diploma"
                }],
                "experiences": [{
                        "start_date": "2020-08-14T20:21:15.723Z",
                        "end_date": "2018-08-14T20:21:15.723Z",
                        "company_name": "Google",
                        "function": "Developer",
                        "description": "Front end"
                    },
                    {
                        "start_date": "2020-08-14T20:21:15.723Z",
                        "end_date": "2018-08-14T20:21:15.723Z",
                        "company_name": "Facebook",
                        "function": "Developer",
                        "description": "Front end"
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(200, done)
    });
    it('login', function (done) {
        request(app)
            .post('/user/login')
            .send({
                "email": "andrisjordan3@gmail.com",
                "password": "1234",
            })
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                token = response.body.token
                id = response.body._id
                done()
            })
    });
    it('update', function (done) {
        request(app)
            .patch('/user/' + id)
            .send({
                "gender": "F",
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .expect(200, done)
    });
    it('get', function (done) {
        request(app)
            .get('/user/' + id)
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .then(response => {
                expect(response.status)
                done()
            })
    });
    it('create cv', function (done) {
        request(app)
            .get('/user/export/' + id)
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .expect(200, done)
    });
    it('delete user', function (done) {
        request(app)
            .delete('/user/' + id)
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .expect(200, done)
    });
});