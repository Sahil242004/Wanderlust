module.exports = (fn) => {
  return function (req, res, next) {
    console.log("error encountered by wrapAync");
    fn(req, res, next).catch(next);
  };
};
