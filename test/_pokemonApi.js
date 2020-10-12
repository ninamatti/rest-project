const { setupServer } = require("../src/server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { should } = require("chai");
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
        const res = await request.get("/api/pokemon/");
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
      it("should find the pokemon", async () => {
        const res = await request.get("/api/pokemon/42");
        const expected = "Golbat";
        console.log(res.body);
        chai.expect(res.body.name).to.equal(expected);
      });
    });
  });
});
