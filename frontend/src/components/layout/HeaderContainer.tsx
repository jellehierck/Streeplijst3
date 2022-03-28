import React from "react";
import { Container } from "react-bootstrap";

type HeaderContainerProps = {}

/**
 * Container for the header of the page
 * @constructor
 */
const HeaderContainer : React.FC<HeaderContainerProps> = (props) => {
  return (
    <Container className="py-3">
      {/* <header style={{background: "aqua"}}> */}
      {/*<h1>Header</h1>*/}
      <header>
        {props.children}
      </header>
    </Container>
  );
};


// Exports
export default HeaderContainer;