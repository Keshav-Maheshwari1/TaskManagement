export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if the role of the user is included in the allowedRoles
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
export const mockUserMiddleware = (req, res, next) => {
  // Only apply this middleware to routes related to tasks
  if (req.originalUrl.includes("/tasks")) {
    const userRole = req.headers["x-user-role"];

    if (!userRole) {
      return res
        .status(400)
        .json({ msg: "Missing required headers: x-user-role." });
    }

    req.user = {
      role: userRole,
    };
  }

  next();
};
