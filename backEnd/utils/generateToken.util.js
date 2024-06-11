import jwt from "jsonwebtoken";

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.CREATE_TOKEN_ACTIVATION, {
    expiresIn: "5m",
  });
};

const createAccesToken = (payload) => {
  return jwt.sign(payload, process.env.CREATE_TOKEN_ACCESS, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.CREATE_TOKEN_REFRESH, {
    expiresIn: "3h",
  });
};


const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d"

  })
  res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, //ms
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development"
  })
}
export { createActivationToken,generateTokenAndSetCookie, createAccesToken, createRefreshToken };
