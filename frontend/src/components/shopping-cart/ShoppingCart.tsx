import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup, Stack } from "react-bootstrap";

import { useAPI } from "../../api/APIContext";
import { useAlert } from "../alert/AlertContext";
import { useAuth } from "../auth/AuthContext";
import { useShoppingCart } from "./ShoppingCartContext";

import LocalAPIRequestButton from "../../api/LocalAPIRequestButton";
import streeplijstConfig from "../../streeplijst/streeplijstConfig";
import ItemCard from "../products/ItemCard";
import ProductControlButtonGroup from "./ProductControlButtonGroup";

type CartProps = {}

// Shopping cart meant to be displayed in a side bar, will hold the currently selected items
const ShoppingCart : React.FC<CartProps> = () => {
  const cart = useShoppingCart();
  const alert = useAlert();
  const auth = useAuth();
  const api = useAPI();
  const navigate = useNavigate();

  // Store boolean to indicate whether the cart is currently empty
  const cartEmpty = cart.items.length === 0;

  // Function which is fired after the sale post is successful
  const onSaleSuccess = () => {
    cart.empty();  // Empty the cart
    navigate(streeplijstConfig.routes.onCheckout);
  };

  // Post a sale to the local API with the currently logged in member
  const onCheckoutButtonClick = () => {
    if (auth.loggedInMember) {  // Only attempt this if a user is logged in
      api.postSaleToAPI(
        {  // Post the sale by performing the mutation
          // member_id: 0,
          member_id: auth.loggedInMember.id,
          items: cart.saleItems,
        },
        onSaleSuccess,  // Call this function on a successful sale post
      );
    } else {  // A post was attempted without a logged in user, this should never happen
      console.error("Post button clicked without a logged in user");
      alert.set({
        display: {
          heading: "Post attempted without logged in user",
          message: "Please report this.",
          variant: "danger",
        },
        timeout: 5 * 60 * 1000,
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
                           loading={api.saleMutation.isLoading}  // Pass the mutation to show spinner when loading
                           className="w-100">
      <h3 className="mb-auto text-reset">
        <FontAwesomeIcon icon={["fas", "shopping-cart"]} /> €{cart.getTotal().toFixed(2)}
      </h3>
    </LocalAPIRequestButton>
  </>;
};

// Exports
export default ShoppingCart;