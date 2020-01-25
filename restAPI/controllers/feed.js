const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First Post',
                conent: 'This is the first post!',
                imageUrl: 'images/michelle-spollen-c9MFM8rSMsQ-unsplash.jpg',
                creator: {
                    name: 'Nakamura'
                },
                createdAt: new Date()
            }
        ]
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({
                message: 'Validation failed, entered data is incorrect',
                errors: errors.array()
            })
    }
    const title = req.body.title;
    const content = req.body.content;
    // create post in db
    res.status(201).json({
        message: 'Post created Successfully',
        post: {
            _id: new Date().toISOString().replace(/:/g,'-'),
            title: title,
            content: content,
            creator: { name: 'Nakamura'},
            createdAt: new Date()
        }
    });
}