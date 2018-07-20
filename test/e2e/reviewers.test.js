const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./_db');

const { checkOk } = request;

describe('Reviewers API', () => {

    beforeEach(() => dropCollection('reviewers'));

    let arthur;
    let mariah;

    function save(reviewer) {
        return request
            .post('/api/reviewers')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }

    beforeEach(() => {
        return save({
            name: 'Arthur Jen',
            company: 'Alchemy Movie Lab'
        })
            .then(data => {
                arthur = data;
            });
    });

    beforeEach(() => {
        return save({
            name: 'Mariah Adams',
            company: 'The Train Spotters'
        })
            .then(data => {
                mariah = data;
            });
    });

    it('saves a reviewer', () => {
        assert.isOk(arthur._id);
        assert.isOk(mariah._id);
    });

    //TODO: 
    it.skip('returns a reviewer on GET', () => {
        
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
                assert.deepEqual(body, arthur);
            });
    });
});