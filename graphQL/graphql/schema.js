const { buildSchema } = require('graphql');

// createUser Query would be like this:
    // mutation {
    //     createUser(userInput: {
    //       email: "test3@test.com",
    //       name: "nak",
    //       password:"password"
    //     }){
    //       _id
    //       email
    //     }
    // }


// login query would be like this:
    // {
    //     login(email:"test3@test.com", password: "password") {
    //       token
    //       userId
    //     }
    // }
// and returns like this:
    // {
    //     "data": {
    //       "login": {
    //         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTQxZWI1MjkyYTNjZDJmNTQ2NzE2MmUiLCJlbWFpbCI6InRlc3QzQHRlc3QuY29tIiwiaWF0IjoxNTgxMzc4NTU0LCJleHAiOjE1ODEzODIxNTR9.p2agGSoSx6fHqqhGfvn71ufQQ2qSoA8gZoVbtPMxhq4",
    //         "userId": "5e41eb5292a3cd2f5467162e"
    //       }
    //     }
    // }

// method name: Type
// "!" makes Type required
module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
