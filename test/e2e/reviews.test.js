const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, saveAll, makeSimple } = request;

describe('Reviews API', () => {

    beforeEach(() => dropDatabase());
    
    let banks;
    let mariahReview, arthurReview;
    
    beforeEach(() => {
        return saveAll()
            .then(data => {
                banks = data.films[0];
                [mariahReview, arthurReview] = data.reviews;
            });
    });

    it('saves a review', () => {
        assert.isOk(mariahReview._id);
        assert.isOk(arthurReview._id);
    });

    it('returns all reviews on GET', () => {
        return request
            .get('/api/reviews')
            .then(checkOk)
            .then(({ body }) => {
                mariahReview = {
                    _id: mariahReview._id,
                    rating: mariahReview.rating,
                    review: mariahReview.review,
                    film: makeSimple(banks)
                };
                arthurReview = {
                    _id: arthurReview._id,
                    rating: arthurReview.rating,
                    review: arthurReview.review,
                    film: makeSimple(banks)
                };
                assert.deepEqual(body, [mariahReview, arthurReview]);
            });
    });

});