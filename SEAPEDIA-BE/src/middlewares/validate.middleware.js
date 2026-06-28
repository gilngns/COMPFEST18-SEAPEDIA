const { ZodError } = require("zod");

function validate(schema) {
  return (req, res, next) => {
    try {
      const parsedBody = schema.parse(req.body);
      req.body = parsedBody; 
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        res.status(400).json({ error: "Validasi gagal", details: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}

module.exports = validate;
