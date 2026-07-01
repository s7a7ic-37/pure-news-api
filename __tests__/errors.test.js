const { errorHandler } = require("../errors/errors");

const getResponse = () => {
  const response = {
    send: jest.fn(),
    status: jest.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
};

describe("errorHandler", () => {
  it("returns known status errors without trying to send a second response", () => {
    const response = getResponse();
    errorHandler({ status: 404, message: "Article not found" }, {}, response);
    expect(response.status).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.send).toHaveBeenCalledWith({ message: "Article not found" });
  });

  it("maps PostgreSQL input and foreign key errors", () => {
    const invalidId = getResponse();
    errorHandler({ code: "22P02" }, {}, invalidId);
    expect(invalidId.status).toHaveBeenCalledWith(400);

    const missingUser = getResponse();
    errorHandler(
      { code: "23503", constraint: "comments_author_fkey" },
      {},
      missingUser
    );
    expect(missingUser.status).toHaveBeenCalledWith(404);
  });

  it("keeps unknown failures as a generic server error", () => {
    const response = getResponse();
    errorHandler(new Error("internal details"), {}, response);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
