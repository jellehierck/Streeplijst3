import React from "react";
import { ButtonGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { ProductSummaryType } from "../../api/QueryTestComponent";
import streeplijstConfig from "../../streeplijst/streeplijstConfig";
import ItemCard from "../products/ItemCard";

type SaleSummaryCardProps = {
  productSummary : ProductSummaryType,
  children? : React.ReactNode
}

// React component
const SaleSummaryCard : React.FC<SaleSummaryCardProps> = ({productSummary}) => {
  // Choose which media to render
  const media = () => {
    if (productSummary.media) {  // If the product in the props has media on it, show that
      return productSummary.media;
    }

    // All other checks failed, show the missing media instead
    return streeplijstConfig.missingMedia;
  };

  return <ItemCard title={productSummary.name}
                   media={media()}
                   small>
    {/* Button group to resemble the buttons used in the Shopping Cart */}
    <ButtonGroup className="d-flex">
      <Button variant="secondary"
              className="p-1"
              disabled>
        {productSummary.quantity}x
      </Button>
      <Button variant="secondary"
              className="w-100 p-1 text-end"
              disabled>
        Total: €{productSummary.price.toFixed(2)}
      </Button>
    </ButtonGroup>
  </ItemCard>;
};


// Exports
export default SaleSummaryCard;
