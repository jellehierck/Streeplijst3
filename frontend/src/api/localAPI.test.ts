import { getFolders, getMemberById, getMemberByUsername, getProducts, ping, postSale, SaleItemType } from "./localAPI";

/**
 * Test member data. This assumes a test member with the following ID and username exists on Congressus
 */
const testMember = {
  id: 347980,
  username: "s9999999",
};

/**
 * Test folder data, this folder must contain the testProduct
 */
const testFolder = {
  id: 1998,
};

/**
 * Test product, this product must have these IDs, be in the testFolder and cost €0.00
 */
const testProduct = {
  id: 13591,
  product_offer_id: 14839,
};


test("if a ping is received", () => {
  return ping()
    .then(data => {  // Wait for the Promise to resolve
      expect(data).toEqual({message: "Ping to local API v30 successful"});
    });
});

test("if a ping is failed (when the server is not running)", () => {
  return ping()
    .then(data => {
      expect(data).toEqual({
        message: "Network Error",
        status: 500,
        statusText: "Unable to reach the local API server. Is it running?",
      });
    });
});


test(`if member with username ${testMember.username} can be retrieved`, () => {
  return getMemberByUsername(testMember.username)
    .then(data => {  // Wait for the Promise to resolve
      // Test if all required properties are present in the response
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("username", testMember.username);
      expect(data).toHaveProperty("first_name");
      expect(data).toHaveProperty("last_name");
      expect(data).toHaveProperty("prefix");
      expect(data).toHaveProperty("suffix");
      expect(data).toHaveProperty("date_of_birth");
      expect(data).toHaveProperty("show_almanac");
      expect(data).toHaveProperty("status");
      // expect(data).toHaveProperty("profile_picture");  // Removed from Congressus so not used anymore
      expect(data).toHaveProperty("bank_account");
    });
});

const nonexistentMemberUsername = "s0000000";
test(`if nonexistent member with username ${nonexistentMemberUsername} returns an error`, () => {
  return getMemberByUsername(nonexistentMemberUsername)
    .then(data => {  // Wait for the Promise to resolve
      expect(data).toEqual({  // Match against part of an object
        message: "Request failed with status code 404",
        status: 404,
        statusText: "Not Found",
      });
    });
});

test(`if member with id ${testMember.id} can be retrieved`, () => {
  return getMemberById(testMember.id)
    .then(data => {  // Wait for the Promise to resolve
      // Test if all required properties are present in the response
      expect(data).toHaveProperty("id", testMember.id);
      expect(data).toHaveProperty("username", testMember.username);
      expect(data).toHaveProperty("first_name");
      expect(data).toHaveProperty("last_name");
      expect(data).toHaveProperty("prefix");
      expect(data).toHaveProperty("suffix");
      expect(data).toHaveProperty("date_of_birth");
      expect(data).toHaveProperty("show_almanac");
      expect(data).toHaveProperty("status");
      // expect(data).toHaveProperty("profile_picture");  // Removed from Congressus so not used anymore
      expect(data).toHaveProperty("bank_account");
    });
});

test("if all folders can be retrieved", () => {
  return getFolders()
    .then(data => {
      expect(data).toEqual(  // Expect the returned array to equal...
        expect.arrayContaining([  // an array that contains...
          expect.objectContaining({  // an object that contains the following properties
            id: expect.any(Number),
            name: expect.any(String),
            parent_id: expect.any(Number),
            published: expect.any(Boolean),
            path: expect.any(String),
            // media: expect.any(String),  // TODO: Accept null and/or undefined?
            // TODO: Add children and products fields too?
          }),
        ]),
      );
    });
});

test("if the test folder is present in all folders", () => {
  return getFolders()
    .then(data => {
      expect(data).toEqual(  // Expect the returned array to equal...
        expect.arrayContaining([  // an array that contains...
          expect.objectContaining({  // an object that contains the following properties
            id: testFolder.id,  // At least the test folder must be present in the response
          }),
        ]),
      );
    });
});

test(`if products from the test folder with id ${testFolder.id} can be retrieved`, () => {
  return getProducts(testFolder.id)
    .then(data => {
      expect(data).toEqual(
        expect.arrayContaining([  // an array that contains...
          expect.objectContaining({  // an object that contains the following properties
            id: expect.any(Number),
            price: expect.any(Number),
            product_offer_id: expect.any(Number),
            name: expect.any(String),
            published: expect.any(Boolean),
            // description: expect.any(String),  // TODO: Accept null and/or undefined?
            // media: expect.any(String),  // TODO: Or accept null | undefined?
          }),
        ]),
      );
    });
});

test(`if products from the test folder with id ${testFolder.id} contain the test product and the test product costs €0`, () => {
  return getProducts(testFolder.id)
    .then(data => {
      expect(data).toEqual(
        expect.arrayContaining([  // an array that contains...
          expect.objectContaining({  // an object that contains the following properties
            id: testProduct.id,  // At least the test product must be present in the response
            product_offer_id: testProduct.product_offer_id,
            price: 0,  // Expect price to be 0
          }),
        ]),
      );
    });
});

// Array of test sale items containing a single testProduct
const testSaleItems : SaleItemType[] = [
  {
    product_offer_id: testProduct.product_offer_id,
    quantity: 1,
  },
];
test(`if posting a sale of one testProduct for the testUser is successful`, () => {
  return postSale(testMember.id, testSaleItems)
    .then(data => {  // Wait for the Promise to resolve
      // Test if all required properties are present in the response
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("created");
      expect(data).toHaveProperty("invoice_source", "api");  // Make sure the source is set correctly
      expect(data).toHaveProperty("invoice_type", "webshop");  // Make sure the type is set correctly
      expect(data).toHaveProperty("member_id", testMember.id);  // Make sure the member ID is correct
      expect(data).toHaveProperty("price_paid", 0);  // Make sure the paid price is actually 0
      expect(data).toHaveProperty("price_unpaid", 0);  // Make sure the unpaid price is actually 0

      // Test if the array of bought items has the right format
      expect(data).toHaveProperty("items", expect.arrayContaining([  // an array that contains...
        expect.objectContaining({  // an object that contains the following properties
          name: expect.any(String),
          price: 0,
          product_offer_id: testProduct.product_offer_id,
          quantity: 1,
          sale_invoice_id: expect.any(Number),
        }),
      ]));
    });
});

export {};