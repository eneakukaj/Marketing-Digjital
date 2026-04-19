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
        : user.roles
        ? [user.roles]
        : [];

      if (userRoles.length === 0) {
        return res.status(403).json({
          message: "Forbidden - no roles assigned",
        });
      }

      // normalize edhe allowedRoles
      const normalizedAllowed = allowedRoles.map((r) =>
        r.toUpperCase()
      );

      const hasAccess = userRoles
        .map((r) => r.toUpperCase())
        .some((role) => normalizedAllowed.includes(role));

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

export const authorizeSelfOrAdmin = (paramIdField = "id") => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized - no user",
        });
      }

     
      const userRoles = Array.isArray(user.roles)
        ? user.roles
        : user.roles
        ? [user.roles]
        : [];

      if (userRoles.map((r) => r.toUpperCase()).includes("ADMIN")) {
        return next();
      }

      
      const paramValue = req.params[paramIdField];
      const paramId = Number(paramValue);

      if (!paramValue || isNaN(paramId)) {
        return res.status(400).json({
          message: "Invalid ID parameter",
        });
      }

     
      if (user.id !== paramId) {
        return res.status(403).json({
          message: "Forbidden - not your resource",
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