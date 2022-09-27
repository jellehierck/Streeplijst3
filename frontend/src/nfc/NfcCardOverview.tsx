import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Stack from "react-bootstrap/Stack";
import useWebSocket, { ReadyState } from "react-use-websocket";


/**
 * Props of NfcCardOverview TODO
 */
type NfcCardOverviewProps = {
  children? : React.ReactNode
}

/**
 * NfcCardOverview TODO
 */
const NfcCardOverview : React.FC<NfcCardOverviewProps> = ({
  children,
}) => {
  //
  // // Function to call on the add button press
  // const onAdd = () => {
  //   // Add the item using the cart context
  //   // TODO: Add a way to add more items at the same time if needed since we hardcoded one item for now
  //   cart.add(props.product, 1);
  // };
  //
  // // Function to call on the add button press
  // const onRemove = () => {
  //   // Add the item using the cart context
  //   // TODO: Add a way to remove more items at the same time if needed
  //   cart.remove(props.product);
  // };
  //
  //
  // const displayAddButton = () => {
  //   return <Button variant="outline-success"
  //                  className="py-1 px-3"
  //                  onClick={onAdd}>
  //     <FontAwesomeIcon icon={["fas", "plus"]} />
  //   </Button>;
  // };
  //
  // // Display remove button only if there are items to remove
  // const displayRemoveButton = () => {
  //   let visible = "visible";
  //   if (currQuantity <= 0) {
  //     visible = "invisible";
  //   }
  //   return <Button variant="outline-danger"
  //                  className={"py-1 px-3 " + visible}
  //                  onClick={onRemove}>
  //     <FontAwesomeIcon icon={["fas", "minus"]} />
  //   </Button>;
  // };

  // Current welcome message state
  const [message, setMessage] = useState("");

  // Get the websocket
  const {readyState, sendJsonMessage} = useWebSocket("ws://localhost:8000/ws/nfc/",
    {
      onOpen: () => {
        sendJsonMessage({
          action: "subscribe_to_last_connected_card_activity",
          request_id: new Date().getTime(),
        });
      },

      onClose: () => {
      },

      onMessage: (e) => {
        setMessage(e.data);
      },
    });

  // Select a string representing the current connection state
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];


  // Send delete through the websocket
  const sendDelete = () => {
    sendJsonMessage({
      action: "delete",
      username: "s1779397",
      request_id: new Date().getTime(),
    });
  };

  // Send create through the websocket
  const sendCreate = () => {
    sendJsonMessage({
      action: "create",
      data: {
        username: "s1779397",
        card_uid: "04 32 4E 5A 85 74 80",
      },
      request_id: new Date().getTime(),
    });
  };

  // Send patch through the websocket
  const sendPatch = () => {
    sendJsonMessage({
      action: "patch",
      username: "s1779397",
      data: {
        card_uid: "00 00 00 00 00 00 00",
      },
      request_id: new Date().getTime(),
    });
  };

  // Send retrieve through the websocket
  const sendRetrieve = () => {
    sendJsonMessage({
      action: "retrieve",
      username: "s1779397",
      request_id: 1,
    });
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        The WebSocket is currently {connectionStatus}
      </h1>
      <p>{message}</p>


      <button className="bg-gray-300 px-3 py-1"
              onClick={sendRetrieve}>
        Retrieve
      </button>


      <Stack direction="vertical"
             className="w-50">
        <ButtonGroup className="d-flex">
          <Button variant="secondary"
                  className="w-100 p-0 text-start"
                  disabled>
            No NFC tag added
          </Button>

          <Button variant="outline-success"
                  onClick={sendCreate}>
            <FontAwesomeIcon icon={["fas", "plus"]} />
          </Button>

        </ButtonGroup>

        <ButtonGroup className="d-flex">
          <Button variant="secondary"
                  className="w-100 p-0 text-start"
                  disabled>
            NFC tag (04-09-2022)
          </Button>

          <Button variant="outline-info"
                  onClick={sendPatch}>
            <FontAwesomeIcon icon={["fas", "pen-square"]} />
          </Button>

          <Button variant="outline-danger"
                  onClick={sendDelete}>
            <FontAwesomeIcon icon={["fas", "trash"]} />
          </Button>
        </ButtonGroup>
      </Stack>
    </>
  );
};


// Exports
export default NfcCardOverview;
