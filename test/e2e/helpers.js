// const request = require('./request');
// const { checkOk } = request;

// function save(data, resource) {
//     return request
//         .post(`/api/${resource}`)
//         .send(data)
//         .then(checkOk)
//         .then(({ body }) => {
//             delete body.__v;
//             return body;
//         });
// }

// module.exports = save;