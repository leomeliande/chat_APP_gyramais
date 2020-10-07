import React from "react";
import ReactDOM from "react-dom";
import { Container, Row, Col, FormInput, Button } from "shards-react";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import "./index.css";
import Chat from "./Chat";
//import Login from "./Login";

const App = () => <Chat />;

ReactDOM.render(<App />, document.getElementById("app"));