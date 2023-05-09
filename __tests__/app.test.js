const request = require("supertest");
const app = require("./../app.js");
const testData = require("./../db/data/test-data/index.js");
const seed = require("./../db/seeds/seed.js");
const db = require("./../db/connection.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("GET /api/topics", () => {
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
