const { createServer } = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../../lib/app');
const server = createServer(app);
const request = chai.request(server).keepOpen();

request.checkOk = res => {
    if(res.status !== 200) throw new Error('expected 200 http status code');
    return res;
};

request.save = (data, resource) => {
    return request
        .post(`/api/${resource}`)
        .send(data)
        .then(this.checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });
};

// request.dropAllCollections = () => {
//     dropDatabase('banana');
// };

request.makeSimple = data => {
    return {
        _id: data._id,
        title: data.title,
        name: data.name
    };
};

after(done => server.close(done));

module.exports = request;
