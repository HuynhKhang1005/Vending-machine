import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, Logo } from "../assets";
import { isActiveStyles, isNotActiveStyles } from "../utils/styles";
import { motion } from "framer-motion";
import { buttonClcik, slideTop } from "../animations";
import { MdLogout, MdShoppingCart } from "../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { setUserNull } from "../context/actions/userActions";
import { setCartOn } from "../context/actions/displayCartAction";
import { FaArrowLeft } from "react-icons/fa";

const Header = () => {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);

  const [isMenu, setIsMenu] = useState(false);
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOut = () => {
    firebaseAuth
      .signOut()
      .then(() => {
        dispatch(setUserNull());
        navigate("/", { replace: true });
      })
      .catch((err) => console.log(err));
  };

  return (
    <header className="fixed backdrop-blur-md z-50 inset-x-0 top-0 flex items-center justify-between px-12 md:px-20 py-6">
      <NavLink to={"/"}
          className="flex items-center justify-center gap-2 cursor-pointer text-2xl text-textColor font-semibold rounded-md "
          >
            <FaArrowLeft className="text-xl text-textColor hover:shadow-md " /> 
            <img src={Logo} className="w-14" alt="" />
            <p className="font-semibold text-xl">Vending</p>
            </NavLink>
            <NavLink to={"/menu"} className="flex items-start justify-start gap-2">
      </NavLink>

      <nav className="flex items-center justify-center gap-8">
        <ul className="hidden md:flex items-center justify-center gap-16">
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/home"}
          >
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/menu"}
          >
            Sản phẩm
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/services"}
          >
            Dịch vụ
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/aboutus"}
          >
            Khác
          </NavLink>
        </ul>

        <motion.div
          {...buttonClcik}
          onClick={() => dispatch(setCartOn())}
          className="relative cursor-pointer"
        >
          <MdShoppingCart className="text-3xl text-textColor" />
          {cart?.length > 0 && (
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 -right-1">
              <p className="text-primary text-base font-semibold">
                {cart?.length}
              </p>
            </div>
          )}
        </motion.div>

        {user ? (
          <>
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setIsMenu(true)}
            >
              <div className="w-12 h-12 rounded-full shadow-md cursor-pointer overflow-hidden flex items-center justify-center">
                <motion.img
                  className="w-full h-full object-cover"
                  src={user?.picture ? user?.picture : Avatar}
                  whileHover={{ scale: 1.15 }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {isMenu && (
                <motion.div
                  {...slideTop}
                  onMouseLeave={() => setIsMenu(false)}
                  className="px-6 py-4 w-48 bg-lightOverlay backdrop-blur-md rounded-md shadow-md absolute top-12 right-0 flex flex-col gap-4"
                >
                  {user?.user_id === process.env.REACT_APP_ADMIN_ID && (
                    <Link
                      className=" hover:text-red-500 text-lg text-textColor"
                      to={"/dashboard/home"}
                    >
                      Dashboard
                    </Link>
                  )}

                  <Link
                    className=" hover:text-red-500 text-lg text-textColor"
                    to={"/profile"}
                  >
                    Thông tin của tôi
                  </Link>
                  <Link
                    className=" hover:text-red-500 text-lg text-textColor"
                    to={"/user-orders"}
                  >
                    Đơn hàng của tôi
                  </Link>
                  <hr />

                  <motion.div
                    {...buttonClcik}
                    onClick={signOut}
                    className="group flex items-center justify-center px-3 py-2 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3"
                  >
                    <MdLogout className="text-2xl text-textColor group-hover::text-headingColor" />
                    <p className="text-textColor text-lg group-hover:text-headingColor">
                      Đăng xuất
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <>
            
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
