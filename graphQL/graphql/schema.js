const { buildSchema } = require('graphql');

module.exports = buildSchema(
    // method name: Type
    // ! makes Type required
    `
        type TestData {
            text: String!
            views: Int!
        }
        type RootQuery {
            hello: TestData
        }
        schema {
            query: RootQuery
        }
`)
