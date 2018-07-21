const { assert } = require('chai');
const request = require('./request');
const { Types } = require('mongoose');
const { dropDatabase } = require('./_db');
const { checkOk, save } = request;

describe('Actors API', () => {

    beforeEach(() => dropDatabase());

    let tom;
    let rachel;

    beforeEach(() => {
        return save({
            name: 'Tom Hanks',
            dob: new Date(1956, 6, 9),
            pob: 'Concord, CA'
        }, 'actors')
            .then(data => {
                tom = data;
            });
    });

    beforeEach(() => {
        return save({
            name: 'Rachel McAdams',
            dob: new Date(1978, 10, 17),
            pob: 'London, Canada'
        }, 'actors')
            .then(data => {
                rachel = data;
            });
    });

    let banks;
    beforeEach(() => {
        return save({
            title: 'Saving Mr. Banks',
            studio: Types.ObjectId(),
            released: 2013,
            cast: [{
                role: 'Walt Disney',
                actor: tom._id
            }]
        }, 'films')
            .then(data => banks = data);
    });

    it('saves an actor', () => {
        assert.isOk(tom._id);
        assert.isOk(rachel._id);
    });

   
    it('returns an actor on GET', () => {
        return request
            .get(`/api/actors/${tom._id}`)
            .then(checkOk)
            .then(({ body }) => {
                delete banks.cast;
                delete banks.studio;
                tom.films = [banks];
                assert.deepEqual(body, tom);
            });
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
                delete body.__v;
                assert.deepEqual(body, tom);
            });
    });

    it('deletes an actor', () => {
        return request
            .del(`/api/actors/${tom._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
            });
    });
});