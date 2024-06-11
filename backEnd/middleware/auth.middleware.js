import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(400)
        .json({ msg: "Invalid Authentication. Token is missing." });

    // Ambil token tanpa "Bearer "
    const tokenWithoutBearer = token.slice(7);
    jwt.verify(
      tokenWithoutBearer,
      process.env.CREATE_TOKEN_REFRESH,
      (err, user) => {
        if (err) {
          return res
            .status(400)
            .json({ msg: "Invalid Authentication. Token is invalid." });
        }

        req.user = user;
        next(); // Pastikan memanggil next() setelah verifikasi token selesai
      }
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error. Please try again later." });
  }
};

export default auth;
