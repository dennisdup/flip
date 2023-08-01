const express = require("express");
const ExpressBrute = require("express-brute");
const MemoryStore = ExpressBrute.MemoryStore;

const app = express();
const router = express.Router();

const store = new MemoryStore();

function rateLimiterMiddleware(
  namespace,
  freeRetries,
  minWait,
  usePromise = false
) {
  const bruteforce = new ExpressBrute(store, {
    freeRetries: freeRetries,
    minWait: minWait * 60 * 1000,
    failCallback: (_req, res, _) => {
      res
        .status(429)
        .send(
          `Too many requests for the ${namespace} namespace. Please retry in ${minWait} minutes`
        );
    },
    handleStoreError: function (error) {
      throw {
        message: error.message,
        parent: error.parent,
      };
    },
  });

  if (usePromise) {
    return (req, res, next) => {
      return new Promise((resolve) => {
        resolve(bruteforce.prevent(req, res, next));
      }).catch((err) => {
        throw err;
      });
    };
  } else {
    return (req, res, next) => {
      bruteforce.prevent(req, res, next);
    };
  }
}

app.use(rateLimiterMiddleware("global", 100, 5));

router.get("/v1/users", rateLimiterMiddleware("users", 1, 1), (req, res) => {
  res.send("This is the /v1/users endpoint.");
});

router.get("/v1/apps", async (req, res, next) => {
  try {
    // promise-based middleware
    await rateLimiterMiddleware("apps", 1, 1, true)(req, res, next);

    res.send("This is the /v1/apps endpoint.");
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

router.get("/v1/test", rateLimiterMiddleware("users", 1, 1), (req, res) => {
  res.send("This is the /v1/users endpoint.");
});

app.use(router);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
