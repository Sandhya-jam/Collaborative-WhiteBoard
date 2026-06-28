import { Link } from "react-router-dom";
import Logo from "../common/Logo";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Logo/>
            <div className="flex items-center gap-5">
                <Link to='/login' className="px-5 py-2 rounded-lg bg-primary hover:bg-purple-300 transition">
                Login
                </Link>
                <Link to='/signup' className="px-5 py-2 rounded-lg bg-primary hover:bg-purple-300 transition">
                Get Started
                </Link>
            </div>
        </div>
    </nav>
  )
}

export default Navbar