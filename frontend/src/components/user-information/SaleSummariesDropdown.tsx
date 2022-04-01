import React from "react";
import { Accordion } from "react-bootstrap";
import { SaleSummaryType } from "../../api/QueryTestComponent";
import ItemCardGrid from "../products/ItemCardGrid";
import SaleSummaryCard from "./SaleSummaryCard";

type SaleSummariesDropdownProps = {
  saleSummaries : SaleSummaryType[]
}

// React component
const SaleSummariesDropdown : React.FC<SaleSummariesDropdownProps> = (props) => {

  const saleAccordionItems = props.saleSummaries.map(saleSummary => {
    // Create a card per product sold to be displayed inside the accordion
    const productCards = saleSummary.products.map(productSummary => {
      return <SaleSummaryCard productSummary={productSummary}
                              key={productSummary.sale_invoice_id} />;
    });

    // Create an accordion to have a stack of dropdown menus per sale invoice
    return <Accordion.Item eventKey={saleSummary.id.toString()}>
      <Accordion.Header>{saleSummary.date} - €{saleSummary.total_price}</Accordion.Header>
      <Accordion.Body>
        <ItemCardGrid cards={productCards} xl={5} lg={4} md={3} sm={2} />
      </Accordion.Body>
    </Accordion.Item>;
  });


  return (
    <Accordion alwaysOpen>
      {saleAccordionItems}
    </Accordion>
  );
};


// Exports
export default SaleSummariesDropdown;