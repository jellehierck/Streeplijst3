import React from 'react';

import {library} from "@fortawesome/fontawesome-svg-core";
import {
    fas,
    faBackspace
} from "@fortawesome/free-solid-svg-icons";

import {
    far,
    faCheckCircle
} from "@fortawesome/free-regular-svg-icons";


import Container from "react-bootstrap/Container";

import SNumberPad from "./auth/SNumberPad";


// Initialize a font-awesome library to use icons easily throughout the project
// src: https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react
library.add(
    // Solid icons
    fas,
    faBackspace,

    // Regular icons
    far,
    faCheckCircle,
)


function App() {
    return (
        <Container>
            <SNumberPad />
        </Container>
    );
}

export default App;
