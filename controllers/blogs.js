const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { comment: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user', {
      username: 1,
      name: 1
    })
    .populate('comments', { comment: 1 })
  response.json(blog)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { body, user } = request

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: []
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog?.user?.toString() === request.user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'invalid username or password' })
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true
  })
    .populate('user', {
      username: 1,
      name: 1
    })
    .populate('comments', { comment: 1 })
  response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  const { body } = request

  const blog = await Blog.findById(request.params.id)

  const comment = new Comment({
    comment: body.comment,
    blog: request.params.id
  })
  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()

  response.status(201).json(savedComment)
})

blogsRouter.get('/:id/comments', async (request, response) => {
  const blogs = await Comment.find({ blog: request.params.id })
  response.json(blogs)
})

module.exports = blogsRouter
