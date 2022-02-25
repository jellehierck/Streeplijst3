import { ping } from "./localAPI";


test("if a ping is received", () => {
  return ping()
    .then(data => {
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


export {};