const { setupServer } = require("../src/server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const pokeData = require("../src/data");
chai.use(chaiHttp);
chai.should();
const app = setupServer();

/*
 * This sprint you will have to create all tests yourself, TDD style.
 * For this you will want to get familiar with chai-http https://www.chaijs.com/plugins/chai-http/
 * The same kind of structure that you encountered in lecture.express will be provided here.
 */
describe("Pokemon API Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(app);
  });

  describe("basic requirements", () => {
    describe("GET /api/pokemon", () => {
      it("should be able to get the whole list of pokemons", async () => {
        const res = await request.get("/api/pokemon");
        chai.expect(res.body.length).to.equal(151);
      });
      it("should only return the first n pokemon with limit query", async () => {
        const res = await request.get("/api/pokemon/limit/10");
        chai.expect(res.body.length).to.equal(10);
      });
    });

    describe("POST /api/pokemon", () => {
      it("should add a new pokemon", async () => {
        const res = await request.post("/api/pokemon/152/Abraxus");
        res.status.should.equal(201);
      });
    });

    describe("GET /api/pokemon/:id", () => {
      it("should find the pokemon by id", async () => {
        const res = await request.get("/api/pokemon/42");
        const expected = "Golbat";
        chai.expect(res.body.name).to.equal(expected);
      });
    });

    describe("GET /api/pokemon/:name", () => {
      it("should find the pokemon by name", async () => {
        const res = await request.get("/api/pokemon/Golbat");
        chai.expect(res.body.id).to.equal("042");
      });
    });

    describe("PATCH /api/pokemon/:nameorid", () => {
      it("should alter the pokemon name", async () => {
        const res = await request
          .patch("/api/pokemon/Golbat")
          .query({ name: "Digimon" });
        res.status.should.equal(200);
        res.body.name.should.equal("Digimon");
      });
    });
    describe("Delete /api/pokemon/:nameorid", () => {
      it("should delete the given pokemon", async () => {
        const res = await request.delete("/api/pokemon/Abra");
        let dummy = true;
        for (const pokemon of res.body) {
          if (pokemon.name === "Golbat") dummy = false;
        }
        dummy.should.equal(true);
      });
    });

    describe("GET /api/pokemon/:idOrName/evolutions", () => {
      it("should show the evolutions of a pokemon", async () => {
        const res = await request.get("/api/pokemon/Squirtle/evolutions");
        const expected = [
          { id: 8, name: "Wartortle" },
          { id: 9, name: "Blastoise" },
        ];
        res.body.should.deep.equal(expected);
      });
    });

    describe("GET /api/pokemon/:idOrName/evolutions/previous", () => {
      it("should show the previous evolutions of a pokemon", async () => {
        const res = await request.get(
          "/api/pokemon/Wartortle/evolutions/previous"
        );
        const expected = [{ id: 7, name: "Squirtle" }];
        res.body.should.deep.equal(expected);
      });
    });

    describe("GET /api/types", () => {
      it("should show all the types available", async () => {
        const res = await request.get("/api/types");
        res.body.should.deep.equal(pokeData.types);
      });
      it("should show n types with a limit of n", async () => {
        const res = await request.get("/api/types").query({ limit: 10 });
        res.body.length.should.equal(10);
      });
    });

    describe("POST /api/types", () => {
      it("should add a type", async () => {
        const res = await request
          .post("/api/types")
          .query({ typeName: "fish" });
        chai.expect(res.body.indexOf("fish")).to.be.above(-1);
      });
    });

    describe("DELETE /api/types/:name", () => {
      it("should delete given type", async () => {
        const length = pokeData.types.length;
        const res = await request.delete("/api/types/Grass");
        chai.expect(res.body.length).to.equal(length - 1);
      });
    });

    describe("GET /api/:type/pokemon", () => {
      //- `GET /api/types/:type/pokemon`
      //- It should return all Pokemon that are of a given type
      //- You only need to return `id` and `name` of the Pokemon, not the whole data for the Pokemon
      it("should return pokemon of a given type", async () => {
        const expected = [];
        for (const pokemon of pokeData.pokemon) {
          if (pokemon.types !== undefined) {
            if (pokemon.types.indexOf("Grass") > -1)
              expected.push({ id: pokemon.id, name: pokemon.name });
          }
        }
        const res = await request.get("/api/types/Grass/pokemon");
        chai.expect(res.body).to.eql(expected);
      });
    });

    describe("GET /api/attacks", () => {
      //- `GET /api/attacks`
      //- It should return all attacks
      //- It is able to take a query parameter `limit=n` that makes the endpoint only return `n` attacks
      it("should return all attacks within a limit of n (if given)", async () => {
        const res = await request.get("/api/attacks").query({ limit: 10 });
        res.body.length.should.equal(10);
      });
    });

    describe("GET /api/attacks/fast", () => {
      // - It should return fast attacks
      // - It is able to take a query parameter `limit=n` that makes the endpoint only return `n` attacks
      it("should return n attacks with a limit of n", async () => {
        const res = await request.get("/api/attacks").query({ limit: 10 });
        res.body.length.should.equal(10);
      });
    });

    describe("GET /api/attacks/special", () => {
      // - It should return special attacks
      // - It is able to take a query parameter `limit=n` that makes the endpoint only return `n` attacks
      it("should return n attacks with a limit of n", async () => {
        const res = await request.get("/api/attacks").query({ limit: 5 });
        res.body.length.should.equal(5);
      });
    });

    describe("GET /api/attacks/:name", () => {
      //  - Get a specific attack by name, no matter if it is fast or special
      it("should return all attacks", async () => {
        const res = await request.get("/api/attacks/Vine Whip");
        const expected = { name: "Vine Whip", type: "Grass", damage: 7 };
        res.body.should.deep.equal(expected);
      });
    });

    describe("GET /api/attacks/:name/pokemon", () => {
      //  - Returns all Pokemon (`id` and `name`) that have an attack with the given name
      it("should return a list of pokemon with the given attack", async () => {
        const res = await request.get("/api/attacks/Bubble/pokemon");
        Array.isArray(res.body).should.equal(true);
        res.body[0].name.should.equal("Squirtle");
      });
    });

    describe("POST /api/attacks/fast", () => {
      //  add an fast attack
      it("should add a special attack", async () => {
        const oldLength =
          pokeData.attacks.fast.length + pokeData.attacks.special.length + 1;
        const res = await request
          .post("/api/attacks/fast")
          .query({ name: "fast Ice Cream", type: "Ice", damage: 200 });

        const newLength = res.body.fast.length + res.body.special.length;

        newLength.should.equal(oldLength);
      });
    });
    describe("POST /api/attacks/special", () => {
      //  add an special attack
      it("should add a special attack", async () => {
        const oldLength =
          pokeData.attacks.fast.length + pokeData.attacks.special.length + 1;
        const res = await request
          .post("/api/attacks/special")
          .query({ name: "Ice Cream", type: "Ice", damage: 100 });

        const newLength = res.body.fast.length + res.body.special.length;

        newLength.should.equal(oldLength);
      });
    });
    describe("PATCH /api/attacks/:name", () => {
      // modifies specified attack
      it("should change the attack name", async () => {
        const res = await request
          .patch("/api/attacks/Ember")
          .query({ newName: "Tornado" });
        res.body.name.should.equal("Tornado");
      });
    });

    describe("DELETE /api/attacks/:name", () => {
      // deletes an attack
      it("should delete the attack with the given name", async () => {
        const totalLength =
          pokeData.attacks.fast.length + pokeData.attacks.special.length;
        const res = await request.delete("/api/attacks/Bite");
        const newLength = res.body.fast.length + res.body.special.length;
        newLength.should.equal(totalLength - 1);
      });
    });
  });
});
