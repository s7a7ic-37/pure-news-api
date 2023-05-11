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
        const article = res.body.article;
        expect(article.article_id).toBe(3);
        expect(article.title).toBe("Eight pug gifs that remind me of mitch");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("icellusedkars");
        expect(article.body).toBe("some gifs");
        expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(article.votes).toBe(0);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
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

describe("/api/articles", () => {
  it("GET status:200, responds with an array of all article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articlesArray = res.body.articles;
        expect(articlesArray.length).toBe(testData.articleData.length);
        articlesArray.forEach((article) => {
          const {
            author,
            title,
            article_id,
            topic,
            created_at,
            votes,
            article_img_url,
            comment_count,
          } = article;
          expect(typeof author).toBe("string");
          expect(typeof title).toBe("string");
          expect(typeof article_id).toBe("number");
          expect(typeof topic).toBe("string");
          expect(typeof created_at).toBe("string");
          expect(typeof votes).toBe("number");
          expect(typeof article_img_url).toBe("string");
          expect(typeof comment_count).toBe("number");
        });
      });
  });
  it("GET status:200, sorts results by 'created_at' date in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articlesArray = res.body.articles;
        expect(articlesArray).toBeSorted({
          descending: true,
          key: "created_at",
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  it("GET status:200, responds with an array of comments objects for the given article ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const commentsArray = res.body.comments;
        expect(commentsArray.length).toBe(11);
        commentsArray.forEach((comment) => {
          const { comment_id, votes, created_at, author, body, article_id } =
            comment;
          expect(typeof comment_id).toBe("number");
          expect(typeof votes).toBe("number");
          expect(typeof created_at).toBe("string");
          expect(typeof author).toBe("string");
          expect(typeof body).toBe("string");
          expect(article_id).toBe(1);
        });
      });
  });
  it("GET status:200, sorts comments by 'created_at' date in descending order by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const commentsArray = res.body.comments;
        expect(commentsArray).toBeSorted({
          descending: true,
          key: "created_at",
        });
      });
  });
  it("GET status:200, responds with an empty array if no comments are found for the correct article ID", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((res) => {
        const commentsArray = res.body.comments;
        expect(commentsArray).toEqual([]);
      });
  });
  it("GET status: 400, returns error message when received invalid id", () => {
    return request(app)
      .get("/api/articles/invalid-id/comments")
      .expect(400)
      .then((res) => {
        const responseMessage = res.body.message;
        expect(responseMessage).toBe("Bad request.");
      });
  });
  it("GET status: 404, returns error message when received unavailable id", () => {
    return request(app)
      .get("/api/articles/998/comments")
      .expect(404)
      .then((res) => {
        const responseMessage = res.body.message;
        expect(responseMessage).toBe(
          "No articles has been found with id of 998"
        );
      });
  });
  it("POST status:201, should add and return posted comment", () => {
    const testComment = {
      username: "rogersop",
      body: "I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then((res) => {
        const comment = res.body.comment[0];
        const { comment_id, body, votes, author, article_id, created_at } =
          comment;

        const currentDate = new Date().toISOString();
        const createdTimestamp = Date.parse(created_at);
        const currentTimestamp = Date.parse(currentDate);

        expect(comment_id).toBe(19);
        expect(body).toBe("I'm the Sultan of Sentiment!");
        expect(article_id).toBe(1);
        expect(author).toBe("rogersop");
        expect(votes).toBe(0);
        expect(createdTimestamp - currentTimestamp).toBeLessThanOrEqual(100);
      });
  });
  it("POST status:400, responds with error message when provided invalid article id", () => {
    const testComment = {
      username: "rogersop",
      body: "I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/wrong-id/comments")
      .send(testComment)
      .expect(400)
      .then((res) => {
        const responseMessage = res.body.message;
        expect(responseMessage).toBe("Bad request.");
      });
  });
  it("POST status:404, responds with error message when provided unavailable article id", () => {
    const testComment = {
      username: "rogersop",
      body: "I'm the Sultan of Sentiment!",
    };
    const articleId = 997;
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(testComment)
      .expect(404)
      .then((res) => {
        const responseMessage = res.body.message;
        expect(responseMessage).toBe(
          `No articles has been found with id of ${articleId}`
        );
      });
  });
  it("POST status:404, responds with error message when passed invalid username", () => {
    const testComment = {
      username: "username123",
      body: "I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404)
      .then((res) => {
        const testUsername = testComment.username;
        const responseMessage = res.body.message;
        expect(responseMessage).toBe(
          `No user has been found with username '${testUsername}'`
        );
      });
  });
  it("POST status:400, responds with error message when passed an empty body", () => {
    const testComment = {
      username: "rogersop",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then((res) => {
        const responseMessage = res.body.message;
        expect(responseMessage).toBe("Your comment cannot be empty!");
      });
  });
});
