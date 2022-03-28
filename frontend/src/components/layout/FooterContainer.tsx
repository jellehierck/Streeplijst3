import React from "react";
import { Container } from "react-bootstrap";

type FooterContainerProps = {}

/**
 * Container for the fixed footer of a page
 * @constructor
 */
const FooterContainer : React.FC<FooterContainerProps> = (props) => {
  return (
    <Container className="fixed-bottom">
      {/* <footer style={{background: "limegreen"}}> */}
      {/*<h1>Footer</h1>*/}

      <footer>
        {props.children}
      </footer>
    </Container>
  );
};


// Exports
export default FooterContainer;