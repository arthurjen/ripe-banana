const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, save } = request;
const { Types } = require('mongoose');

describe.only('Reviews API', () => {

    beforeEach(() => dropDatabase());
    
    
    let mariah;
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
            reviewer: mariah._id,
            review: 'Tom Hanks is the best!',
            film: banks._id,
        }, 'reviews')
            .then(data => review = data);
    });

    it('saves a review', () => {
        assert.isOk(review._id);
    });

    it('returns all reviews on GET', () => {
        return request
            .get('/api/reviews')
            .then(checkOk)
            .then(({ body }) => {
                delete review.reviewer;
                delete review.createdAt;
                delete review.updatedAt;
                review.film = {
                    _id: banks._id,
                    title: banks.title
                };
                assert.deepEqual(body, [review]);
            });
    });

});