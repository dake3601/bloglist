const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('when list has zero blogs, equals 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(helper.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has many blogs, equals sum', () => {
    const result = listHelper.totalLikes(helper.listWithBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {

  test('when list has zero blogs, equals {}', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({})
  })

  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog(helper.listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has many blogs, equals favorite', () => {
    const result = listHelper.favoriteBlog(helper.listWithBlogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })

  test('when list has many blogs, equals one of the two', () => {
    const result = listHelper.favoriteBlog(helper.twoFavorites)
    try {
      expect(result).toEqual({
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 5
      })
    } catch {
      expect(result).toEqual({
        title: 'First class tests',
        author: 'Robert C. Martin',
        likes: 5
      })
    }
  })
})

describe('most blogs', () => {

  test('when list has zero blogs, equals {}', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({})
  })

  test('when list has only one blog, equals that author', () => {
    const result = listHelper.mostBlogs(helper.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('when list has many blogs, equals top author', () => {
    const result = listHelper.mostBlogs(helper.listWithBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  test('when list has two equal authors, equals one of the two', () => {
    const result = listHelper.mostBlogs(helper.twoFavorites)
    try {
      expect(result).toEqual({
        author: 'Edsger W. Dijkstra',
        blogs: 1
      })
    } catch {
      expect(result).toEqual({
        author: 'Robert C. Martin',
        blogs: 1
      })
    }
  })
})

describe('most likes', () => {

  test('when list has zero blogs, equals {}', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual({})
  })

  test('when list has only one blog, equals that author', () => {
    const result = listHelper.mostLikes(helper.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has many blogs, equals top author', () => {
    const result = listHelper.mostLikes(helper.listWithBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

  test('when list has two authors with equal likes, equals one of the two', () => {
    const result = listHelper.mostLikes(helper.twoFavorites)
    try {
      expect(result).toEqual({
        author: 'Edsger W. Dijkstra',
        likes: 5
      })
    } catch {
      expect(result).toEqual({
        author: 'Robert C. Martin',
        likes: 5
      })
    }
  })
})
