const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');

const { checkOk } = request;

describe('Studios API', () => {

    beforeEach(() => dropCollection('studios'));

    let warner;
    let disney;

    function save(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    beforeEach(() => {
        return save({
            name: 'Warner Bros.',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            } 
        })
            .then(data => {
                warner = data;
            });
    });

    beforeEach(() => {
        return save({
            name: 'Disney',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            } 
        })
            .then(data => {
                disney = data;
            });
    });

    it('saves a studio', () => {
        assert.isOk(warner._id);
        assert.isOk(disney._id);
    });

    //TODO: 
    it.skip('returns a studio on GET', () => {
        
    });

    it('returns all studios on GET', () => {
        return request
            .get('/api/studios')
            .then(checkOk)
            .then(({ body }) => {
                delete warner.address;
                delete disney.address;
                delete warner.__v;
                delete disney.__v;
                assert.deepEqual(body, [warner, disney]);
            });
    });
});