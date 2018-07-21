const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, save } = request;
const { Types } = require('mongoose');

describe('Reviewers API', () => {

    beforeEach(() => dropDatabase());

    let arthur;
    let mariah;

    beforeEach(() => {
        return save({
            name: 'Arthur Jen',
            company: 'Alchemy Movie Lab'
        }, 'reviewers')
            .then(data => arthur = data);
    });

    beforeEach(() => {
        return save({
            name: 'Mariah Adams',
            company: 'The Train Spotters'
        }, 'reviewers')
            .then(data => mariah = data);
    });

    let banks;
    beforeEach(() => {
        return save({
            title: 'Saving Mr. Banks',
            studio: Types.ObjectId(),
            released: 2013,
            cast: [{
                role: 'Walt Disney',
                actor: Types.ObjectId()
            }]
        }, 'films')
            .then(data => banks = data);
    });

    let review;
    beforeEach(() => {
        return save({
            rating: 5,
            reviewer: arthur._id,
            review: 'Rachel McAdams is the best!',
            film: banks._id,
        }, 'reviews')
            .then(data => review = data);
    });

    it('saves a reviewer', () => {
        assert.isOk(arthur._id);
        assert.isOk(mariah._id);
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
                    film: {
                        _id: banks._id,
                        title: banks.title
                    }
                }];
                assert.deepEqual(body, arthur);
            });
    });

    it('returns all reviewers on GET', () => {
        return request
            .get('/api/reviewers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [arthur, mariah]);
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
                assert.deepEqual(body, arthur);
            });
    });
});