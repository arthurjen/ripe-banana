const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, save } = request;

describe('Films API', () => {

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

    //TODO: 
    it('returns a film on GET', () => {
        return request
            .get(`/api/films/${banks._id}`)
            .then(checkOk)
            .then(({ body }) => {
                delete review.createdAt;
                delete review.updatedAt;
                delete review.film;
                review.reviewer = {
                    _id: mariah._id,
                    name: mariah.name
                };
                banks.studio = {
                    _id: disney._id,
                    name: disney.name
                };
                banks.cast[0].actor = {
                    _id: tom._id,
                    name: tom.name
                };
                banks.reviews = [review];
                assert.deepEqual(body, banks);
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