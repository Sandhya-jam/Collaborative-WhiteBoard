import { Link,useNavigate} from "react-router-dom"
import {motion} from "framer-motion"
import { useState } from "react"
import {toast} from "react-hot-toast"
import Background from "../components/common/Background"
import Logo from "../components/common/Logo"
import AuthCard from "../components/common/AuthCard"
import Input from "../components/common/Input"
import Button from "../components/common/Button"
import { saveUser } from "../utils/auth"
import {useSignupMutation} from "../features/auth/authApi"

const Signup = () => {
  const navigate=useNavigate();
  const [signup,{isLoading}]=useSignupMutation();
  const [formData,setFormData]=useState({name:"",email:"",password:""});

  const handleChange=(e)=>{
    setFormData(prev=>({
      ...prev,
      [e.target.name]:e.target.value
    }))
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      const data=await signup(formData).unwrap();

      saveUser(data)
      toast.success("Account Created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.message||"Signup Failed")
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
            Create Account 🚀
          </h1>
          <p className="text-muted text-center mt-3 mb-8">
            Start Collaborating with your team today
          </p>
          <form 
          onSubmit={handleSubmit}
          className="space-y-6">
            <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            label="Name"
            placeholder="Enter your Name"
            type="text"
            />
            <Input
            name="email"
            label="email"
            placeholder="Enter your email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            />
            <Input
            name="password"
            label="password"
            placeholder="Create a password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            />
            <Button type="submit"
            disabled={isLoading}>
              {isLoading?"Signing In..":"Create Account"}
            </Button>
          </form>
          <p className="text-center mt-8 text-muted">
            Already have an account?
            <Link
            to="/login"
            className="ml-2 text-primary hover:underline">
              Login
            </Link>
          </p>
      </AuthCard>
    </div>
    </motion.div>
    </>
  )
}

export default Signup