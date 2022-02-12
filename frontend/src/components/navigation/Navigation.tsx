import React from "react";
import { Breadcrumb, Button, Stack } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useBreadcrumbs, { BreadcrumbComponentType, BreadcrumbsRoute } from "use-react-router-breadcrumbs";
import { folders } from "../../api/apiDummyData";
import { streeplijstRoutes } from "../../streeplijst/streeplijstRouteConfig";

// Render a breadcrumb for a folder
const FolderNameBreadcrumb : BreadcrumbComponentType = ({match} : any) => {

  // Check if the folderId exists and create a breadcrumb if that is the case
  if (match.params.folderId) {
    const folderId = match.params.folderId;  // Get the folder ID
    const folder = folders.find((folder) => folder.id === parseInt(folderId, 10));
    if (folder) {
      return <span>{folder.name}</span>;
    }
  }

  // If the folderId does not exist or no match is found, return nothing
  return <></>;
};

// TODO: replace test breadcrumbs with something less hardcoded
const routes : BreadcrumbsRoute[] = [
  {
    path: streeplijstRoutes.folderProductsPage, breadcrumb: FolderNameBreadcrumb,
  },
];


type NavigationProps = {}

// React component
const Navigation : React.FC<NavigationProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs(routes);

  // Create an array of react-bootstrap Breadcrumbs.Item elements to nicely display the current
  const createBreadcrumbs = () : JSX.Element[] => {
    return breadcrumbs.map(({match, breadcrumb}) => {
        return <Breadcrumb.Item key={match.pathname}
                                linkAs={NavLink}  // Render as a react-router-dom NavLink to get the nice routing
                                linkProps={{to: match.pathname}}  // Pass the url to the NavLink element
        >
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
              variant="outline-primary">
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