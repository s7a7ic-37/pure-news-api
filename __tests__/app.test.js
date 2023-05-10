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

describe("/api/articles/:article_id", () => {
  it("GET status:200, responds with an article object by ID provided", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((res) => {
        const articleObject = res.body.article;
        const expected = {
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expect(articleObject).toEqual(expected);
      });
  });
  it("GET status: 400, returns error message when received invalid id", () => {
    return request(app)
      .get("/api/articles/article_3")
      .expect(400)
      .then((res) => {
        const responseMessage = res.body.message;
        expect(responseMessage).toBe("Bad request.");
      });
  });
  it("GET status: 404, returns error message when received unavailable id", () => {
    return request(app)
      .get("/api/articles/998")
      .expect(404)
      .then((res) => {
        const responseMessage = res.body.message;
        expect(responseMessage).toBe("No articles has been found.");
      });
  });
});
