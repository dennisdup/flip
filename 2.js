const express = require("express");
const ExpressBrute = require("express-brute");
const MemoryStore = ExpressBrute.MemoryStore;

const app = express();
const router = express.Router();

const store = new MemoryStore();

function bruteforce(namespace, freeRetries, minWait) {
  const bruteforce = new ExpressBrute(store, {
    freeRetries: freeRetries,
    minWait: minWait * 60 * 1000,
  });

  return (req, res, next) => {
    bruteforce.prevent(req, res, next, {
      key: (req) => req.ip + namespace,
      message: `Too many requests for the ${namespace} namespace. Please retry in ${minWait} minutes`,
    });
  };
}

app.use(bruteforce("global", 2, 5));

router.get("/v1/users", bruteforce("users", 50, 1), (req, res) => {
  res.send("This is the /v1/users endpoint.");
});

router.get("/v1/apps", async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      bruteforce("apps", 2, 2)(req, res, (error) => {
        if (error) {
          console.log("bruteforce error", error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
    res.send("This is the /v1/apps endpoint.");
  } catch (error) {
    console.log("error", error);
    res.status(429).send(error.message);
  }
});

app.use(router);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
