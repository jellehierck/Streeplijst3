import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, ButtonGroup, Stack } from "react-bootstrap";
import { LocalAPIError, SaleInvoiceType, SaleType } from "../../api/localAPI";
import { usePostSale } from "../../api/localAPIHooks";
import LocalAPIRequestButton from "../../api/LocalAPIRequestButton";
import { useAlert } from "../alert/AlertContext";
import { saleSuccessfulAlert, timeoutAlert, validationErrorAlert } from "../alert/standardAlerts";
import { useAuth } from "../auth/AuthContext";
import ItemCard from "../products/ItemCard";
import ProductControlButtonGroup from "./ProductControlButtonGroup";
import { useShoppingCart } from "./ShoppingCartContext";

type CartProps = {}

// React component
const ShoppingCart : React.FC<CartProps> = (props) => {
  const cart = useShoppingCart();
  const alert = useAlert();
  const auth = useAuth();

  // Store boolean to indicate whether the cart is currently empty
  const cartEmpty = cart.items.length === 0;

  // Function to fire on a sale post success
  const onPostSuccess = (dataResponse : SaleInvoiceType, sale : SaleType) => {
    alert.set(saleSuccessfulAlert());  // Set the alert
  };

  // Function to fire on a sale post error
  const onPostError = (error : LocalAPIError, sale : SaleType) => {
    switch (error.status) {  // Determine the error type
      case 400:  // Validation error
        alert.set(validationErrorAlert(error.toString()));  // Set the alert
        return;
      case 408:  // Request timeout
        alert.set(timeoutAlert(error.toString()));  // Set alert
    }

  };

  // Get the sale mutation, a react-query hook which sets up a post request but only posts after calling .mutate()
  const saleMutation = usePostSale({onError: onPostError, onSuccess: onPostSuccess});

  // Post a sale to the local API with the currently logged in member
  const onCheckoutButtonClick = () => {
    if (auth.loggedInMember) {  // Only attempt this if a user is logged in
      saleMutation.mutate({  // Post the sale by performing the mutation
        // member_id: 0,
        member_id: auth.loggedInMember.id,
        items: cart.saleItems,
      });
    } else {  // A post was attempted without a logged in user, this should never happen
      console.error("Post button clicked without a logged in user");
      alert.set({
        display: {
          heading: "Post attempted without logged in user",
          message: "Please report this.",
          variant: "danger",
        },
        timeout: 10000,
      });
    }
  };

  return <>
    {/* Top display */}
    <ButtonGroup className="d-flex">

      {/* Title (button used for styling) */}
      <Button variant="secondary"
              className="p-2 w-100 text-start"
              disabled>
        <h4 className="mb-auto">
          Shopping cart
        </h4>
      </Button>

      {/* Clear contents button */}
      <Button variant="danger"
              disabled={cartEmpty}
              onClick={cart.empty}>
        <FontAwesomeIcon icon={["fas", "trash"]} />
      </Button>
    </ButtonGroup>

    {/* All items in the cart */}
    <Stack direction="vertical">
      {cart.items.map(item => {
        return <ItemCard title={item.product.name}
                         key={item.product.id}>
          <ProductControlButtonGroup product={item.product} />
        </ItemCard>;
      })}
    </Stack>

    <LocalAPIRequestButton variant="info"
                           disabled={cartEmpty}
                           size="lg"
                           onClick={() => onCheckoutButtonClick()}
                           loading={saleMutation.isLoading}  // Pass the mutation to show spinner when loading
                           className="w-100">
      <h3 className="mb-auto text-reset">
        <FontAwesomeIcon icon={["fas", "shopping-cart"]} /> €{cart.getTotal().toFixed(2)}
      </h3>
    </LocalAPIRequestButton>
  </>;
};


// Exports
export default ShoppingCart;