const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');
const save = require('./helpers');

const { checkOk } = request;

describe('Studios API', () => {

    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('films'));

    let warner;
    let disney;

    beforeEach(() => {
        return save({
            name: 'Warner Bros.',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            } 
        }, 'studios')
            .then(data => warner = data);
    });

    beforeEach(() => {
        return save({
            name: 'Disney',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            } 
        }, 'studios')
            .then(data => disney = data);
    });

    let banks;
    beforeEach(() => {
        return save({
            title: 'Saving Mr.Banks',
            released: 2013,
            studio: disney._id
        }, 'films')
            .then(saved => banks = saved);
    });

    it('saves a studio', () => {
        assert.isOk(warner._id);
        assert.isOk(disney._id);
    });

    it('returns a studio on GET', () => {
        return request
            .get(`/api/studios/${disney._id}`)
            .then(checkOk)
            .then(({ body }) => {
                disney.films = [{
                    _id: banks._id,
                    title: banks.title
                }];
                assert.deepEqual(body, disney);
            });
    });

    it('returns all studios on GET', () => {
        return request
            .get('/api/studios')
            .then(checkOk)
            .then(({ body }) => {
                delete warner.address;
                delete disney.address;
                assert.deepEqual(body, [warner, disney]);
            });
    });

    it('Removes a studio on DELETE', () => {
        return request
            .delete(`/api/studios/${warner._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
                return request.get('/api/studios');
            })
            .then(checkOk)
            .then(({ body }) => {
                delete disney.address;
                assert.deepEqual(body, [disney]);
            });
    });
    
    //TODO: studios cannot be deleted if they exist as properties of films/actors
    it('DOES NOT remove a studio if it exists as a property of a film', () => {
        return request
            .delete(`/api/studios/${warner._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isFalse(body.removed);
            });
    });
});