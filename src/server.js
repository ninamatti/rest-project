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

  app.get("/api/pokemon/:identifier", (req, res) => {
    if (Number(req.params.identifier)) {
      const id = Number(req.params.identifier);
      for (const item of pokeData.pokemon) {
        if (Number(item.id) === id) res.send(item);
      }
    } else {
      const name = req.params.identifier;
      for (const item of pokeData.pokemon) {
        if (item.name === name) res.send(item);
      }
    }
  });

  app.patch("/api/pokemon/:idOrName", (req, res) => {
    let Index = 0;
    const { name } = req.query;
    if (Number(req.params.identifier)) {
      const id = Number(req.params.idOrName);
      for (const [index, value] of pokeData.pokemon.entries()) {
        if (Number(value.id) === id) Index = index;
      }
    } else {
      const name = req.params.idOrName;
      for (const [index, value] of pokeData.pokemon.entries()) {
        if (value.name === name) Index = index;
      }
    }
    pokeData.pokemon[Index].name = name;
    res.send(pokeData.pokemon[Index]);
  });

  app.delete("/api/pokemon/:idOrName", (req, res) => {
    let Index = 0;
    if (Number(req.params.identifier)) {
      const id = Number(req.params.idOrName);
      for (const [index, value] of pokeData.pokemon.entries()) {
        if (Number(value.id) === id) Index = index;
      }
    } else {
      const name = req.params.idOrName;
      for (const [index, value] of pokeData.pokemon.entries()) {
        if (value.name === name) Index = index;
      }
    }
    pokeData.pokemon.splice(Index, 1);
    res.send(pokeData.pokemon);
  });

  app.get("/api/pokemon/:idOrName/evolutions", (req, res) => {
    let Index = 0;
    if (Number(req.params.identifier)) {
      const id = Number(req.params.idOrName);
      for (const [index, value] of pokeData.pokemon.entries()) {
        if (Number(value.id) === id) Index = index;
      }
    } else {
      const name = req.params.idOrName;
      for (const [index, value] of pokeData.pokemon.entries()) {
        if (value.name === name) Index = index;
      }
    }
    res.send(pokeData.pokemon[Index].evolutions);
  });

  app.get("/api/pokemon/:idOrName/evolutions/previous", (req, res) => {
    let Index = 0;
    if (Number(req.params.identifier)) {
      const id = Number(req.params.idOrName);
      for (const [index, value] of pokeData.pokemon.entries()) {
        if (Number(value.id) === id) Index = index;
      }
    } else {
      const name = req.params.idOrName;
      for (const [index, value] of pokeData.pokemon.entries()) {
        if (value.name === name) Index = index;
      }
    }
    res.send(pokeData.pokemon[Index]["Previous evolution(s)"]);
  });

  app.get("/api/types", (req, res) => {});

  app.post("/api/types", (req, res) => {
    // Adds a Type
  });

  app.delete("/api/types/:name", (req, res) => {
    // Deletes the given type
  });

  app.get("/api/types/:type/pokemon", (req, res) => {
    // It should return all Pokemon that are of a given type
  });

  // GET /api/types/:type/pokemon

  // You only need to return id and name of the Pokemon, not the whole data for the Pokemon
  // GET /api/attacks
  // It should return all attacks
  // It is able to take a query parameter limit=n that makes the endpoint only return n attacks
  // GET /api/attacks/fast
  // It should return fast attacks
  // It is able to take a query parameter limit=n that makes the endpoint only return n attacks
  // GET /api/attacks/special
  // It should return special attacks
  // It is able to take a query parameter limit=n that makes the endpoint only return n attacks
  // GET /api/attacks/:name
  // Get a specific attack by name, no matter if it is fast or special
  // GET /api/attacks/:name/pokemon
  // Returns all Pokemon (id and name) that have an attack with the given name
  // POST /api/attacks/fast or POST /api/attacks/special
  // Add an attack
  // PATCH /api/attacks/:name
  // Modifies specified attack
  // DELETE /api/attacks/:name
  // Deletes an attack

  return app;
};

module.exports = { setupServer };
