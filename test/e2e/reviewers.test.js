const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, saveAll, makeSimple } = request;

describe('Reviewers API', () => {

    before(() => dropDatabase());

    let arthur, mariah;
    let review;
    let banks;

    before(() => {
        return saveAll()
            .then(data => {
                [arthur, mariah] = data.reviewers;
                review = data.reviews[1];
                banks = data.films[0];
            });
    });

    it('saves a reviewer', () => {
        assert.isOk(arthur._id);
        assert.isOk(mariah._id);
    });

    it('returns all reviewers on GET', () => {
        return request
            .get('/api/reviewers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [arthur, mariah]);
            });
    });

    it('returns a reviewer on GET', () => {
        return request
            .get(`/api/reviewers/${arthur._id}`)
            .then(checkOk)
            .then(({ body }) => {
                arthur.reviews = [{
                    _id: review._id,
                    rating: review.rating,
                    review: review.review,
                    film: makeSimple(banks)
                }];
                assert.deepEqual(body, arthur);
            });
    });

    it('updates a reviewer', () => {
        arthur.company = 'Netflix';
        return request
            .put(`/api/reviewers/${arthur._id}`)
            .send(arthur)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                delete arthur.reviews;
                assert.deepEqual(body, arthur);
            });
    });
});