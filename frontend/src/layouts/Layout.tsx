import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

interface Props{
  children:React.ReactNode;
}

const Layout = ({children}:Props) => {
  return (
    <div className="flex flex-col min-h-screen">
       <Header/>
       <Hero/>
       {/* flex-1 means flex-grow to fill any availabe space */}
       <div className="container mx-auto py-10 flex-1">
        {children}
       </div>
       <Footer/>
    </div>
  )
}

export default Layout;
