import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
        <Router>
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
                    <Route exact path="/" component={Landing} />
                    <Route path="/app" component={App} />
                </main>
            </BodyMain>
        </Router>
    );
  }
}

export default Container;