const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const save = require('./helpers');

const { checkOk } = request;

describe('Films API', () => {

    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));

    let tom;
    beforeEach(() => {
        return save(
            {
                name: 'Tom Hanks',
                dob: new Date(1956, 6, 9),
                pob: 'Concord, CA'
            },
            'actors')
            .then(checkOk)
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
            .then(data => {
                banks = data;
            });
    });

    it('saves a film', () => {
        assert.isOk(banks._id);
    });

    //TODO: 
    it.skip('returns a film on GET', () => {
        
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

    it('updates a film', () => {
        banks.released = 2014;
        return request
            .put(`/api/films/${banks._id}`)
            .send(banks)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, banks);
            });
    });
});