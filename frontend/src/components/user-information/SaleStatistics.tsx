import React from "react";
import { ButtonGroup, ButtonToolbar, DropdownButton, Dropdown } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { SaleSummaryType } from "../../api/QueryTestComponent";
import ItemCard from "../products/ItemCard";
import ItemCardGrid from "../products/ItemCardGrid";

type SaleStatisticsProps = {
  saleSummaries : SaleSummaryType[]
}

type StatisticsType = {
  name : string,
  media? : string,
  totalPrice : number,
  totalQuantity : number,
  lastBought : Date
}

enum SortByType {
  Price,
  Quantity,
  Recent,
}

// React component
const SaleStatistics : React.FC<SaleStatisticsProps> = (
  {saleSummaries},
) => {

  console.log(saleSummaries);

  // Sort by descending (high to low)
  const [descending, setDescending] = React.useState(true);

  /**
   * Toggle between descending and ascending
   */
  const toggleDescending = () => {
    setDescending(!descending);
  };

  // Sort method, null is default sort
  const [sortMethod, setSortMethod] = React.useState<SortByType | null>(null);

  /**
   * Sort statistics by total price
   */
  const sortByPrice = (a : StatisticsType, b : StatisticsType) => {
    if (descending) {
      return b.totalPrice - a.totalPrice;
    } else {
      return a.totalPrice - b.totalPrice;
    }
  };

  /**
   * Sort by total quantity
   */
  const sortByQuantity = (a : StatisticsType, b : StatisticsType) => {
    if (descending) {
      return b.totalQuantity - a.totalQuantity;
    } else {
      return a.totalQuantity - b.totalQuantity;
    }
  };

  /**
   * Sort by recently bought
   */
  const sortByRecent = (a : StatisticsType, b : StatisticsType) => {
    if (descending) {
      return b.lastBought.getTime() - a.lastBought.getTime();
    } else {
      return a.lastBought.getTime() - b.lastBought.getTime();
    }
  };

  /**
   * Do not sort
   */
  const sortByNone = (a : StatisticsType, b : StatisticsType) => 0;

  const statisticsCards = () => {
    let statisticsMap = new Map<string, StatisticsType>();  // Holds statistics for each unique product bought

    saleSummaries.forEach(summary => { // Loop all sales
      const currSummaryDate = new Date(summary.date);  // Store the date so we can sort by last bought products

      summary.products.forEach(product => {  // Loop all products in this sale
        const currProductStatistics = statisticsMap.get(product.name);  // See if this sale already exists in our map

        if (currProductStatistics) {  // If the product already existed, add to its price and quantity
          statisticsMap.set(product.name, {
              ...currProductStatistics,  // Keep the media and name of the current statistic
              totalPrice: currProductStatistics.totalPrice + product.price * product.quantity,  // Add to total price
              totalQuantity: currProductStatistics.totalQuantity + product.quantity,  // add to total quantity
              lastBought: currSummaryDate > currProductStatistics.lastBought ? currSummaryDate : currProductStatistics.lastBought,
            },
          );

        } else {  // product did not exist yet, create a new entry
          statisticsMap.set(product.name, {
              name: product.name,
              media: product.media,
              totalPrice: product.price * product.quantity,
              totalQuantity: product.quantity,
              lastBought: new Date(summary.date),
            },
          );
        }
      });
    });

    const statisticsArray = Array.from(statisticsMap.values());  // Convert to array so we can use .sort() and .map()

    // Sort the array based on the selected sort method
    switch (sortMethod) {
      case SortByType.Price:
        statisticsArray.sort(sortByPrice);
        break;
      case SortByType.Quantity:
        statisticsArray.sort(sortByQuantity);
        break;
      case SortByType.Recent:
        statisticsArray.sort(sortByRecent);
        break;
      default:
        statisticsArray.sort(sortByNone);
    }
    return statisticsArray.map(statistic => {
      return <ItemCard title={statistic.name + " x" + statistic.totalQuantity}
                       media={statistic.media}
                       small
      >
        <p>Tot. €{statistic.totalPrice}</p>
      </ItemCard>;
    });
  };

  const statisticsHeader = () => {
    return <ButtonGroup>
      <Button variant="secondary bg-transparent"
              className="w-50 p-1 text-start"
              disabled>
        {/* {saleDateString} */}
      </Button>
      <Button variant="secondary bg-transparent"
              className="w-25 p-1 text-start"
              disabled>
        {/* {totalQuantityString()} */}
      </Button>
      <Button variant="secondary bg-transparent"
              className="w-25 p-1 text-end"
              disabled>
        {/* €{saleSummary.total_price.toFixed(2)} */}
      </Button>
      <DropdownButton as={ButtonGroup}
                      title={"Sort by"}
                      variant="secondary"
      >
        <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
        <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
      </DropdownButton>
    </ButtonGroup>;
  };

  return (
    <div>
      {statisticsHeader()}
      <ItemCardGrid cards={statisticsCards()} />
    </div>
  );
};


// Exports
export default SaleStatistics;