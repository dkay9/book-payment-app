function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
  }
  
  function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "admin") return next();
    res.status(403).send("Access Denied: Admins Only");
  }
  
  module.exports = { ensureAuth, ensureAdmin };