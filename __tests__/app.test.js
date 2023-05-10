const request = require("supertest");
const app = require("./../app.js");
const testData = require("./../db/data/test-data/index.js");
const seed = require("./../db/seeds/seed.js");
const db = require("./../db/connection.js");
const endpointsJSON = require("./../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("/api/topics", () => {
  it("GET status:200, responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const topicsArray = res.body.topics;
        expect(topicsArray.length).toBe(3);
        topicsArray.forEach((topic) => {
          const { slug, description } = topic;
          expect(typeof slug).toBe("string");
          expect(typeof description).toBe("string");
        });
      });
  });
  it("GET status:404, responds with an error when provided endpoint that does not exist", () => {
    return request(app).get("/api/news").expect(404);
  });
});

describe("/api", () => {
  it("GET status:200, responds with an object representing all available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const endpointsObject = res.body;
        expect(endpointsObject).toEqual(endpointsJSON);
      });
  });
});
