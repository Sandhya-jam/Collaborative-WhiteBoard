import Background from "../components/common/Background"
import Navbar from "../components/landing/Navbar"
import Hero from "../components/landing/Hero"
import Preview from "../components/landing/Preview"
import Features from "../components/landing/Features"
import CTA from "../components/landing/CTA"
import Footer from "../components/landing/Footer"
const Landing = () => {
  return(
    <>
        <Background/>
        <Navbar/>
        <Hero/>
        <Preview/>
        <Features/>
        <CTA/>
        <Footer/>
    </>
  )
}

export default Landing