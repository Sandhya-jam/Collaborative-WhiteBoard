import {Link,useNavigate} from "react-router-dom"
import {motion} from "framer-motion"
import { useState } from "react"
import toast from "react-hot-toast"
import Background from '../components/common/Background'
import AuthCard from "../components/common/AuthCard"
import Logo from "../components/common/Logo"
import Input from "../components/common/Input"
import Button from "../components/common/Button"
import { saveUser } from "../utils/auth"
import { useLoginMutation } from "../features/auth/authApi"

const Login = () => {
  const navigate=useNavigate();
  const [login,{isLoading}]=useLoginMutation();
  const [formData,setFormData]=useState({email:"",password:""});

  const handleChange=(e)=>{
    setFormData(prev=>({
      ...prev,
      [e.target.name]:e.target.value
    }))
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      const data=await login(formData).unwrap();

      saveUser(data)
      toast.success("Welcome Back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.message||"Login Failed")
    }
  };

  return (
    <>
      <motion.div
      initial={{opacity:0,y:-20}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.5}}>
        <Background/>
      <div className="min-h-screen flex items-center justify-center px-6">
        <AuthCard>
          <div className="flex justify-center mb-8">
            <Logo/>
          </div>
          <h1 className="text-3xl font-bold text-center">
            Welcome Back!
          </h1>
          <p className="text-muted text-center mt-3 mb-8">
            Login to continue collaborating
          </p>
          <form 
          onSubmit={handleSubmit}
          className="space-y-6">
            <Input
            name="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            />
            <Input
            name="password"
            label="password"
            placeholder="Enter your password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            />
            <Button
            type="submit"
            disabled={isLoading}>
              {isLoading?"Logging In..":"Login"}
            </Button>
          </form>
          <p className="text-center mt-8 text-muted">
            Don't have an account?
            <Link
            to="/signup"
            className="ml-2 text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </AuthCard>
      </div>
      </motion.div>
    </>
  );
}

export default Login