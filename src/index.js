import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { GRAPHQL_API } from './utils/constants';
import defaults from './utils/default';
import resolvers from './utils/resolvers';
import typeDefs from './utils/typedefs';
import './index.css';
import Container from './containers/Container';
import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
    uri: GRAPHQL_API,
    clientState: {
        defaults,
        resolvers,
        typeDefs
      }
});

ReactDOM.render(
    <ApolloProvider client={client} >
        <Container/>
    </ApolloProvider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
