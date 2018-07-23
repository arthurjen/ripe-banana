const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, saveAll, makeSimple } = request;

describe('Studios API', () => {

    beforeEach(() => dropDatabase());

    let warner, disney;
    let banks, gameNight;

    beforeEach(() => {
        const data = {
            name: 'Warner Bros.',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            }    
        };
        return request
            .post('/api/studios')
            .send(data)
            // .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                warner = body;
            });
        // return saveAll()
        //     .then(data => {
        //         [warner, disney] = data.studios;
        //         [banks, gameNight] = data.films;
        //     });
    });    

    it.only('saves a studio', () => {
        assert.isOk(warner._id);
        // assert.isOk(disney._id);
    });

    it('returns a studio on GET', () => {
        return request
            .get(`/api/studios/${disney._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, {
                    _id: disney._id,
                    name: disney.name,
                    address: disney.address,
                    films: [makeSimple(banks)]
                });
            });
    });

    it.only('returns all studios on GET', () => {
        return request
            .get('/api/studios')
            .then(checkOk)
            .then(({ body }) => {
                delete warner.address;
                // delete disney.address;
                assert.deepEqual(body, [warner]);
            });
    });

    it('DOES NOT remove a studio if it exists as a property of a film', () => {
        return request
            .delete(`/api/studios/${warner._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isFalse(body.removed);
            });
    });

    it('Removes a studio on DELETE', () => {
        return request
            .delete(`/api/films/${gameNight._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
                return request
                    .delete(`/api/studios/${warner._id}`);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
            });
    });
    
});