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

  app.get("/api/pokemon/limit/:n", (req, res) => {
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

  /*  - `GET /api/pokemon/:id`
  - It should return the Pokemon with the given id. Example: `GET /api/pokemon/042` should return the data for Golbat
  - Leading zeroes should not be necessary, so `GET /api/pokemon/42` would also return Golbat
- `GET /api/pokemon/:name`
  - It should return the Pokemon with given name. Example: `GET /api/pokemon/Mew` should return the data for Mew
  - The name should be case-insensitive
  - Hint: You might want to try handling this one and the last one in the same route. */

  app.get("/api/pokemon/:id", (req, res) => {
    const id = req.params.id;
    console.log("id", id);
    const pokemon = pokeData.pokemon[id - 1];
    console.log("pokemon", pokemon);

    res.send(pokemon);
  });

  return app;
};

module.exports = { setupServer };
