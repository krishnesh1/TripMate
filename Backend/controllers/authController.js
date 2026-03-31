const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar,
    });

      try {
      await transporter.sendMail({
        from: `"TripMate" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to TripMate ",
        html: `
          <div style="font-family: Arial; padding:20px;">
            <h2 style="color:#10b981;">Welcome ${name} </h2>
            <p>Your account has been created successfully.</p>
            <p>We’re happy to have you onboard "TripMate"</p>
            <hr/>
            <p style="font-size:12px; color:gray;">
              © ${new Date().getFullYear()} TripMate
            </p>
          </div>
        `,
      });
    } catch (err) {
      console.log("Email failed:", err.message);
    }

    const token = user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      id: user._id,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.cookie("token", {
    httpOnly: true,
    secure: false,
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});




exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetOTP = hashedOTP;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  await transporter.sendMail({
    from: `"TripMate Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "TripMate Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background:#f9fafb;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 10px;">

          <h2 style="color:#10b981; text-align:center;">TripMate 🔐</h2>

          <p>Hello ${user.name || ""},</p>

          <p>You requested to reset your password.</p>

          <p>Your One-Time Password (OTP) is:</p>

          <div style="text-align:center; margin:20px 0;">
            <span style="
              font-size:28px;
              letter-spacing:4px;
              font-weight:bold;
              background:#ecfdf5;
              padding:12px 20px;
              border-radius:8px;
              display:inline-block;
              color:#065f46;
            ">
              ${otp}
            </span>
          </div>

          <p>This OTP is valid for <b>10 minutes</b>.</p>

          <p>If you did not request this, please ignore this email.</p>

          <hr />

          <p style="font-size:12px; color:gray; text-align:center;">
            © ${new Date().getFullYear()} TripMate
          </p>

        </div>
      </div>
    `,
  });


  res.json({ message: "OTP sent successfully" });
};

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  user.password = password;

  user.resetOTP = undefined;
  user.otpExpiry = undefined;

  await user.save();

  res.json({ message: "Password reset success" });
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  if (!user || user.resetOTP !== hashedOTP)
    return res.status(400).json({ message: "Invalid OTP" });

  res.json({ message: "OTP verified" });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};
