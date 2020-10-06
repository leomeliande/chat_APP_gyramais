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

const MessageQuery = gql`
    query {
        messages {
            id
            user
            message
        }
    }
`;

const CreateMessageMutation = gql`
    mutation($user: String!, $message: String!) {
        createMessage(user: $user, message: $message) {
            id
            user
            message
        }
    }
`;

const MessageSubscription = gql`
    subscription {
        newMessage {
            id
            user
            message
        }
    }
`;

const Messages = ({ user }) => {
    /*const { data } = useQuery(
        MessageQuery,
        {
          fetchPolicy: "cache-and-network"
        }
      );*/
      
    const { subscribeToMore, refetch, data } = useQuery(
        MessageQuery,
    );

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: MessageSubscription,
            updateQuery: prev => {
                refetch();
                return prev;
            }
        });
        return () => unsubscribe();
    }, [subscribeToMore]); 
    
    return (
    <>
        {data.messages.map(({id, user: messageUser, message }) => (
            <div
                style={{
                    display: "flex",
                    justifyContent: user === messageUser ? "flex-end" : "flex-start",
                    paddingBottom: "1em",
                }}
            >
                {user !== messageUser && (
                    <div
                        style={{
                            height: 50,
                            width: 50,
                            marginRight: "0.5em",
                            border: "2px solid #e5e6ea",
                            borderRadius: 25,
                            textAlign: "center",
                            fontSize: "18pt",
                            paddingTop: 5,
                        }}
                    >
                        {messageUser.slice(0, 2).toUpperCase()}
                    </div>
                )}
                <div
                    style={{
                        background: user === messageUser ? "green" : "#e5e6ea",
                        color: user === messageUser ? "white" : "black",
                        padding: "1em",
                        borderRadius: "1em",
                        maxWidth: "60%",
                    }}
                >
                    {message}
                </div>
            </div>    
        ))}
    </>
    )
}

const Chat = () => {

    const [state, stateSet] = useState({
        user: "Leonardo",
        message: "",
    });
    
    const [ createMessage ] = useMutation(CreateMessageMutation);
    /*const { subscribeToMore, refetch, ...result } = useQuery(
        MessageQuery,
    );

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: MessageSubscription,
            updateQuery: prev => {
                refetch();
                console.log(prev);
            }
        });
        console.log(() => unsubscribe());
    }, [subscribeToMore]);*/

    const { loading, error } = useQuery(
        MessageQuery,
    );

    if (loading) return 'Carregando...';
    if (error) return `Erro: ${error.message}`;
    
    const onSend = () => {
        if (state.message.length > 0) {
            createMessage({
            variables: state,
          });
        }
        stateSet({
          ...state,
          message: "",
        });
    };

    return (
    <Container>
        <Messages user={state.user} />
        <Row>
            <Col xs={2} style={{ padding: 0 }}>
                <FormInput
                    label="User"
                    value={state.user}
                    onChange={(evt) =>
                        stateSet({
                            ...state,
                            user: evt.target.value,
                        })
                    }
                />
            </Col>
            <Col xs={8}>
                <FormInput
                    label="Message"
                    value={state.message}
                    onChange={(evt) =>
                        stateSet({
                            ...state,
                            message: evt.target.value,
                        })
                    }
                    onKeyUp={(evt) => {
                        if (evt.keyCode === 13) {
                            onSend();
                        }
                    }}
                />
            </Col>
            <Col xs={2} style={{ padding: 0 }}>
                <Button onClick={() => onSend()} style={{ width: "100%" }}>
                    Enviar
                </Button>
            </Col>
        </Row>
    </Container>
    );
};


export default () => (
  <ApolloProvider client={apolloClient}>
    <Chat />
  </ApolloProvider>
);