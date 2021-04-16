const { ApolloServer, gql } = require("apollo-server");
const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");

dotenv.config();

const { DB_URI, DB_NAME } = process.env;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }
  type TaskList {
    id: ID!
    createdAt: String!
    title: String!
    progress: Float!

    users: [User!]!
    todos: [ToDo!]!
  }

  type ToDo {
    id: ID!
    content: String!
    isCompleted: Boolean!
    taskList: TaskList!
  }
`;

const resolvers = {};

const start = async () => {
  // DB connection
  const client = new MongoClient(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(DB_NAME);
  const context = { db };

  const server = new ApolloServer({ typeDefs, resolvers, context });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start();
