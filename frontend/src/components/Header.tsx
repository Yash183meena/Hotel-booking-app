import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {

  const {isLoggedIn}=useAppContext();

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">MernHolidays.com</Link>
        </span>
        <span className="flex space-x-2 items-center">
          {
            isLoggedIn?(
            <>
              <Link to="/my-bookings" className="flex item-center font-bold text-white px-3 hover:bg-blue-600 py-2">My Bookings</Link>
              <Link to="/my-hotels" className="flex item-center font-bold text-white px-3 hover:bg-blue-600 py-2">My Hotels</Link>
              <SignOutButton/>
            </>
            ):(
                <Link to="/sign-in" className="text-blue-600 bg-white px-3 font-bold hover:bg-gray-100 py-2">
                 Sign in
                </Link>
            )
          }
          
        </span>
      </div>
    </div>
  );
};

export default Header;
