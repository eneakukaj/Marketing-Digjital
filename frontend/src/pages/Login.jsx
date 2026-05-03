import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
import { loginUser } from "../services/authService"; 

const Login = () => {
  const navigate = useNavigate(); 
  const { login } = useContext(AuthContext); 

    const [form, setForm] = useState({
        email:"",
        password:"",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(""); 
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");

    if (savedEmail) {
      setForm((prev) => ({
        ...prev,
        email: savedEmail,
      }));
      setRememberMe(true);
    }
  }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        const newErrors = {};

        if(!form.email){
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if(!form.password){
            newErrors.password="Password is required";
        }

        return newErrors;
    };

    const handleSubmit= async (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setServerError("");

        if (rememberMe) {
      localStorage.setItem("rememberedEmail", form.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
        try {
            const data = await loginUser(form.email, form.password);
            login(data.user, data.accessToken);
            navigate("/dashboard");
        } catch (err) {
            setServerError(err);
        }
    };

    return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        <h2 className="text-4xl font-extrabold text-white text-center mb-3">
          Welcome Back
        </h2>

        <p className="text-gray-400 text-center mb-8">
          Sign in to your AdVantage account.
        </p>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-center mb-6 text-sm">
          {serverError}
          </div>
       )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label className="text-gray-300 text-sm">Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold transition"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );

};

export default Login;