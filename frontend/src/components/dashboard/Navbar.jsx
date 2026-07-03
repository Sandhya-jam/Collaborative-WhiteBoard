import Logo from "../common/Logo"
import { getUser } from "../../utils/auth"

const Navbar = () => {

  const user=getUser();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto h-20 px-6 flex justify-between items-center">
            <Logo/>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                    {user?.name?.charAt(0)}
                </div>
                <div>
                    <h3 className="font-semibold">
                        {user?.name}
                    </h3>
                    <p className="text-sm text-muted">
                        {user?.email}
                    </p>
                </div>
            </div>
        </div>
    </header>
  );
}

export default Navbar;