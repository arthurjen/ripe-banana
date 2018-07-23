module.exports = {
    studios: [
        {
            name: 'Warner Bros.',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            } 
        },
        {
            name: 'Disney',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            } 
        }
    ],
    actors: [
        {
            name: 'Tom Hanks',
            dob: new Date(1956, 6, 9),
            pob: 'Concord, CA'
        },
        {
            name: 'Rachel McAdams',
            dob: new Date(1978, 10, 17),
            pob: 'London, Canada'
        },
        {
            name: 'Emma Thompson',
            dob: new Date(1959, 3, 15),
            pob: 'London, England'
        }
    ],
    reviewers: [
        {
            name: 'Arthur Jen',
            company: 'Alchemy Movie Lab'
        },
        {
            name: 'Mariah Adams',
            company: 'The Train Spotters'
        }
    ],
    films: [
        {
            title: 'Saving Mr. Banks',
            // studio: disney._id,
            released: 2013,
            cast: [
                {
                    role: 'Walt Disney',
                    // actor: tom._id
                },
                {
                    role: 'P.L. Travers',
                    // actor: emma._id
                }
            ]
        },
        {
            title: 'Game Night',
            // studio: warner._id,
            released: 2018,
            cast: []
        }
    ],
    reviews: [
        {
            rating: 5,
            // reviewer: mariah._id,
            review: 'Tom Hanks is the best!',
            // film: banks._id,
        },
        {
            rating: 1,
            // reviewer: arthur._id,
            review: 'Haven\'t even seen the movie...',
            // film: banks._id,
        }
    ]
};
