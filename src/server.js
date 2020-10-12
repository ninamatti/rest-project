const pokeData = require("./data");
const express = require("express");
const setupServer = () => {
  /**
   * Create, set up and return your express server, split things into separate files if it becomes too long!
   */
  const app = express();
  // GET /api/pokemon

  app.get("/api/pokemon/", (req, res) => {
    res.send(pokeData.pokemon);
  });

  app.get("/api/pokemon/:n", (req, res) => {
    console.log("req.params.n", req.params.n);
    if (req.params.n !== undefined) {
      const limit = req.params.n;
      const result = pokeData.pokemon.slice(0, limit);
      res.send(result);
    }
  });

  // - `POST /api/pokemon`
  // - It should add a Pokemon. For Basic Requirements, verification that the data is good is not necessary
  app.post("/api/pokemon/:id/:name", (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    pokeData.pokemon.push({ id, name }); //the array
    res.sendStatus(201);
  });

  /* - `GET /api/pokemon`
  - It should return the full list of Pokemon
  - It is able to take a query parameter `limit=n` that makes the endpoint only return the first `n` Pokemon */

  return app;
};

module.exports = { setupServer };
