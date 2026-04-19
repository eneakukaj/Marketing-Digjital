export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized - no user in request",
        });
      }

      const userRoles = Array.isArray(user.roles)
        ? user.roles
        : [user.roles];

      if (!userRoles || userRoles.length === 0) {
        return res.status(403).json({
          message: "Forbidden - no roles assigned",
        });
      }

       const hasAccess = userRoles
       .map((r) => r.toUpperCase())
        .some((role) => allowedRoles.includes(role));

      if (!hasAccess) {
        return res.status(403).json({
          message: "Forbidden - insufficient permissions",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Authorization error",
        error: error.message,
      });
    }
  };
};