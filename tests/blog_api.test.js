const { beforeEach, describe, test, after } = require("node:test");
const assert = require('node:assert');
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObject = new Blog(helper.initialBlogs[0]);
    await blogObject.save();
    blogObject = new Blog(helper.initialBlogs[1]);
    await blogObject.save();
    console.log("Database initialized");
  });
  
describe("tests GET /api/blogs", () => {
  test("returns the correct amount of blog posts in JSON format", async () => {
    const response = await api.get("/api/blogs")
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
});

  test("returns the blogs posts in JSON format", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});



after(async () => {
  await mongoose.connection.close();
});
