import React from "react";

import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";

// React component
function PostSaleForm() {
    return (
        <Form>
            <Form.Group className="mb-3" controlId="formSNumber">
                <Form.Label>Student Number</Form.Label>
                <Form.Control type="text" placeholder="Student Number" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formOfferId">
                <Form.Label>Offer ID</Form.Label>
                <Form.Control type="number" placeholder="Offer ID" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formQuantity">
               <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" placeholder="Quantity" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}


// Exports
export default PostSaleForm;