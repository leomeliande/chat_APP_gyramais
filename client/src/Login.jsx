import  React, { Component, useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useMutation,
  useQuery,
  gql, 
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { Container, Row, Col, FormInput, Button } from "shards-react";
import apolloClient from './ApolloSetup';
import Chat from "./Chat";

const Login = () => {
    return (
        <div>
            <label>
                <b>Nome de usuário</b>
            </label>
            <input type="text" placeholder="Enter Username" name="uname" required></input>

        <button onclick>Login</button>
        </div>
    );
}

export default () => (
    <ApolloProvider client={apolloClient}>
      <Login />
    </ApolloProvider>
  );