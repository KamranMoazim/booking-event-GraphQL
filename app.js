const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const {graphqlHTTP} = require('express-graphql');
// const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

const PORT = 8000;
// const Event = require('./models/event');
// const User = require('./models/user');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

// const events = [];

app.use(bodyParser.json());
app.use(cors());

// app.use(isAuth);

app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true,
    })
);

// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema: buildSchema(`
//         type Event {
//           _id: ID!
//           title: String!
//           description: String!
//           price: Float
//           date: String
//         }
//         type User {
//             _id: ID!
//             email: String!
//             password: String
//         }

//         input EventInput {
//           title: String!
//           description: String!
//           price: Float
//           date: String
//         }
//         input UserInput {
//             email: String!
//             password: String!
//         }

//         type RootQuery {
//             events: [Event!]!
//         }

//         type RootMutation {
//             createEvent(eventInput: EventInput): Event
//             createUser(userInput: UserInput): User
//         }

//         schema {
//             query: RootQuery
//             mutation: RootMutation
//         }
//     `),
//     rootValue: {
//         //   events: () => {
//         //     return events;
//         //   },
//         //   createEvent: args => {
//         //     const event = {
//         //       _id: Math.random().toString(),
//         //       title: args.eventInput.title,
//         //       description: args.eventInput.description,
//         //       price: args.eventInput.price?args.eventInput.price:0,
//         //       date: Date.now().toString()
//         //     };
//         //     events.push(event);
//         //     return event;
//         //   }
//         events: () => {
//             return Event.find()
//                 .then(events => {
//                     return events.map(event => {
//                     return { ...event._doc, _id: event.id };
//                     });
//                 })
//                 .catch(err => {
//                     throw err;
//                 });
//         },
//         // createEvent: args => {
//         //     const event = new Event({
//         //         title: args.eventInput.title,
//         //         description: args.eventInput.description,
//         //         price: args.eventInput.price?args.eventInput.price:0,
//         //         date: args.eventInput.date? new Date(args.eventInput.date) : Date.now().toString(), 
//         //     });
//         //     return event.save()
//         //     .then(result => {
//         //         // console.log(result);
//         //         return { ...result._doc, _id: result._doc._id.toString() };
//         //     })
//         //     .catch(err => {
//         //         console.log(err);
//         //         throw err;
//         //     });
//         // },
//         createEvent: args => {
//             const event = new Event({
//                 title: args.eventInput.title,
//                 description: args.eventInput.description,
//                 price: args.eventInput.price?args.eventInput.price:0,
//                 date: args.eventInput.date? new Date(args.eventInput.date) : Date.now().toString(), 
//                 creator: '6151e38b21696215370d2f67'
//             });
//             let createdEvent;
//             return event
//                 .save()
//                 .then(result => {
//                     createdEvent = { ...result._doc, _id: result._doc._id.toString() };
//                     return User.findById('6151e38b21696215370d2f67');
//                 })
//                 .then(user => {
//                     if (!user) {
//                         throw new Error('User not found.');
//                     }
//                     user.createdEvents.push(event);
//                     return user.save();
//                 })
//                 .then(result => {
//                     return createdEvent;
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     throw err;
//                 });
//         },
//         createUser: args => {
//             return User.findOne({ email: args.userInput.email })
//                 .then(user => {
//                     if (user) {
//                         throw new Error('User exists already.');
//                     }
//                     return bcrypt.hash(args.userInput.password, 12);
//                 })
//                 .then(hashedPassword => {
//                     const user = new User({
//                         email: args.userInput.email,
//                         password: hashedPassword
//                     });
//                     return user.save();
//                 })
//                 .then(result => {
//                         return { ...result._doc, password: null, _id: result.id };
//                 })
//                 .catch(err => {
//                         throw err;
//                 });
//         }
//     },
//     graphiql: true
//   })
// );

mongoose.connect("mongodb://localhost:27017/graphQL", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server is listening at port ${PORT}`));
    console.log("DB CONNECTED")
}).catch(()=>{
    console.log("ERROR")
})