const validator = require("./../helpers/validate");

module.exports = function booking (req, res, next) {
  const validationRules = {
    "email": "required|email",
    // "phone": "required|digits:10",
    "name": "required|string",
  };
  validator(req.body, validationRules, {}, (err, status) => {
    if (!status){
      res.status(412)
        .send({
          success:false,
          message:"Validation failed",
          data:err
        });
    }  else {
      next();
    }
  });
};

