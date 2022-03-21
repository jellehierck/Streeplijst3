import React, { createContext, useContext, useReducer } from "react";
import { ProductType, SaleItemType } from "../../api/localAPI";

// Action names
export const enum ShoppingCartAction {
  ADD = "ADD",
  REMOVE = "REMOVE",
  EMPTY = "EMPTY"
}

// Actions to take on state
export type ShoppingCartActionType = { type : ShoppingCartAction.ADD, product : ProductType, quantity : number }
  | { type : ShoppingCartAction.REMOVE, product : ProductType }
  | { type : ShoppingCartAction.EMPTY }

// Items in a shopping cart
export type  ShoppingCartItemType = {
  product : ProductType
  quantity : number,
};

/**
 * Converts an array of shopping cart items to sale items
 * @param {ShoppingCartItemType[]} shoppingCartItems
 * @returns {SaleItemType[]}
 */
export const shoppingCartItemsToSaleItems = (shoppingCartItems : ShoppingCartItemType[]) : SaleItemType[] => {
  return shoppingCartItems.map(shoppingCartItem => {
    return {
      product_offer_id: shoppingCartItem.product.product_offer_id,
      quantity: shoppingCartItem.quantity,
    };
  });
};

// State type
export type ShoppingCartStateType = ShoppingCartItemType[]

// Initial ShoppingCart state
const initialShoppingCartState : ShoppingCartItemType[] = [];

/**
 * Shopping cart reducer function, basically takes the current cart state and performs an action on it
 * @param currItems
 * @param action
 */
export const ShoppingCartReducer = (currItems : ShoppingCartStateType, action : ShoppingCartActionType) : ShoppingCartStateType => {
  // Take the action
  switch (action.type) {
    // When an item is added
    case ShoppingCartAction.ADD: {
      // See if the target item already exists in the current item list
      const existingItem = currItems.find(item => item.product.id === action.product.id);

      // If the item is already in the list, increase its quantity
      if (existingItem) {
        // Return a new state which is constructed from mapping a new array of states
        return currItems.map(currItem => {
          // If the current item is the existing item, increment the quantity
          if (currItem.product.id === existingItem.product.id) {
            return {
              ...currItem,
              quantity: currItem.quantity + action.quantity,  // Increase the quantity
            };
          } else {
            return currItem;  // If the item is not found, return the current item
          }
        });
      } else {  // No existing item was found, return the current list with a new item added
        return [
          ...currItems,
          {
            product: action.product,
            quantity: action.quantity,
          },
        ];
      }
    }
    // When an item is removed
    case ShoppingCartAction.REMOVE: {
      // See if the target item already exists in the current item list
      const existingItem = currItems.find(item => item.product.id === action.product.id);
      // If the target item does not exist in the list yet, return the list as is
      if (!existingItem) {
        // Return the current list
        return [
          ...currItems,
        ];
      }

      // Take action based on the current quantity
      if (existingItem.quantity === 1) {  // Quantity is 1, filter to leave a list without the current item in it
        return currItems.filter(currItem => currItem.product.id !== existingItem.product.id);
      } else {  // Current quantity is more than 1
        // Return a new state which is constructed from mapping a new array of states
        return currItems.map(currItem => {
          // If the current item is the existing item, decrement the quantity
          if (currItem.product.id === existingItem.product.id) {
            return {
              ...currItem,
              quantity: currItem.quantity - 1,  // Decrement the quantity
            };
          } else {
            return currItem;  // If the item is not found, return the current item
          }
        });
      }
    }

    // When the shopping cart is emptied
    case ShoppingCartAction.EMPTY: {
      return initialShoppingCartState;
    }
  }
};

// Context type to pass along
export type ShoppingCartContextType = {
  // Current cart contents
  items : ShoppingCartStateType

  // The current cart contents as SaleItems
  saleItems : SaleItemType[]

  /**
   * Add items to the cart.
   * @param {ProductType} product Product to add
   * @param {number} quantity Quantity, defaults to 1
   */
  add : (product : ProductType, quantity : number) => void

  /**
   * Remove item from the cart
   * @param {ProductType} product
   */
  remove : (product : ProductType) => void

  /**
   * Empty the shopping cart
   */
  empty : () => void

  /**
   * Return the quantity of an item in the shopping cart. If the item is not in the shopping cart, returns 0
   * @param {ProductType} product Product to get the quantity for.
   * @returns {number}
   */
  getQuantity : (product : ProductType) => number

  /**
   * Get the total amount in the cart at this point.
   * @returns {number} Total amount in this cart
   */
  getTotal : () => number,

}

// Actual context, store of the current state
const ShoppingCartContext = createContext<ShoppingCartContextType>({} as ShoppingCartContextType);
export default ShoppingCartContext;

// Custom hook to use the ShoppingCartContext
export const useShoppingCart = () : ShoppingCartContextType => {
  return useContext(ShoppingCartContext);
};

// React component
export const ShoppingCartContextProvider : React.FC = (props) => {
  const [items, cartItemsDispatch] = useReducer<React.Reducer<ShoppingCartStateType, ShoppingCartActionType>>(ShoppingCartReducer, initialShoppingCartState);

  const add = (product : ProductType, quantity : number = 1) : void => {
    cartItemsDispatch({type: ShoppingCartAction.ADD, product: product, quantity: quantity});
  };

  const remove = (product : ProductType) : void => {
    cartItemsDispatch({type: ShoppingCartAction.REMOVE, product: product});
  };

  const empty = () : void => {
    cartItemsDispatch({type: ShoppingCartAction.EMPTY});
  };

  const getQuantity = (product : ProductType) : number => {
    const existingItem = items.find(item => item.product.id === product.id);  // Find the item if it exists

    if (existingItem) {  // If the item exists, return the quantity of that item
      return existingItem.quantity;
    } else { // If the item does not exist, return 0 quantity
      return 0;
    }
  };

  const getTotal = () : number => {
    let total = 0;
    items.forEach(item => {
      total += item.product.price * item.quantity;
    });
    return total;
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        items: items,
        saleItems: shoppingCartItemsToSaleItems(items),
        add: add,
        remove: remove,
        empty: empty,
        getQuantity: getQuantity,
        getTotal: getTotal,
      }}>
      {props.children}
    </ShoppingCartContext.Provider>
  );
};
