import { Link } from "react-router-dom"
import {motion} from "framer-motion"
import Background from "../components/common/Background"
import Logo from "../components/common/Logo"
import AuthCard from "../components/common/AuthCard"
import Input from "../components/common/Input"
import Button from "../components/common/Button"

const Signup = () => {
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
          <form className="space-y-6">
            <Input
            label="Name"
            placeholder="Enter your Name"
            type="text"
            />
            <Input
            label="email"
            placeholder="Enter your email"
            type="email"
            />
            <Input
            label="password"
            placeholder="Create a password"
            type="password"
            />
            <Button>
              Create Account
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