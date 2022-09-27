import React from "react";
import Stack from "react-bootstrap/Stack";
import { useAPI } from "../../api/APIContext";
import LocalAPIRequestButton from "../../api/LocalAPIRequestButton";
import { SaleSummaryType } from "../../api/QueryTestComponent";
import NfcCardOverview from "../../nfc/NfcCardOverview";

import { useAuth } from "../auth/AuthContext";
import SaleSummariesDropdown from "./SaleSummariesDropdown";

type UserInformationProps = {}

// Information about the current user, such as personal details and purchase history
const UserInformation : React.FC<UserInformationProps> = (props) => {
  const auth = useAuth();
  const api = useAPI();


  React.useEffect(() => {
    if (auth.loggedInMember) {
      const salesByUsernameRes = api.getSalesByUsername(auth.loggedInMember.username);
      salesByUsernameRes.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (auth.loggedInMember) { // If the user is logged in, get the sales by username
    const salesByUsernameRes = api.getSalesByUsername(auth.loggedInMember.username);

    // Refresh button
    const refreshButton = () => {
      return <LocalAPIRequestButton variant="outline-primary"
                                    onClick={() => salesByUsernameRes.refetch()}
                                    loading={salesByUsernameRes.isFetching}
                                    stackDirection="horizontal"
                                    spinnerSize="sm">
        <p className="my-auto">
          Vorige aankopen opnieuw laden
        </p>
      </LocalAPIRequestButton>;
    };

    // Display the sales status
    const salesDisplay = () => {
      if (salesByUsernameRes.data) {  // If the response is ready
        // Extract a summary of the sale invoice data from the API
        const saleSummaries : SaleSummaryType[] = salesByUsernameRes.data.map(sale => ({
          id: sale.id,
          date: sale.created,
          total_price: sale.price_paid + sale.price_unpaid,
          products: sale.items.map(item => ({
            sale_invoice_id: item.sale_invoice_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            media: "",  // TODO: add media here?
          })),
        }));

        // Sort dates by this custom function
        saleSummaries.sort((a, b) => {
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);

          if (bDate < aDate) {  // We want to have the latest dates first in the array
            return -1;  // b is earlier than a
          } else if (bDate === aDate) {
            return 0;  // b and a are equal (also in time)
          } else {
            return 1;  // b is later than a
          }
        });

        return <SaleSummariesDropdown saleSummaries={saleSummaries} />;


      } else if (salesByUsernameRes.isLoading) {  // If the response is still loading
        return <p>Sales loading...</p>;

      } else {  // Something has gone wrong
        return <p>Could not get previously bought items</p>;
      }
    };

    // Return the component
    return <>
      <NfcCardOverview />
      <Stack direction="horizontal">
        <h1>Hallo {auth.loggedInMember.first_name}!</h1>
        <div className="mx-auto" />
        {refreshButton()}
      </Stack>
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
