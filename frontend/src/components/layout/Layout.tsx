import React from "react";
import ContentContainer from "./ContentContainer";

import FooterContainer from "./FooterContainer";
import HeaderContainer from "./HeaderContainer";

// Props for the layout
type LayoutProps = {
  headerContent? : JSX.Element
  footerContent? : JSX.Element
}

/**
 * Main layout for any page
 * @param props.headerContent Optional header content, if left empty no header is displayed
 * @param props.footerContent Optional footer content, if left empty no footer is displayed
 * @constructor
 */
const Layout : React.FC<LayoutProps> = (props) => {
  // Header content of the page
  const headerContent = () => {
    if (props.headerContent) {
      return <HeaderContainer>{props.headerContent}</HeaderContainer>
    }
  }

  // Main content of the page is whatever is wrapped by the Layout
  const mainContent = props.children

  // Footer content of the page
  const footerContent = () => {
    if (props.footerContent) {
      return <FooterContainer>{props.footerContent}</FooterContainer>
    }
  }

  return (
    <>
      {headerContent()}
      {mainContent}
      {footerContent()}
    </>
  );
}


// Exports
export default Layout;
export { ContentContainer };