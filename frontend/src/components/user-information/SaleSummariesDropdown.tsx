import React from "react";
import { Accordion, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { SaleSummaryType } from "../../api/QueryTestComponent";
import ItemCardGrid from "../products/ItemCardGrid";
import SaleSummaryCard from "./SaleSummaryCard";

type SaleSummariesDropdownProps = {
  saleSummaries : SaleSummaryType[]
}

// React component
const SaleSummariesDropdown : React.FC<SaleSummariesDropdownProps> = ({
  saleSummaries,
}) => {

  const saleAccordionItems = saleSummaries.map(saleSummary => {
    // Create a card per product sold to be displayed inside the accordion
    const productCards = saleSummary.products.map(productSummary => {
      return <SaleSummaryCard productSummary={productSummary}
                              key={productSummary.sale_invoice_id} />;
    });

    // Convert date to a dutch human readable format
    const saleDate = new Date(saleSummary.date);
    const saleDateString = saleDate.toLocaleDateString("nl-NL", {dateStyle: "long"});

    // Count total number of items bought
    const totalQuantity = saleSummary.products.reduce((totalQuantity, product) => {
      return totalQuantity + product.quantity;
    }, 0);
    const totalQuantityString = () => {
      if (totalQuantity === 1) {
        return `${totalQuantity} item`;
      } else {
        return `${totalQuantity} items`;
      }
    };

    // Create an accordion to have a stack of dropdown menus per sale invoice
    return <Accordion.Item eventKey={saleSummary.id.toString()}>
      <Accordion.Header>
        <ButtonToolbar className="w-50">
          <Button variant="secondary"
                  className="w-50 p-1 text-start"
                  disabled>
            {saleDateString}
          </Button>
          <Button variant="secondary"
                  className="w-25 p-1 text-start"
                  disabled>
            {totalQuantityString()}
          </Button>
          <Button variant="secondary"
                  className="w-25 p-1 text-end"
                  disabled>
            Total: €{saleSummary.total_price.toFixed(2)}
          </Button>
        </ButtonToolbar>
      </Accordion.Header>
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