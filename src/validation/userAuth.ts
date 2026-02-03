import Joi from "joi";

export const RegisterSchema = Joi.object({
  name: Joi.string().min(4).max(25).required().messages({
    "string.min": "nama minimal 3 karakter",
    "string.max": "nama maksimal 20 karakter",
    "any.required": "nama wajib diisi",
    "string.empty": "nama tidak boleh kosong",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
    "string.empty": "Email tidak boleh kosong",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password minimal 8 karakter",
    "any.required": "Password wajib diisi",
    "string.empty": "Password tidak boleh kosong",
  }),
});

export const LoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
    "string.empty": "Email tidak boleh kosong",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password wajib diisi",
    "string.empty": "Password tidak boleh kosong",
  }),
});
