import React from "react";

type HeaderProps = {}

// React component
const Header : React.FC<HeaderProps> = (props) => {
  return (
    <header className="header" role="banner">
      {/*<div style={{width: '100vw', textAlign: 'center'}}>*/}
      {/*  <img src="https://www.paradoks.utwente.nl/_media/1620430/7e58988fda09443a805702f84d4a7ac8/view" alt="Logo" style={{width: '20vh', display: 'inline'}}/>*/}
      {/*</div>*/}
      {/*<div className="header-logo">*/}
      {/*  <a title="Logo Dienst Uitvoering Onderwijs"></a>*/}
      {/*</div>*/}
    </header>
  );
}


// Exports
export default Header;