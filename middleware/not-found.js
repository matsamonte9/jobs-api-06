const notFoundMiddleware = (req, res) => {
  return res.send("Page not Found");
}

module.exports = notFoundMiddleware;