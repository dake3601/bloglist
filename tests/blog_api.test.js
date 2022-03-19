const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('all blogs have id property', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => expect(blog.id).toBeDefined())
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(
    'Canonical string reduction'
  )
  const authors = blogsAtEnd.map(b => b.author)
  expect(authors).toContain(
    'Edsger W. Dijkstra'
  )
  const urls = blogsAtEnd.map(b => b.url)
  expect(urls).toContain(
    'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
  )
})

test('likes missing defaults to 0', async () => {
  const newBlog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const newBlogAtEnd = blogsAtEnd.find(b =>
    b.title === newBlog.title &&
    b.author === newBlog.author &&
    b.url === newBlog.url
  )
  expect(newBlogAtEnd.likes).toEqual(0)
})

test('blog without title and url is not added', async () => {
  const newBlog = {
    author: 'Robert C. Martin',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('deleting a blog with id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).not.toContain(blogToDelete.title)
  const authors = blogsAtEnd.map(b => b.author)
  expect(authors).not.toContain(blogToDelete.author)
  const urls = blogsAtEnd.map(b => b.url)
  expect(urls).not.toContain(blogToDelete.url)
})

test('updating amount of likes', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: 100,
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogAtEnd = blogsAtEnd.find(b =>
    b.id === blogToUpdate.id
  )

  expect(updatedBlogAtEnd.likes).toEqual(updatedBlog.likes)
  expect(updatedBlogAtEnd.title).toEqual(updatedBlog.title)
  expect(updatedBlogAtEnd.author).toEqual(updatedBlog.author)
  expect(updatedBlogAtEnd.url).toEqual(updatedBlog.url)
})

afterAll(() => {
  mongoose.connection.close()
})
