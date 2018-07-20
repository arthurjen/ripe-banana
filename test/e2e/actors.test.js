const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');

const { checkOk } = request;

describe('Actors API', () => {

    beforeEach(() => dropCollection('actors'));

    let tom;
    let rachel;

    function save(actor) {
        return request
            .post('/api/actors')
            .send(actor)
            .then(checkOk)
            .then(({ body }) => body);
    }

    beforeEach(() => {
        return save({
            name: 'Tom Hanks',
            dob: new Date(1956, 6, 9),
            pob: 'Concord, CA'
        })
            .then(data => {
                tom = data;
            });
    });

    beforeEach(() => {
        return save({
            name: 'Mariah Adams',
            dob: new Date(1978, 10, 17),
            pob: 'London, Canada'
        })
            .then(data => {
                rachel = data;
            });
    });

    it('saves an actor', () => {
        assert.isOk(tom._id);
        assert.isOk(rachel._id);
    });

    //TODO: 
    it.skip('returns an actor on GET', () => {
        
    });

    it('returns all actors on GET', () => {
        return request
            .get('/api/actors')
            .then(checkOk)
            .then(({ body }) => {
                delete tom.dob;
                delete rachel.dob;
                delete tom.pob;
                delete rachel.pob;
                assert.deepEqual(body, [tom, rachel]);
            });
    });

    it('updates an actor', () => {
        tom.pob = 'Los Angeles, CA';
        return request
            .put(`/api/actors/${tom._id}`)
            .send(tom)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, tom);
            });
    });

    it('deletes an actor', () => {
        return request
            .del(`/api/actors/${tom._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
                return request.get('/api/actors');
            })
            .then(checkOk)
            .then(({ body }) => {
                delete rachel.dob;
                delete rachel.pob;
                assert.deepEqual(body, [rachel]);
            });
    });
});