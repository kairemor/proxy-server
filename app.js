const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const https = require("https");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello, world!');
  });
app.all("*", (req, res) => {
  const { url, method, headers, body } = req;
  const options = {
    method,
    headers,
  };
  console.log(url);

  if (method !== "GET") {
    options.body = JSON.stringify(body);
  }

  https
    .request(url, options, (response) => {
      let responseData = "";

      response.on("data", (chunk) => {
        responseData += chunk;
      });

      response.on("end", () => {
        res.json({
          url,
          method,
          headers,
          body,
          response: responseData,
        });
      });
    })
    .end();
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
