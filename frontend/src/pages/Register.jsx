import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.emri) newErrors.emri = "First name is required";
    if (!form.mbiemri) newErrors.mbiemri = "Last name is required";

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.phone_number) {
      newErrors.phone_number = "Phone number is required";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    console.log("Register data:", form);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        <h2 className="text-4xl font-extrabold text-white text-center mb-3">
          Create Account
        </h2>

        <p className="text-gray-400 text-center mb-8">
          Join AdVantage and start managing smarter campaigns.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2">First Name</label>
            <input
              type="text"
              name="emri"
              value={form.emri}
              onChange={handleChange}
              placeholder="e.g. John"
              className="w-full bg-white/10 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-indigo-500"
            />
            {errors.emri && (
              <p className="text-red-400 text-sm mt-1">{errors.emri}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Last Name</label>
            <input
              type="text"
              name="mbiemri"
              value={form.mbiemri}
              onChange={handleChange}
              placeholder="e.g. Doe"
              className="w-full bg-white/10 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-indigo-500"
            />
            {errors.mbiemri && (
              <p className="text-red-400 text-sm mt-1">{errors.mbiemri}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. john@gmail.com"
              className="w-full bg-white/10 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="e.g. +38344123456"
              className="w-full bg-white/10 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-indigo-500"
            />
            {errors.phone_number && (
              <p className="text-red-400 text-sm mt-1">
                {errors.phone_number}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••"
              className="w-full bg-white/10 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-indigo-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <span className="text-indigo-400 font-semibold cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;