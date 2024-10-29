const fs = require("fs");
// fs.appendFile("text.txt", "hello", (error) => {
//   if (error) console.log(err);
//   console.log("done");
// });
// fs.readFile("text.txt", "utf8", (err, data) => {
//   console.log(data);
// });
// fs.unlink("text.txt", (error, data) => {
//   if (error) console.log("error");
//   console.log(data);
// });
// fs.appendFile("test.tst", "hii", (error) => {
//   if (error) console.log();
//   console.log("succeed");
// });
// fs.readFile("test.tt", "utf8", (err, data) => {
//   if (err) console.log("error");
//   console.log(data);
// });
// fs.unlink("test.tst", (err, data) => {
//   if (err) console.log("error");
//   console.log(data);
// });

// const server = http.createServer((req, res) => {
//   const url = req.url;
//   if (url === "/users") {
//     res.statusCode = 200;
//     res.setHeader("Content-type", "text/html");
//     fs.readFile("index.html", "utf8", (err, data) => {
//       res.write(data);
//       res.end();
//     });
//   }
// });
// server.listen(8080, console.log("your service is running in PORT:8080"));
// if (url === "/users") {
//   res.write(JSON.stringify(users));
// } else {
//   res.write(JSON.stringify({ message: "not working" }));
// }
// const users = [
//   { id: 1, ner: "naruyanga", nas: 15 },
//   { id: 2, ner: "oyun", nas: 20 },
//   { id: 3, ner: "misheel", nas: 10 },
//   { id: 4, ner: "telmuun", nas: 17 },
//   { id: 5, ner: "anar", nas: 17 },
// ];
const http = require("http");

let data;
const jsonData = fs.readFileSync("users.json");
data = JSON.parse(jsonData);

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  if (method === "GET") {
    if (url.startsWith("/users?id=")) {
      const id = url.split("=")[1];
      const user = data.find((user) => {
        return user.id === Number(id);
      });
      if (user) {
        res.write(JSON.stringify(user));
      } else {
        res.write(JSON.stringify({ message: "not working" }));
      }
    } else {
      res.write(JSON.stringify(data));
    }
    res.end();
  }

  if (method === "POST") {
    let body = "";
    req.on("data", (buffer) => {
      body += buffer;
    });

    req.on("end", () => {
      const parsedData = JSON.parse(body);

      const newUser = {
        id: data.length + 1,
        ...parsedData,
      };
      data.push(newUser);
      fs.writeFileSync("users.json", JSON.stringify(data), (err) => {
        console.log("error");
      });
      res.write(JSON.stringify({ message: "done" }));
      res.end();
    });
  }
  if (method === "DELETE") {
    let body = "";
    req.on("data", (buffer) => {
      body += buffer;
    });
    req.on("end", () => {
      const JSON_id = JSON.parse(body);
      const id = JSON_id.id;
      const newData = data.filter((user) => {
        return Number(user.id) !== Number(id);
      });

      fs.writeFileSync("users.json", JSON.stringify(newData), (err) => {
        console.log("error");
      });
      res.write(JSON.stringify({ message: "deleted" }));
      res.end();
    });
  }
});

server.listen(8080, console.log("your service is running in PORT:8080"));
