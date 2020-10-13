const pokeData = require("./data");
const express = require("express");
const { indexOf } = require("underscore");
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

  app.get("/api/types", (req, res) => {
    const { limit } = req.query;
    if (limit) res.send(pokeData.types.slice(0, limit));
    else res.send(pokeData.types);
  });

  app.post("/api/types", (req, res) => {
    // Adds a Type
    const { typeName } = req.query;
    pokeData.types.push(typeName);
    res.send(pokeData.types);
  });

  app.delete("/api/types/:name", (req, res) => {
    // Deletes the given type
    const typeName = req.params.name;
    for (let i = 0; i < pokeData.types.length; i++) {
      if (pokeData.types[i] === typeName) pokeData.types.splice(i, 1);
    }
    res.send(pokeData.types);
  });

  app.get("/api/types/:type/pokemon", (req, res) => {
    // It should return all Pokemon that are of a given type
    const result = [];
    const type = req.params.type;
    for (const pokemon of pokeData.pokemon) {
      if (pokemon.types.indexOf(type) > -1)
        result.push({ id: pokemon.id, name: pokemon.name });
    }
    res.send(result);
  });

  app.get("/api/attacks", (req, res) => {
    const { limit } = req.query;
    const result = [];
    const fastLength = pokeData.attacks.fast.length;
    if (!limit) res.send(pokeData.attacks);
    if (limit <= fastLength) {
      for (let i = 0; i < limit; i++) {
        result[i] = pokeData.attacks.fast[i];
      }
      res.send(result);
    } else {
      for (let i = 0; i < fastLength; i++) {
        result[i] = pokeData.attacks.fast[i];
      }
      for (
        let i = 0;
        i < limit - fastLength && i < pokeData.attacks.special.length;
        i++
      ) {
        result[fastLength + i] = pokeData.attacks.special[i];
      }
      res.send(result);
    }
    // It should return all attacks
    // It is able to take a query parameter limit=n that makes the endpoint only return n attacks
  });

  app.get("/api/attacks/fast", (req, res) => {
    // It should return fast attacks
    // It is able to take a query parameter limit=n that makes the endpoint only return n attacks
    const { limit } = req.query;
    const result = [];
    const fastLength = pokeData.attacks.fast.length;
    if (!limit || limit > fastLength) res.send(pokeData.attacks.fast);
    if (limit <= fastLength) {
      for (let i = 0; i < limit; i++) {
        result[i] = pokeData.attacks.fast[i];
      }
      res.send(result);
    }
  });

  app.get("/api/attacks/special", (req, res) => {
    // It should return special attacks
    // It is able to take a query parameter limit=n that makes the endpoint only return n attacks
    const { limit } = req.query;
    const result = [];
    const specialLength = pokeData.attacks.special.length;
    if (!limit || limit > specialLength) res.send(pokeData.attacks.special);
    if (limit <= specialLength) {
      for (let i = 0; i < limit; i++) {
        result[i] = pokeData.attacks.special[i];
      }
      res.send(result);
    }
  });

  app.get("/api/attacks/:name", (req, res) => {
    // Get a specific attack by name, no matter if it is fast or special
    const attackName = req.params.name;

    const finder = () => {
      for (const attack of pokeData.attacks.fast) {
        if (attack.name === attackName) return attack;
      }
      for (const attack of pokeData.attacks.special) {
        if (attack.name === attackName) return attack;
      }
    };

    res.send(finder());
  });

  app.get("/api/attacks/:name/pokemon", (req, res) => {
    const attackName = req.params.name;
    const result = [];
    const checker = (pokeObj) => {
      for (const attack of pokeObj.attacks.fast) {
        if (attack.name === attackName) return true;
      }
      for (const attack of pokeObj.attacks.special) {
        if (attack.name === attackName) return true;
      }
      return false;
    };
    for (const pokemon of pokeData.pokemon) {
      if (checker(pokemon) === true) {
        result.push({ id: pokemon.id, name: pokemon.name });
      }
      res.send(result);
    }
    //pokeData.pokemon <<loop this
    //pokeData.pokemon.attacks.fast and pokeData.pokemon.attacks.special
    // Returns all Pokemon (id and name) that have an attack with the given name
    //pokeData.
  });

  app.post("/api/attacks/fast", (req, res) => {
    const { name, type, damage } = req.query;
    const finder = () => {
      for (const attack of pokeData.attacks.fast) {
        if (attack.name === name) return true;
      }
      return false;
    };
    if (!finder()) {
      pokeData.attacks.fast.push({ name, type, damage });
      res.send(pokeData.attacks);
    } else {
      res.send("Attack already exists");
    }
  });

  app.post("/api/attacks/special", (req, res) => {
    const { name, type, damage } = req.query;
    const finder = () => {
      for (const attack of pokeData.attacks.special) {
        if (attack.name === name) return true;
      }
      return false;
    };
    if (!finder()) {
      pokeData.attacks.special.push({ name, type, damage });
      res.send(pokeData.attacks);
    } else {
      res.send("Attack already exists");
    }
  });

  app.patch("/api/attacks/:name", (req, res) => {
    const attackName = req.params.name;
    const { newName } = req.query;
    const changer = () => {
      for (const attack of pokeData.attacks.fast) {
        if (attack.name === attackName) attack.name = newName;
        res.send(attack);
      }
      for (const attack of pokeData.attacks.special) {
        if (attack.name === attackName) attack.name = newName;
        res.send(attack);
      }
    };
    changer();
    // Modifies specified attack
  });

  app.delete("/api/attacks/:name", (req, res) => {
    // Deletes an attack
    const attackName = req.params.name;
    const deleter = () => {
      for (const [index, value] of pokeData.attacks.fast.entries()) {
        if (value.name === attackName) pokeData.attacks.fast.splice(index, 1);
        res.send(pokeData.attacks.fast);
      }
      for (const [index, value] of pokeData.attacks.special.entries()) {
        if (value.name === attackName)
          pokeData.attacks.special.splice(index, 1);
        res.send(pokeData.attacks.special);
      }
    };
    deleter();
  });

  return app;
};

module.exports = { setupServer };
