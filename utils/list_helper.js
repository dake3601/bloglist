const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likeAdder = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(likeAdder, 0)
}

const favoriteBlog = (blogs) => {
  const getMaxLikes = (prev, curr) => {
    return prev.likes > curr.likes ? prev : curr
  }

  const top = blogs.reduce(getMaxLikes, {})

  if (top !== {}) {
    return {
      title: top.title,
      author: top.author,
      likes: top.likes,
    }
  }

  return top
}

const mostBlogs = (blogs) => {
  const authors = {}

  blogs.forEach(blog => {
    if (!authors[blog.author]) {
      authors[blog.author] = 0
    }
    authors[blog.author] += 1
  })

  let maxAuthor = ''
  let maxBlogs = 0
  for (const author in authors) {
    if (authors[author] > maxBlogs) {
      maxAuthor = author
      maxBlogs = authors[author]
    }
  }

  if (maxBlogs > 0) {
    return {
      author: maxAuthor,
      blogs: maxBlogs
    }
  }

  return {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
