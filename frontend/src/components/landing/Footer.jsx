import Logo from "../common/Logo";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Logo/>
            <p className="text-muted">
                © 2026 WhiteFlow. Built with React, Node, MongoDB & Socket.IO.
            </p>
        </div>
    </footer>
  )
}

export default Footer