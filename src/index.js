import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { NhostProvider } from '@nhost/react';
import App from './App';
import { nhost } from './utils/nhost';
import { apolloClient } from './utils/apollo';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* NhostProvider exposes auth state hooks across the app. */}
    <NhostProvider nhost={nhost}>
      {/* ApolloProvider enables useQuery/useMutation for GraphQL CRUD. */}
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </NhostProvider>
  </React.StrictMode>
);
