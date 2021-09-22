const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Password should have atleast 6 characters ").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { password, email } = req.body;

    // VALIDATED THE INPUT
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // VALIDATING USER DOESNT ALREADY EXIST
    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: "This user already exists",
          },
        ],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      email,
      password: hashedPassword,
    });

    const token = await JWT.sign(
      {
        email,
      },
      "sasfjgukuujuhf",
      {
        expiresIn: 36000000,
      }
    );
    res.json({ token });
  }
);

// Login route
router.post("/login", async (req, res) => {
  const { password, email } = req.body;
  let user = users.find((user) => {
    return user.email === email;
  });
  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid credntials",
        },
      ],
    });
  }
  // compare the imput password with the hashed password
  let isMatch = await bcrypt.compare(password, user.password); //returns true or false

  //  if passwords dont match return error

  if (!isMatch) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid credntials",
        },
      ],
    });
  }
  // Generate a token and send it back

  const token = await JWT.sign(
    {
      email,
    },
    "sasfjgukuujuhf",
    {
      expiresIn: 36000000,
    }
  );
  res.json({ token });
});

// Get all users
router.get("/all", (req, res) => {
  res.json(users);
});
module.exports = router;
