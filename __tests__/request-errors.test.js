jest.mock("../db/connection", () => ({ query: jest.fn() }));
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

describe("request parsing errors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it.each(['DEMOONLY', '"DEMOONLY"', '{"body":"DEMOONLY",}'])("rejects malformed JSON without reflecting submitted text: %s", async (body) => {
    const response = await request(app).post("/api/articles/1/comments")
      .set("Content-Type", "application/json").send(body).expect(400);
    expect(response.body).toEqual({ message: "Request body must be valid JSON." });
    expect(response.text).not.toContain("DEMOONLY");
    expect(db.query).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("rejects an oversized JSON body before any database call", async () => {
    const response = await request(app).post("/api/articles/1/comments")
      .send({ body: "x".repeat(110000) }).expect(413);
    expect(response.body).toEqual({ message: "Request body is too large." });
    expect(db.query).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it.each([
    { username: "rogersop", body: "A comment with a \u0000 character." },
    { username: "rogers\u0000op", body: "A fictional comment." },
  ])("rejects null characters before any database call", async (input) => {
    const response = await request(app).post("/api/articles/1/comments").send(input).expect(400);
    expect(response.body.message).toBe(input.username.includes("\0")
      ? "Choose a sample username." : "Comments cannot contain null characters.");
    expect(db.query).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });
});
