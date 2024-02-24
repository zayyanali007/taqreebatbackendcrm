function validateFields(req, res, fields) {
  const errors = {};

  for (const field of fields) {
    if (req.body[field] === undefined || req.body[field] === null) {
      errors[field] = `${field} is required`;
    } else if (Array.isArray(req.body[field]) && req.body[field].length === 0) {
      errors[field] = `${field} should not be an empty list`;
    }
  }

  return errors;
}

export default function checkFieldsValidity(req, res, fields) {
  const errors = validateFields(req, res, fields);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
}
