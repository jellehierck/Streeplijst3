import React, { createContext, Dispatch, useContext, useReducer } from "react";
import { ProductType } from "../../api/API";

// Action names
const enum ShoppingCartAction {
  ADD = "ADD",
  REMOVE = "REMOVE",
  EMPTY = "EMPTY"
}

// Actions to take on state
type ShoppingCartActionType = {
  type : ShoppingCartAction,
  payload : ShoppingCartItem
}

// Items in a shopping cart
type ShoppingCartItem = {
  product : ProductType
  quantity : number
}

// State type
type ShoppingCartStateType = ShoppingCartItem[]


// Initial ShoppingCart state
const initialShoppingCartState : ShoppingCartItem[] = [];

/**
 *
 * @param currItems
 * @param action
 */
const ShoppingCartReducer = (currItems : ShoppingCartStateType, action : ShoppingCartActionType) : ShoppingCartStateType => {
  // See if the target item already exists in the current item list
  const existingItem = currItems.find(item => item.product.id === action.payload.product.id);

  // Take the action
  switch (action.type) {
    // When an item is added
    case ShoppingCartAction.ADD:
      // If the item is already in the list, increase its quantity
      if (existingItem) {
        // Return a new state which is constructed from mapping a new array of states
        return currItems.map(currItem => {
          // If the current item is the existing item, increment the quantity
          if (currItem.product.id === existingItem.product.id) {
            return {
              ...currItem,
              quantity: currItem.quantity + action.payload.quantity,  // Increase the quantity
            };
          } else {
            return currItem;  // If the item is not found, return the current item
          }
        });
      } else {  // No existing item was found, return the current list with a new item added
        return [
          ...currItems,
          action.payload,
        ];
      }

    // When an item is removed
    case ShoppingCartAction.REMOVE:
      // If the target item does not exist in the list yet, do nothing
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

    // When the shopping cart is emptied
    case ShoppingCartAction.EMPTY:
      return initialShoppingCartState;
  }
};

// Context type to pass along
type ShoppingCartContextType = {
  currItems : ShoppingCartStateType
  itemsDispatch : Dispatch<ShoppingCartActionType>
}

// Actual context, store of the current state
const ShoppingCartContext = createContext<ShoppingCartContextType>({} as ShoppingCartContextType);

// Custom hook to use the ShoppingCartContext
const useShoppingCart = () : ShoppingCartContextType => {
  return useContext(ShoppingCartContext);
};

// React component
const ShoppingCartContextProvider : React.FC = (props) => {
  const [ShoppingCart, ShoppingCartDispatch] = useReducer<React.Reducer<ShoppingCartStateType, ShoppingCartActionType>>(ShoppingCartReducer, initialShoppingCartState);

  return (
    <ShoppingCartContext.Provider value={{currItems: ShoppingCart, itemsDispatch: ShoppingCartDispatch}}>
      {props.children}
    </ShoppingCartContext.Provider>
  );
};

// Exports
export default ShoppingCartContext;
export { ShoppingCartContextProvider, initialShoppingCartState, useShoppingCart };
export type { ShoppingCartStateType, ShoppingCartContextType, ShoppingCartActionType };