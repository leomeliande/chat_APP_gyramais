import React, { Component, useState, useEffect, useRef } from "react";
import {
    ApolloProvider,
    useMutation,
    useQuery,
} from "@apollo/client";
import { Container, Row, Col, FormInput, Button } from "shards-react";
import apolloClient from "./ApolloSetup";
import { useToasts } from 'react-toast-notifications'
import "./index.css";

import {
    MessageQuery,
    CreateMessageMutation,
    MessageSubscription,
} from "./Chat-query"

import {
    NotificationQuery,
    PushNotificationMutation,
    NotificationSubscription,
} from "./Notification-query"

const Messages = ({ user }) => {

    // Função para sempre ir pra ultima mensagem no chat
    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
    };

    // Função de query para retornar as mensagens
    const { subscribeToMore, refetch, data } = useQuery(
        MessageQuery,
    );

    // Função que serve para atualizar a lista de mensagens em tempo real, e envia
    // atualizações para o resultado original da query
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

    // Faz o render da lista de mensagens
    return (
    <div className="container-fluid"
        style={{
            marginTop: "25px",
            overflow: "auto",
            maxHeight: "350px",
        }}
    >
        {data.messages.map(({id, user: messageUser, message, timestamp }) => (
            <div
                style={{
                    display: "flex",
                    justifyContent: user === messageUser ? "flex-end" : "flex-start",
                    paddingBottom: "1em",
                }}
            >
                {user !== messageUser && (
                    <div className='message-user'>
                        {messageUser.slice(0, 2).toUpperCase()}
                    </div>
                )}
                <div
                    style={{
                        background: user === messageUser ? "#54cc98" : "#e5e6ea",
                        color: user === messageUser ? "white" : "black",
                        padding: "1em",
                        borderRadius: "1em",
                        maxWidth: "60%",
                    }}
                >
                    {message}<br></br>
                <div
                    style={{
                        paddingTop: "5px",
                        fontSize: "7pt",
                        display: "flex",
                        justifyContent: user === messageUser ? "flex-end" : "flex-start",
                    }}
                >
                    {timestamp}
                </div>
                </div>
            </div>    
        ))}
        <AlwaysScrollToBottom />
    </div>
    )
}

const Welcome = ({user, onSignOut})=> {

    // Mensagem de boas vindas no chat e botão de logoff
    return (
    <>
        <h1 className='welcome-message'>
            Seja bem vindo(a) 
            <strong
                style={{
                    marginLeft: '10px',
                }}
            >
                {user.username}
            </strong>!
        </h1>
            <Chat user={user.username} />
        <div
            style={{
                paddingTop: '20px',
                paddingLeft: '20px'
            }}
        >
            <Button 
                type="button"
                onClick={onSignOut}
                pill theme="success"
            >Logoff</Button>
        </div>
    </>
    )
}
  
class LoginForm extends Component {

    // Função para guardar o nome de usuario inserido
    handleSignIn(e) {
        e.preventDefault()
        if (this.refs.username.value.length > 0) {
        let username = this.refs.username.value
        this.props.onSignIn(username)
        } else {
            alert("Insira um nome de usuario valido!");
        }
    }

    // Tela de login
    render() {
        return (
        <div
            style={{ 
                display: "flex",
                justifyContent: "center",
                paddingTop: "10em"
            }}
        >
            <form>
                <h3>Bem vindo(a) ao chat!</h3>
                <div
                    style={{ 
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                <input type="text" ref="username" placeholder="Nickname" style={{
                    border: "2px solid #e5e6ea",
                    borderRadius: 5,
                    textAlign: "center",
                }}/>
                <Button outline theme="success" type="submit" value="Entrar" style={{
                    marginLeft: "5px"
                }} onClick={this.handleSignIn.bind(this)}>
                    Entrar
                </Button>
                </div>
            </form>
        </div>
        )
    }
}
  
class Login extends Component {

    constructor(props) {
        super(props)
        // Estado inicial de usuário
        this.state = {
            user: null
        }
    }

    // Funções de modificação
    signIn(username) {
        // Diz para o programa que o estado de user recebe o valor passado por parâmetro
        this.setState({
            user: {
                username,
            }
        })
    }

    signOut() {
        // Limpa o user do state que foi definido
        this.setState({user: null})
    }

    // Chama as classes passando o nome de usuário como parâmetro
    render() {
        return (
        <div>
            { 
            (this.state.user) ? 
                <Welcome 
                user={this.state.user}
                onSignOut={this.signOut.bind(this)} 
                />
            :
                <LoginForm 
                onSignIn={this.signIn.bind(this)} 
                />
            }
        </div>
        )
    }
}

const Chat = ({ user }) => {

    const [state, stateSet] = useState({
        user: user,
        message: "",
        timestamp: "",
    });

    // Mutation para criar a mensagem e enviar para o GraphQL
    const [ createMessage ] = useMutation(CreateMessageMutation);

    // Query para checagem de integridade
    const { loading, error } = useQuery(
        MessageQuery,
    );

    if (loading) return 'Carregando...';
    if (error) return `Erro: ${error.message}`;
    
    // Função para chamar a Mutation e criar a mensagem e passar as variaveis como parâmetros
    // para a state
    const onSend = () => {
        if (state.message.length > 0) {
            createMessage({
            variables: {
                user: state.user,
                message: state.message,
                timestamp: Date(Date.now()).slice(4,24),
            }
          });
        }
        stateSet({
          ...state,
          message: "",
        });
    };

    // Render da caixa de mensagem que ira receber a mensagem, e o botão que irá
    // chamar a função de criar a mutation e enviar os dados para o GraphQL
    return (
    <Container>
        <Messages user={state.user} />
        <Row style={{ paddingTop: "2em" }}>
            <Col xs={10}>
                <FormInput
                    label="Message"
                    value={state.message}
                    style={{
                        border: "2px solid #e5e6ea",
                        borderRadius: 25,
                    }}
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
                <Button outline pill theme="success" 
                    onClick={() => onSend()} style={{ 
                        width: "90%",
                    }}>
                    Enviar
                </Button>
            </Col>
        </Row>
    </Container>
    );
};

export default () => (
    <ApolloProvider client={apolloClient}>
        <Login />
    </ApolloProvider>
);