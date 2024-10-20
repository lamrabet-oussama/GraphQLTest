import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDes } from "./schema.js";
import _db from "./_db.js";
//server setup
const resolvers = {
  Query: {
    games() {
      return _db.games;
    },
    game(_, args) {
      return _db.games.find((game) => args.id === game.id);
    },
    reviews() {
      return _db.reviews;
    },
    review(_, args) {
      return _db.reviews.find((review) => review.id === args.id);
    },
    authors() {
      return _db.authors;
    },
    author(_, args) {
      return _db.authors.find((a) => a.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
      return _db.reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return _db.authors.find((auth) => auth.id === parent.author_id);
    },
    game(parent) {
      return _db.games.find((g) => g.id === parent.game_id);
    },
  },
  Author: {
    reviews(parent) {
      return _db.reviews.filter((r) => r.author_id === parent.id);
    },
  },
  Mutation: {
    deleteGame(_, args) {
      _db.games = _db.games.filter((g) => g.id !== args.id);
    },
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString(),
      };
      _db.games.push(game);
      return game;
    },
    updateGame(_, args) {
      _db.games.map((g) => {
        if (g.id === args.id) {
          return { ...g, ...args.edits };
        }

        return g;
      });
      return _db.games.find((g) => g.id === args.id);
    },
  },
};
const server = new ApolloServer({
  typeDefs: typeDes,
  resolvers,
});
const url = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("Server ready at port ", 4000);
