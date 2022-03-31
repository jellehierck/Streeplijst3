import {
  getFolders,
  getMemberById,
  getMemberByUsername,
  getProducts,
  getSalesByUsername,
  ping,
  postSale,
  SaleItemType,
} from "./localAPI";

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
 * Test product 1, this product must have these IDs, be in the testFolder and cost €0.00
 */
const testProduct1 = {
  id: 13591,
  product_offer_id: 14839,
};

/**
 * Test product 2, this product must have these IDs, be in the testFolder and cost €0.00
 */
const testProduct2 = {
  id: 21151,
  product_offer_id: 23902,
};

// Set the timeout to be a little longer than the standard 5000ms
const testTimeoutMs = 15000;
jest.setTimeout(testTimeoutMs);

test("if a ping is received", () => {
  return ping()
    .then(data => {  // Wait for the Promise to resolve
      expect(data).toEqual({message: "Ping to local API v30 successful"});
    });
});

test("if a ping is failed (when the server is not running)", () => {
  return expect(getMemberByUsername(nonexistentMemberUsername)).rejects.toMatchObject({status: 500});
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
test(`if nonexistent member with username ${nonexistentMemberUsername} throws an error`, () => {
  return expect(getMemberByUsername(nonexistentMemberUsername)).rejects.toMatchObject({status: 404});
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

test(`if products from the test folder with id ${testFolder.id} contain the test products and the test products costs €0`, () => {
  return getProducts(testFolder.id)
    .then(data => {
      expect(data).toEqual(
        expect.arrayContaining([  // an array that contains...
          expect.objectContaining({  // an object that contains the following properties
            id: testProduct1.id,  // At least test product 1 must be present in the response
            product_offer_id: testProduct1.product_offer_id,
            price: 0,  // Expect price to be 0
            published: true, // Expect it to be published
          }),
          expect.objectContaining({  // an object that contains the following properties
            id: testProduct2.id,  // At least test product 2 must be present in the response
            product_offer_id: testProduct2.product_offer_id,
            price: 0,  // Expect price to be 0
            published: false, // Expect it NOT to be published
          }),
        ]),
      );
    });
});

// Array of test sale items containing a single testProduct
const singleTestSaleItem : SaleItemType[] = [
  {
    product_offer_id: testProduct1.product_offer_id,
    quantity: 1,
  },
];
test(`if posting a sale of a single test product 1 for the testUser is successful`, () => {
  return postSale({member_id: testMember.id, items: singleTestSaleItem})
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
          product_offer_id: testProduct1.product_offer_id,
          quantity: 1,
          sale_invoice_id: expect.any(Number),
        }),
      ]));
    });
});

// Array of test sale items containing a single testProduct
const multipleTestSaleItems : SaleItemType[] = [
  {
    product_offer_id: testProduct1.product_offer_id,
    quantity: 2,
  },
  {
    product_offer_id: testProduct2.product_offer_id,
    quantity: 1,
  },
];
test(`if posting multiple sales of different test products for the testUser is successful`, () => {
  return postSale({member_id: testMember.id, items: multipleTestSaleItems})
    .then(data => {  // Wait for the Promise to resolve
      // Test if all required properties are present in the response
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("created");
      expect(data).toHaveProperty("modified");
      expect(data).toHaveProperty("invoice_status");
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
          product_offer_id: testProduct1.product_offer_id,
          quantity: 2,
          sale_invoice_id: expect.any(Number),
        }),
        expect.objectContaining({  // an object that contains the following properties
          name: expect.any(String),
          price: 0,
          product_offer_id: testProduct2.product_offer_id,
          quantity: 1,
          sale_invoice_id: expect.any(Number),
        }),
      ]));
    });
});

test(`if getting the previous sales for the test user is successful`, () => {
  return getSalesByUsername(testMember.username)
    .then(data => {
      expect(data).toEqual(  // Expect an object which is...
        expect.arrayContaining([  // an array that contains...
          expect.objectContaining({  // an object that contains the following properties
            id: expect.any(Number),
            created: expect.any(String),
            modified: expect.any(String),
            invoice_status: expect.any(String),
            invoice_source: "api",
            invoice_type: "webshop",
            member_id: testMember.id,
            price_paid: expect.any(Number),
            price_unpaid: expect.any(Number),
            items: expect.arrayContaining([  // an array that contains...
              expect.objectContaining({  // an object that contains the following properties
                name: expect.any(String),
                price: expect.any(Number),
                product_offer_id: expect.any(Number),
                quantity: expect.any(Number),
                sale_invoice_id: expect.any(Number),
              }),
            ]),
          }),
        ]),
      );
    });
});

export {};