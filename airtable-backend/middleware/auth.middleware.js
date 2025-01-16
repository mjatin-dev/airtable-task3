export const authenitication = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    req.token = header.split(" ")[1];
  }
  next();
};
