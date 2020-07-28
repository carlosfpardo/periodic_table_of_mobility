module.exports = function getId (urlPath) {
  // eslint-disable-next-line
  return urlPath.match(/([^\/]*)\/*$/)[0];
}
