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
  const getMax = (prev, curr) => {
    return prev.likes > curr.likes ? prev : curr
  }

  const top = blogs.reduce(getMax, {})

  if (top !== {}) {
    return {
      title: top.title,
      author: top.author,
      likes: top.likes,
    }
  }

  return top
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
