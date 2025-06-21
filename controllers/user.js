import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user?.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId: user?.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

const loginOrSignupUser = async (req, res) => {
  try {
    const { idToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, sub: google_id, picture, email_verified, name } = payload;

    if (!email_verified) {
      req.status(400).json({ error: "email not verified by google" });
    }

    let user = await User.findOne({ email });
    let newUser = false;

    if (!user) {
      newUser = true;
      user = new User({
        google_id,
        name,
        email,
        user_photo: picture,
        createAt: new Date(),
        updateAt: new Date(),
      });
      await user.save();
    }

    const { accessToken, refreshToken } = generateToken(user);

    res.status(200).json({
      user,
      accessToken,
      refreshToken,
      newUser,
    });
  } catch (error) {
    console.log("loginOrSignupUser", error);
    req.status(500).json({ error: "Failed to authenticate with google" });
  }
};

const getRefreshToken = async (req, res) => {
  try {
    const { refreshToken: ReqRefreshToken } = req.body;
    if (!ReqRefreshToken) {
      req.status(400).json({ error: "No refresh token provided" });
    }
    const decode = jwt.verify(
      ReqRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    let user = await User.findById(decode.userId);

    if (!user) {
      req.status(400).json({ error: "Invalid refresh token" });
    }
    const { accessToken, refreshToken } = generateToken(user);

    res.status(200).json({
      user,
      accessToken,
      refreshToken,
      newUser,
    });
  } catch (error) {
    console.log("loginOrSignupUser", error);
    req.status(500).json({ error: "Failed to authenticate refresh token" });
  }
};

export { loginOrSignupUser, getRefreshToken };
