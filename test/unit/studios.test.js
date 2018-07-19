const chai = require('chai');
const { assert } = chai;
const Studio = require('../../lib/models/studio');
// const { getErrors } = require('./helpers');

describe('Studio model', () => {

    it('validates good model', () => {
        const data = {
            name: 'Warner Bros.',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            }    
        };
        const studio = new Studio(data);

        const json = studio.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(studio.validateSync());
    });

});