import express from "express";

const app = express();


app.get("/", (req, res) => {
  res.send("Inventory Service");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});