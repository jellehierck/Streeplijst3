import React from "react";
import { Button } from "react-bootstrap";
import { useAPI } from "../../api/APIContext";
import { testMember } from "../../api/localAPI.test.data";
import { useSalesByUsername } from "../../api/localAPIHooks";
import { SaleSummaryType } from "../../api/QueryTestComponent";

import { useAuth } from "../auth/AuthContext";
import SaleSummariesDropdown from "./SaleSummariesDropdown";

type UserInformationProps = {}

// Information about the current user, such as personal details and purchase history
const UserInformation : React.FC<UserInformationProps> = (props) => {
  const auth = useAuth();
  const api = useAPI();

  if (auth.loggedInMember) { // If the user is logged in,
    const salesByUsernameRes = api.getSalesByUsername(auth.loggedInMember.username);

    const salesDisplay = () => {
      if (salesByUsernameRes.data) {  // If the response is ready
        // Extract a summary of the sale invoice data from the API
        const saleSummaries : SaleSummaryType[] = salesByUsernameRes.data.map(sale => ({
          id: sale.id,
          date: sale.created,
          total_price: sale.price_paid + sale.price_paid,
          products: sale.items.map(item => ({
            sale_invoice_id: item.sale_invoice_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            media: "",  // TODO: add media here?
          })),
        }));

        saleSummaries.sort((a, b) => {
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);
          const result = bDate.getDate() - aDate.getDate();  // We want to have the highest date first, so we do b - a

          // If the result is 0, the date is equal, so we need to sort by time instead
          if (result === 0) {
            return bDate.getTime() - aDate.getTime();
          }
          return result;  // Return the result of the date comparison
        });

        return <SaleSummariesDropdown saleSummaries={saleSummaries} />;
      } else if (salesByUsernameRes.isLoading) {  // If the response is still loading
        return <p>Sales loading...</p>;
      } else {  // Something has gone wrong
        return <>
          <p>Could not get previously bought items</p>;
          <Button onClick={() => salesByUsernameRes.refetch()}>Try again</Button>
        </>;
      }
    };

    return <>
      <h1>Hallo {auth.loggedInMember.first_name}!</h1>
      {salesDisplay()}
    </>;

  } else {  // Return nothing if no user is logged in
    return <p>
      No user logged in
    </p>;
  }
};


// Exports
export default UserInformation;