const JWT = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({
      errors: [
        {
          msg: "no token found",
        },
      ],
    });
  }
  try {
    let user = await JWT.verify(token, "sasfjgukuujuhf");
    req.user = user.email;
    console.log(user, req.user);
    next();
  } catch (error) {
    return res.status(400).json({
      errors: [
        {
          msg: "invalid token",
        },
      ],
    });
  }
};
