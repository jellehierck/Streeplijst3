import React from "react";
import { Button } from "react-bootstrap";
import { useAlert } from "../components/alert/AlertContext";
import {
  saleSuccessfulAlert,
  timeoutAlert,
  unknownErrorAlert,
  usernameNotFoundAlert,
  validationErrorAlert,
} from "../components/alert/standardAlerts";

import { useAuth } from "../components/auth/AuthContext";
import TimedProgressBar from "../components/progress-bar/TimedProgressBar";

import { LocalAPIError, SaleInvoiceType, SaleItemType, SalePostType } from "./localAPI";
import { usePing, usePostSale } from "./localAPIHooks";

/**
 * Test member data. This assumes a test member with the following ID and username exists on Congressus
 */
const testMember = {
  id: 347980,
  username: "s9999999",
};

/**
 * Test product 1, this product must have these IDs, be in the testFolder and cost €0.00
 */
const testProduct1 = {
  id: 13591,
  product_offer_id: 14839,
};

/**
 * Test product 2, this product must have these IDs, be in the testFolder and cost €0.00
 */
const testProduct2 = {
  id: 21151,
  product_offer_id: 23902,
};

type QueryTestComponentProps = {}

// React component
const QueryTestComponent : React.FC<QueryTestComponentProps> = (props) => {
  // const auth = useAuth();
  // const alert = useAlert();
  //
  // // Logging in a user
  // const login = (username : string) : void => {
  //   console.log(`Attempt login for ${username}`);
  //
  //   // Try to log in the user using the AuthContext
  //   auth.login(username);
  // };
  //
  // const memberDisplay = () => {
  //   if (auth.loggedInMember) {
  //     // console.log(`Login successful, redirection to ${props.afterLogin}`);
  //     return <span>Logged in user: {auth.loggedInMember.username}</span>;
  //   }
  // };
  //
  // const pingRes = usePing();
  //
  // const pingDisplay = () => {
  //   if (pingRes.isLoading) {
  //     return <span>Loading...</span>;
  //   }
  //
  //   if (pingRes.data) {
  //     return <span>Ping: {pingRes.data.message}</span>;
  //   }
  //
  //   if (pingRes.error) {
  //     return <span>Error: {pingRes.error.message}</span>;
  //   }
  // };
  //
  // // Array of test sale items containing a single testProduct
  // const multipleTestSaleItems : SaleItemType[] = [
  //   {
  //     product_offer_id: testProduct1.product_offer_id,
  //     quantity: 2,
  //   },
  //   {
  //     product_offer_id: testProduct2.product_offer_id,
  //     quantity: 1,
  //   },
  // ];
  //
  // const onPostSuccess = (dataResponse : SaleInvoiceType, sale : SalePostType) => {
  //   // console.log("Post success!");
  //   // console.log(dataResponse);
  //   alert.set(saleSuccessfulAlert());  // Set the alert
  // };
  //
  // const onPostError = (error : LocalAPIError, sale : SalePostType) => {
  //   // console.log("Post failure!");
  //   // console.log(error.message);
  //
  //   switch (error.status) {  // Determine the error type
  //     case 400:  // Validation error
  //       alert.set(validationErrorAlert(error.toString()));  // Set the alert
  //       return;
  //     case 408:  // Request timeout
  //       alert.set(timeoutAlert(error.toString()));  // Set alert
  //   }
  //
  // };
  //
  // const saleMutation = usePostSale({onError: onPostError, onSuccess: onPostSuccess});
  //
  // // Post a sale to the local API with the currently logged in member
  // const onPostButtonClick = () => {
  //   if (auth.loggedInMember) {  // Only attempt this if a user is logged in
  //     saleMutation.mutate({  // Post the sale by performing the mutation
  //       // member_id: 0,
  //       member_id: auth.loggedInMember.id,
  //       items: multipleTestSaleItems,
  //     });
  //   } else {  // A post was attempted without a logged in user, this should never happen
  //     console.error("Post button clicked without a logged in user");
  //     alert.set({
  //       display: {
  //         heading: "Post attempted without logged in user",
  //         message: "Please report this.",
  //         variant: "danger",
  //       },
  //       timeout: 10000,
  //     });
  //   }
  // };

  // return (
  //   <>
  //     {pingDisplay()}
  //     <hr />
  //
  //     <Button variant="primary"
  //             onClick={() => login("s0000000")}>
  //       Foute login
  //     </Button>
  //     <Button variant="primary"
  //             onClick={() => login("s1779397")}>
  //       goede login
  //     </Button>
  //     <Button variant="primary"
  //             onClick={() => login("s9999999")}>
  //       goede login 2
  //     </Button>
  //
  //     <Button variant="primary"
  //             onClick={() => auth.logout()}>
  //       logout
  //     </Button>
  //     {memberDisplay()}
  //     <hr />
  //
  //     <Button variant="primary"
  //             onClick={onPostButtonClick}>
  //       post sales
  //     </Button>
  //   </>
  // );

  const [timeoutStopped, setTimeoutStopped] = React.useState<boolean>(false);

  // Function to fire upon redirect
  const onRedirect = () => {
    stopTimeout();
    console.log("Timeout fired, redirecting...");
  };

  // Function to fire when the timeout is finished
  const onTimeout = () => {
    console.log("Checkout timeout fired");
    onRedirect();
  };

  // Function which cancels the timeout
  const stopTimeout = () => {
    setTimeoutStopped(true);
  };

  const continueTimeout = () => {
    setTimeoutStopped(false);
  };

  return <>
    <Button onClick={stopTimeout}>
      Stop
    </Button>
    <Button onClick={continueTimeout}>
      Continue
    </Button>
    <Button onClick={onRedirect}>
      Redirect
    </Button>
    <TimedProgressBar timeout={10000}
                      onTimeout={onTimeout}
                      stopped={timeoutStopped}
                      variant="danger" />
  </>;


  // return <></>;
};


// Exports
export default QueryTestComponent;
;