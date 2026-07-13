import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import Logo from "../common/Logo";
import { getUser } from "../../utils/auth";

const Navbar = () => {
    const user = getUser();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/",{ replace: true });
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border bg-background/80">
            <div className="max-w-7xl mx-auto h-20 px-6 flex justify-between items-center">
                <Logo />
                <div
                    className="relative"
                    ref={menuRef}
                >
                    <button
                        onClick={() =>
                            setShowMenu((prev) => !prev)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-surface transition"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white flex items-center justify-center font-bold text-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                            <p className="font-semibold">
                                {user?.name}
                            </p>
                        </div>
                        <FiChevronDown
                            className={`transition-transform duration-300 ${
                                showMenu
                                    ? "rotate-180"
                                    : ""
                            }`}
                        />
                    </button>
                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -10,
                                    scale: 0.95,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -10,
                                    scale: 0.95,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                                className="absolute right-0 mt-3 w-64 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
                            >
                                <div className="px-5 py-4 border-b border-border">

                                    <div className="flex items-center gap-3">

                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white flex items-center justify-center font-bold text-xl">
                                            {user?.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                {user?.name}
                                            </p>

                                            <p className="text-sm text-muted break-all">
                                                {user?.email}
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-500/10 transition"
                                >
                                    <FiLogOut size={18} />
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Navbar;