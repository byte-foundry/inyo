import React, { Component } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import styled from 'react-emotion';
import { Body } from '../../utils/content'
import Landing from '../Landing';
import App from '../App';

const BodyMain = styled(Body)`
    nav {
        a {
            color: #61dafb;
            margin-right: 10px;
        }
    }
`;

class Container extends Component {
  render() {
    return (
        <BodyMain>
            <nav>
                <Link to='/'>
                    Landing
                </Link>
                <Link to='/app'>
                    App
                </Link>
            </nav>
            <main>
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route path="/app" component={App} />
                </Switch>
            </main>
        </BodyMain>
    );
  }
}

export default Container;