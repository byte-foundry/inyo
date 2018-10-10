import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from "react-apollo";
import './index.css';
import Container from './containers/Container';
import client from './utils/graphQLConfig';
import * as serviceWorker from './serviceWorker';



ReactDOM.render(
    <ApolloProvider client={client} >
        <Container/>
    </ApolloProvider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
