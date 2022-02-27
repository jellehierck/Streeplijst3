import { getFolders, getMemberById, getMemberByUsername, ping } from "./localAPI";

/**
 * Test member data. This assumes a test member with the following ID and username exists on Congressus
 */
const testMember = {
  id: 347980,
  username: "s9999999",
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
      1;
      expect(data).toHaveProperty("show_almanac");
      expect(data).toHaveProperty("status");
      // expect(data).toHaveProperty("profile_picture");  // Removed from Congressus so not used anymore
      expect(data).toHaveProperty("bank_account");
    });
});

test("if all folders can be retrieved", () => {
  return getFolders()
    .then(data => {
      // TODO: Check for equality here
      expect(data).toEqual(  // Expect the returned array to equal...
        expect.arrayContaining([  // an array that contains...
          expect.objectContaining({  // and object that contains...
            // The following properties
            id: expect.any(Number),
            name: expect.any(String),
            parent_id: expect.any(Number),
            published: expect.any(Boolean),
            path: expect.any(String),
            // media: expect.any(String),  // TODO: Or accept null | undefined?
            // TODO: Add children and products fields too?
          }),
        ]),
      );
    });
});

export {};