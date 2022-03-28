import React from "react";
import { Col, Container, Row } from "react-bootstrap";

// Props type
type ContentContainerProps = {
  sidebarContent? : JSX.Element
}

/**
 * Container for the main content of a page, including an optional sidebar.
 * @param props.sidebarContent Optional element to display inside the sidebar container. When not given, the sidebar is
 *   not displayed
 * @constructor
 */
const ContentContainer : React.FC<ContentContainerProps> = (props) => {

  if (props.sidebarContent) {
    return <Container style={{height: "calc(100% - 60px)"}}
                      className="pb-3"
    >
      <Row>
        <Col xs={9}>
          {/* <main style={{background: "pink"}}> */}
          {/*<h1>Main</h1>*/}
          <main>
            {props.children}
          </main>
        </Col>
        <Col xs={3}>
          {/* <aside style={{background: "lightsalmon"}}> */}
          {/*<h1>Sidebar</h1>*/}
          <aside>
            {props.sidebarContent}
          </aside>
        </Col>
      </Row>
    </Container>;
  } else {
    return <Container style={{height: "calc(100% - 60px)"}}>
      {/* <main style={{background: "pink"}}> */}
      {/*<h1>Main</h1>*/}
      <main>
        {props.children}
      </main>
    </Container>;
  }
};

// Exports
export default ContentContainer;
export type { ContentContainerProps };