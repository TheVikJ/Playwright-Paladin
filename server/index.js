require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Article = require("./models/article.model");

const PORT = 5000;

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const phoneNumber = process.env.PHONE_NUMBER;

const jwtAuthToken = process.env.JWT_AUTH_TOKEN;
const jwtRefreshToken = process.env.JWT_REFRESH_TOKEN;
const smsKey = process.env.SMS_SECRET_KEY;

const refreshTokens = [];

const client = require("twilio")(accountSid, authToken);

const prodEnv = process.env.NODE_ENV || "development";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:
      prodEnv === "development"
        ? "http://localhost:3000"
        : "https://playwrightpaladin.co",
    credentials: true,
  })
);

mongoose.connect(process.env.MONGO_URL).catch((err) => {
  console.error(err);
  process.exit(1);
});

app.post("/api/auth/sendOTP", (req, res) => {
  if (!req.body || !req.body.phone) {
    res.status(400).send({ message: "Invalid parameters provided" });
    return;
  }

  const phone = req.body.phone;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const ttl = 5 * 60 * 1000;
  const expires = Date.now() + ttl;
  const data = `${phone}.${otp}.${expires}`;
  const hash = crypto.createHmac("sha256", smsKey).update(data).digest("hex");
  const fullHash = `${hash}.${expires}`;

  client.messages
    .create({
      body: `Your One Time Password (OTP) for Playwright Paladin is ${otp}`,
      from: phoneNumber,
      to: phone,
    })
    .catch(console.error);

  res.status(200).send({ phone, hash: fullHash });
});

const authenticateUser = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(403).send({ message: "User not authenticated" });
  }

  jwt.verify(accessToken, jwtAuthToken, async (err, phone) => {
    if (phone) {
      req.phone = phone;
      next();
      return;
    } else if (err.message === "TokenExpiredError") {
      res.status(403).send({ message: "Token Expired" });
      return;
    }

    console.error(err);
    res.status(403).send({ error: err, message: "User not authenticated" });
  });
};

app.post("/api/auth/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(403).send({ message: "Refresh Token not Found" });
    return;
  }

  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).send({ message: "Refresh Token Blocked" });
    return;
  }

  jwt.verify(refreshToken, jwtRefreshToken, async (err, phone) => {
    if (!err) {
      const accessToken = jwt.sign({ data: phone }, jwtAuthToken, {
        expiresIn: "1d",
      });

      res
        .status(202)
        .cookie("accessToken", accessToken, {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          sameSite: "strict",
          httpOnly: "true",
        })
        .send({ previousSessionExpired: true, success: true });

      return;
    }

    res.status(403).send({ success: false, message: "Invalid Refresh Token" });
  });
});

app.post("/api/auth/verifyOTP", async (req, res) => {
  const phone = req.body.phone;
  const hash = req.body.hash;
  const otp = req.body.otp;
  const [hashValue, expires] = hash.split(".");

  if (Date.now() > parseInt(expires)) {
    res.status(504).send({ message: "OTP has timed out, please try again" });
    return;
  }

  const data = `${phone}.${otp}.${expires}`;
  const calculatedHash = crypto
    .createHmac("sha256", smsKey)
    .update(data)
    .digest("hex");
  if (calculatedHash !== hashValue) {
    res.status(400).send({ message: "Invalid OTP provided" });
    return;
  }

  const accessToken = jwt.sign({ data: phone }, jwtAuthToken, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign({ data: phone }, jwtRefreshToken, {
    expiresIn: "1y",
  });
  refreshTokens.push(refreshToken);

  try {
    const user = User.findOne({ phone });
    if (!user) {
      await User.create({ phone, posts: [] });
    }
  } catch {}

  res
    .status(202)
    .cookie("accessToken", accessToken, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: "strict",
      httpOnly: "true",
    })
    .cookie("refreshToken", refreshToken, {
      expires: new Date(31557600000), // 1 year
      sameSite: "strict",
      httpOnly: "true",
    })
    .send({ message: "Logged in successfully" });
});

app.post("/api/auth/logout", (req, res) => {
  res
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .send({ message: "User Logged Out" });
});

app.get("/api/auth/user", authenticateUser, async (req, res) => {
  const phone = req.phone;
  let user = User.findOne({ phone }).populate("posts").exec();
  console.log(user);
  if (!user) {
    user = await User.create({ phone, posts: [] });
  }

  return res.status(200).send(user);
});

app.post("/api/new", authenticateUser, async (req, res) => {
  if (!req.body.header || !req.body.content) {
    return res.send(400).send({ message: "Invalid Parameters" });
  }

  const phone = req.phone;
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
