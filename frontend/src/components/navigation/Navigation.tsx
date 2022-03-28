import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useBreadcrumbs, { BreadcrumbComponentType, BreadcrumbsRoute } from "use-react-router-breadcrumbs";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button, { ButtonProps } from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import { useAPI } from "../../api/APIContext";

import { routeConfig } from "../../streeplijst/streeplijstConfig";

// Render a breadcrumb for a folder
const FolderNameBreadcrumb : BreadcrumbComponentType = ({match} : any) => {
  const api = useAPI();

  // Check if the folderId exists and create a breadcrumb if that is the case
  if (match.params.folderId) {
    if (api.folderRes?.data) {  // If there is data now
      const folderId = match.params.folderId;  // Get the folder ID

      // Look for the folder in the current folders list
      const folder = api.folderRes.data.find((folder) => folder.id === parseInt(folderId, 10));
      if (folder) {  // If a match was found, show it
        return <span>{folder.name}</span>;
      }
    }
  }

  // If the folderId does not exist or no match is found, return nothing
  return <></>;
};

// TODO: replace test breadcrumbs with something less hardcoded
const routes : BreadcrumbsRoute[] = [
  {
    path: routeConfig.folderProductsPage, breadcrumb: FolderNameBreadcrumb,
  },
];


type NavigationProps = {
  buttonProps? : ButtonProps,
}

// Navigation component, show a small navigation bar
const Navigation : React.FC<NavigationProps> = ({
  buttonProps,// Extract all button props
}) => {
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs(routes);

  // Create an array of react-bootstrap Breadcrumbs.Item elements to nicely display the current
  const createBreadcrumbs = () : JSX.Element[] => {
    return breadcrumbs.map(({match, breadcrumb}) => {
        return <Breadcrumb.Item linkAs={NavLink}  // Render as a react-router-dom NavLink to get the nice routing
                                linkProps={{to: match.pathname}}  // Pass the url to the NavLink element
                                key={match.pathname}>
          {breadcrumb}
        </Breadcrumb.Item>;
      },
    );
  };

  return (
    <Stack direction="horizontal"
           gap={3}>
      {/* Back button to go back one page in the history stack */}
      <Button onClick={() => navigate(-1)}
              variant="outline-primary"
              {...buttonProps}>
        Back
      </Button>

      {/* Breadcrumbs */}
      <Breadcrumb listProps={{className: "my-auto"}} /* Make sure breadcrumbs are aligned vertically */ >
        {createBreadcrumbs()}
      </Breadcrumb>
    </Stack>
  );
};


// Exports
export default Navigation;