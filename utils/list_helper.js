const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likeAdder = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(likeAdder, 0)
}

module.exports = {
  dummy,
  totalLikes
}
