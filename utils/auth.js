import jwt from "jsonwebtoken";

const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },

    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};
const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    // Bearer xxx => xxx
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Token is not valid" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "Token is not suppiled" });
  }
};
const isSuperAdmin = async (req, res, next) => {
  if (req.user.role === 1) {
    next();
  } else {
    res.status(401).send({ message: "User is not superadmin" });
  }
};
const isAdmin = async (req, res, next) => {
  if (req.user.role === 2) {
    next();
  } else {
    res.status(401).send({ message: "User is not admin" });
  }
};
const isSurveyor = async (req, res, next) => {
  if (req.user.role === 3) {
    next();
  } else {
    res.status(401).send({ message: "User is not surveyor" });
  }
};

export { signToken, isAuth, isSuperAdmin, isAdmin, isSurveyor };
