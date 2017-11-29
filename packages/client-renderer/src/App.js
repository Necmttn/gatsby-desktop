import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import cors from 'cors'

const whitelist = [
  'http://localhost:3000'
];
const corsOpti

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://127.0.0.1:8000' }),
  cache: new InMemoryCache()
});


client.query({
  query: gql`
    query TodoApp {
      todos {
        id
        text
        completed
      }
    }
  `,
})
  .then(data => console.log(data))
  .catch(error => console.error(error));


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Gatsby Desktop</h1>
        </header>
        <div>
          connect to gatsby process.
        </div>
      </div>
    );
  }
}

export default App;
