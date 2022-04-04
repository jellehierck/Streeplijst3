import React from "react";
import { Button } from "react-bootstrap";
import { Router as BrowserRouter, Routes } from "react-router-dom";
import TimedAlert from "../components/alert/TimedAlert";
import { useAuth } from "../components/auth/AuthContext";
import Checkout from "../components/content/Checkout";
import ContentContainer from "../components/layout/ContentContainer";
import HeaderContainer from "../components/layout/HeaderContainer";
import Layout from "../components/layout/Layout";
import SaleSummariesDropdown from "../components/user-information/SaleSummariesDropdown";
import UserInformation from "../components/user-information/UserInformation";
import StreeplijstHeader from "../streeplijst/StreeplijstHeader";
import { useAPI } from "./APIContext";

import { useSalesByUsername } from "./localAPIHooks";

import { testMember, testProduct1, testProduct2 } from "./localAPI.test.data";

export type ProductSummaryType = {
  sale_invoice_id : number
  name : string
  price : number
  quantity : number
  media? : string
}

export type SaleSummaryType = {
  products : ProductSummaryType[]
  date : string
  total_price : number
  id : number
}

type QueryTestComponentProps = {}

// React component
const QueryTestComponent : React.FC<QueryTestComponentProps> = (props) => {
  // const auth = useAuth();
  // const saleInvoices = useSalesByUsername(testMember.username);
  //
  // if (saleInvoices.data) {
  //
  //   // Extract a summary of the sale invoice data from the API
  //   const saleSummaries : SaleSummaryType[] = saleInvoices.data.map(sale => ({
  //     id: sale.id,
  //     date: sale.created,
  //     total_price: sale.price_paid + sale.price_paid,
  //     products: sale.items.map(item => ({
  //       sale_invoice_id: item.sale_invoice_id,
  //       name: item.name,
  //       price: item.price,
  //       quantity: item.quantity,
  //       media: "",  // TODO: add media here?
  //     })),
  //   }));
  //
  //   saleSummaries.sort((a, b) => {
  //     const aDate = new Date(a.date);
  //     const bDate = new Date(b.date);
  //     const result = bDate.getDate() - aDate.getDate();  // We want to have the highest date first, so we do b - a
  //
  //     // If the result is 0, the date is equal, so we need to sort by time instead
  //     if (result === 0) {
  //       return bDate.getTime() - aDate.getTime();
  //     }
  //     return result;  // Return the result of the date comparison
  //   });
  //
  //   return <Layout headerContent={<HeaderContainer />}
  //                  footerContent={<TimedAlert />}>
  //     <ContentContainer sidebarContent={<UserInformation />}>
  //       <Button onClick={() => auth.login("s1779397")}>Log in</Button>
  //       <SaleSummariesDropdown saleSummaries={saleSummaries} />
  //     </ContentContainer>
  //   </Layout>;
  //
  // }
  //
  // return <></>;

  // const auth = useAuth();
  // const api = useAPI();
  //
  // if (auth.loggedInMember) { // If the user is logged in,
  //   const salesByUsernameRes = api.getSalesByUsername(auth.loggedInMember.username);
  //
  //   const salesDisplay = () => {
  //     if (salesByUsernameRes.data) {  // If the response is ready
  //       // Extract a summary of the sale invoice data from the API
  //       const saleSummaries : SaleSummaryType[] = salesByUsernameRes.data.map(sale => ({
  //         id: sale.id,
  //         date: sale.created,
  //         total_price: sale.price_paid + sale.price_paid,
  //         products: sale.items.map(item => ({
  //           sale_invoice_id: item.sale_invoice_id,
  //           name: item.name,
  //           price: item.price,
  //           quantity: item.quantity,
  //           media: "",  // TODO: add media here?
  //         })),
  //       }));
  //
  //       saleSummaries.sort((a, b) => {
  //         const aDate = new Date(a.date);
  //         const bDate = new Date(b.date);
  //         const result = bDate.getDate() - aDate.getDate();  // We want to have the latest date first, so we do b - a
  //
  //         // If the result is 0, the date is equal, so we need to sort by time instead
  //         if (result === 0) {
  //           return bDate.getTime() - aDate.getTime();
  //         }
  //         return result;  // Return the result of the date comparison
  //       });
  //
  //       return <SaleSummariesDropdown saleSummaries={saleSummaries} />;
  //     } else if (salesByUsernameRes.isLoading) {  // If the response is still loading
  //       return <p>Sales loading...</p>;
  //     } else {  // Something has gone wrong
  //       return <>
  //         <p>Could not get previously bought items</p>;
  //         <Button onClick={() => salesByUsernameRes.refetch()}>Try again</Button>
  //       </>;
  //     }
  //   };
  //
  //   return <>
  //     <Button onClick={() => auth.logout()}>Log uit</Button>
  //     <h1>Hallo {auth.loggedInMember.first_name}!</h1>
  //     {salesDisplay()}
  //   </>;
  //
  // } else {  // Return nothing if no user is logged in
  //   return <>
  //     <Button onClick={() => auth.login("s1779397")}>Log in</Button>
  //     <p> No user logged in </p>
  //   </>;
  // }

  const auth = useAuth();
  return <ContentContainer sidebarContent={<Checkout />}>
    <>
      <Button onClick={() => auth.login("s1779397")}>Log in</Button>
      <Button onClick={() => auth.logout()}>Log uit</Button>
      <UserInformation />
    </>
  </ContentContainer>;
};


// Exports
export default QueryTestComponent;
