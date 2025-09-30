const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
const userModel = require("../models/userModel");
dotenv.config();

// roles: array of allowed roles, e.g., ["admin", "organization"]
const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      let token;

      // 1️⃣ Get token from cookie or header
      if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
      }

      // 2️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3️⃣ Fetch user from DB
      const user = await userModel.findById(decoded.id);
      if (!user) return res.status(401).json({ error: "User not found" });

      // 4️⃣ Check role
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: "You do not have permission" });
      }

      // 5️⃣ Attach user to request
      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};

module.exports = authMiddleware;
