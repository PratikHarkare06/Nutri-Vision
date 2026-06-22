const getImageUrl = (req, filename) => {
  if (!filename) return null;
  // If the filename is already a full URL, return it
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}/uploads/${filename}`;
};

module.exports = { getImageUrl };
