import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { 
  persistCache, 
  LocalStorageWrapper
} from 'apollo3-cache-persist';
import DebounceLink from 'apollo-link-debounce'
import reportWebVitals from './reportWebVitals';
// Queries
import { LOCAL_APP } from './queries/app';
// App Component
import App from './App';
// Style
import './index.css'

const DEFAULT_DEBOUNCE_TIMEOUT = 2000

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
})

const cache = new InMemoryCache()

const authLink = setContext((request, {headers, cache}) => {
  const data =  cache.readQuery({
    query: LOCAL_APP.QUERY
  })
  const {token} = data
    ? data
    : {}
  return {
    headers: {
      ...headers,
      authorization: token && token.length > 0 
        ? `Bearer ${token}` 
        : ''
    }
    
  }
})


persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage)
}).then(() => {
  const client = new ApolloClient({
    cache,
    link: ApolloLink.from([
      new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT),
      authLink,
      httpLink
    ])
  })
  ReactDOM.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
  
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
