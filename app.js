const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const PORT = 5000;
const Event = require('./models/event');

const app = express();

// const events = [];

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float
          date: String
        }

        input EventInput {
          title: String!
          description: String!
          price: Float
          date: String
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
    //   events: () => {
    //     return events;
    //   },
    //   createEvent: args => {
    //     const event = {
    //       _id: Math.random().toString(),
    //       title: args.eventInput.title,
    //       description: args.eventInput.description,
    //       price: args.eventInput.price?args.eventInput.price:0,
    //       date: Date.now().toString()
    //     };
    //     events.push(event);
    //     return event;
    //   }
    events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => {
              return { ...event._doc, _id: event.id };
            });
        })
          .catch(err => {
            throw err;
        });
    },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price?args.eventInput.price:0,
          date: args.eventInput.date? new Date(args.eventInput.date) : Date.now().toString(), 
        });
        return event.save()
          .then(result => {
            // console.log(result);
            return { ...result._doc, _id: result._doc._id.toString() };
        })
          .catch(err => {
            console.log(err);
            throw err;
        });
      }
    },
    graphiql: true
  })
);

mongoose.connect("mongodb://localhost:27017/graphQL", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server is listening at port ${PORT}`));
    console.log("DB CONNECTED")
}).catch(()=>{
    console.log("ERROR")
})