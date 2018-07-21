const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, save, makeSimple } = request;

describe.only('Films API', () => {

    beforeEach(() => dropDatabase());

    let tom;
    beforeEach(() => {
        return save(
            {
                name: 'Tom Hanks',
                dob: new Date(1956, 6, 9),
                pob: 'Concord, CA'
            },
            'actors')
            .then(saved => tom = saved);
    });

    let disney;
    beforeEach(() => {
        return save(
            {
                name: 'Disney',
                address: {
                    city: 'Burbank',
                    state: 'California',
                    country: 'USA'
                } 
            },
            'studios')
            .then(saved => disney = saved);
    });

    let banks;
    beforeEach(() => {
        return save({
            title: 'Saving Mr. Banks',
            studio: disney._id,
            released: 2013,
            cast: [{
                role: 'Walt Disney',
                actor: tom._id
            }]
        }, 
        'films')
            .then(data => banks = data);
    });

    let mariah;
    beforeEach(() => {
        return save({
            name: 'Mariah Adams',
            company: 'The Train Spotters'
        }, 'reviewers')
            .then(data => mariah = data);
    });

    let review;
    beforeEach(() => {
        return save({
            rating: 5,
            reviewer: mariah._id,
            review: 'Tom Hanks is the best!',
            film: banks._id,
        }, 'reviews')
            .then(data => review = data);
    });


    it('saves a film', () => {
        assert.isOk(banks._id);
    });

    it('returns a film on GET', () => {
        return request
            .get(`/api/films/${banks._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, {
                    _id: banks._id,
                    title: banks.title,
                    studio: makeSimple(disney),
                    released: banks.released,
                    cast: [{
                        _id: banks.cast[0]._id,
                        role: banks.cast[0].role,
                        actor: makeSimple(tom)
                    }],
                    reviews: [{
                        _id: review._id,
                        rating: review.rating,
                        review: review.review,
                        reviewer: makeSimple(mariah)
                    }]
                });
            });
    });

    it('returns all films on GET', () => {
        return request
            .get('/api/films')
            .then(checkOk)
            .then(({ body }) => {
                delete banks.cast;
                delete disney.address;
                banks.studio = disney;
                assert.deepEqual(body, [banks]);
            });
    });

    it('Removes a film on DELETE', () => {
        return request
            .delete(`/api/films/${banks._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
            });
    });
});