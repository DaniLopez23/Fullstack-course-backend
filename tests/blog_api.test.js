const { beforeEach, describe, test, after } = require("node:test");
const assert = require("node:assert");

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const noteObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = noteObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("tests GET /api/blogs", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const noteObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = noteObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test("returns the correct amount of blog posts in JSON format", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("returns the blogs posts in JSON format", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("verifies that the unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    const keys = Object.keys(response.body[0]);
    assert.strictEqual(keys.includes("id"), true);
  });
});

describe("tests POST /api/blogs", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const noteObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = noteObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });
  test("verifies that making an HTTP POST request to the /api/blogs url successfully creates a new blog post", async () => {
    const newBlog = {
      title: "Hi testing...",
      author: "Daniel",
      url: "https://www.daniel.com",
      likes: 16,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("verifies that making an HTTP POST request to the /api/blogs url successfully increments the length of blogs", async () => {
    const newBlog = {
      title: "Hi testing twice...",
      author: "Daniel",
      url: "https://www.daniel.com",
      likes: 16,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await helper.blogsInDb();
    assert.strictEqual(response.length, helper.initialBlogs.length + 1);
  });

  test("verifies that if the likes property is missing from the request, it will default to the value 0", async () => {
    const newBlog = {
      title: "Hi testing twice...",
      author: "Daniel",
      url: "https://www.daniel.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await helper.blogsInDb();
    assert.strictEqual(response[response.length - 1].likes, 0);
  });

  test("verifies that if the url or title or both properties are missing from the request, it will return 400 Bad Request", async () => {
    const newBlog = {
      //  title: "Hi testing twice...",
      author: "Daniel",
      //  url: "https://www.daniel.com",
      likes: 16,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

describe("tests DELETE /api/blogs/:id", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const noteObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = noteObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });
  test("verifies that making an HTTP DELETE request with a VALID id to the /api/blogs/:id url successfully removes a blog post", async () => {
    const blogsAtStart = await Blog.find({});
    const id = blogsAtStart[0]._id.toString(); // Convert ObjectId to string

    await api.delete(`/api/blogs/${id}`).expect(204);
  });
});

describe("tests PUT /api/blogs/:id", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const noteObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = noteObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test("verifies that making an HTTP PUT request with a VALID id to the /api/blogs/:id url successfully updates a blog post", async () => {
    // Get the first blog post
    const blogsAtStart = await Blog.find({});
    const id = blogsAtStart[0]._id.toString(); // Convert ObjectId to string

    const newBlog = {
      title: "Hi updating...",
      author: "Daniel Lopez",
      url: "https://www.daniellopez.com",
      likes: 98,
    };

    await api
      .put(`/api/blogs/${id}`)
      .send(newBlog)
      .expect(200) // Make sure we expect a 200 status code for success
      .expect("Content-Type", /application\/json/);

    const response = await helper.blogById(id);
    
    assert.strictEqual(response.id, id);
    assert.strictEqual(response.title, newBlog.title);
    assert.strictEqual(response.author, newBlog.author);
    assert.strictEqual(response.url, newBlog.url);
    assert.strictEqual(response.likes, newBlog.likes);
  });
});

after(async () => {
  await mongoose.connection.close();
});
