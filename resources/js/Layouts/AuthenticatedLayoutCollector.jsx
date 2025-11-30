import { CiLocationOn } from "react-icons/ci";
import { ImBlocked } from "react-icons/im";
import { RiBankCard2Fill } from "react-icons/ri";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaUserAltSlash } from "react-icons/fa";
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { RiBillLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { AiOutlineDown } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from "react";
import NavLink from "@/Components/NavLink";
import {
   Avatar,
   Card,
   IconButton,
   Tooltip,
   Typography,
   Drawer,
   Button,
   Select,
   Option,
   Menu,
   MenuHandler,
   MenuList,
   MenuItem,
} from "@material-tailwind/react";
import { Deferred, Link, usePage } from "@inertiajs/react";

export default function AuthenticatedLayoutCollector({ children }) {
   const user = usePage().props.auth.user;

   const [isCollapsed, setIsCollapsed] = useState(false);
   const [open, setOpen] = React.useState(false);

   const openDrawer = () => setOpen(true);
   const closeDrawer = () => setOpen(false);

   // Toggle sidebar collapse/expand
   const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
   };

   return (
      <div className="flex h-screen gap-0">
         <aside
            className={`flex flex-col ${
               isCollapsed ? "w-16" : "w-[260px]"
            } overflow-y-auto h-screen px-5 pt-2 pb-8  bg-white border-r border-r-gray-300 `}
         >
            <div
               className={`flex items-center ${
                  isCollapsed ? "justify-start" : "justify-between"
               }`}
            >
               {!isCollapsed && (
                  <a href="#">
                     <img
                        className="w-auto h-14"
                        src="/img/internet.png"
                        alt="logo"
                     />
                  </a>
               )}

               <div
                  className={`${isCollapsed ? "pt-2" : "p-3"} cursor-pointer`}
                  onClick={toggleSidebar}
               >
                  <span
                     className={`text-2xl ${
                        isCollapsed ? "text-gray-500" : "text-black"
                     }`}
                  >
                     {isCollapsed ? <GiHamburgerMenu /> : <RxHamburgerMenu />}
                  </span>
               </div>
            </div>

            <div className="flex flex-col justify-between flex-1 mt-6">
               <nav className="-mx-3 space-y-3 ">
                  <NavLink
                     href={route("collector.dashboard")}
                     active={route().current("collector.dashboard")}
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                        />
                     </svg>
                     {!isCollapsed && (
                        <span className="mx-2 text-sm font-medium">
                           Dashboard
                        </span>
                     )}
                  </NavLink>

                  {!isCollapsed && (
                     <div className=" px-3 py-0 my-0 text-gray-600 text-[12.5px]">
                        Transaction
                     </div>
                  )}

                  <NavLink
                     href={route("collector.collection")}
                     active={["collector.collection"].includes(
                        route().current()
                     )}
                  >
                     <RiBankCard2Fill />
                     {!isCollapsed && (
                        <span className="mx-2 text-sm font-medium">
                           Collection List
                        </span>
                     )}
                  </NavLink>
               </nav>
            </div>
         </aside>

         <div className="flex-1">
            <div className="bg-white py-4 px-8 border-b border-blue-gray-300  text-xl flex justify-between items-center mb-3 mt-1">
               <Typography variant="lead">
                  Internet Network Solutions
               </Typography>

               <div className="flex items-center gap-4 flex-col lg:flex-row">
                  <div className="flex items-center ">
                     <Menu>
                        <MenuHandler>
                           <Avatar
                              size="sm"
                              variant="circular"
                              alt="tania andrew"
                              className="cursor-pointer h-8 w-8"
                              src="/img/profile-user.png"
                           />
                        </MenuHandler>
                        <MenuList>
                           <Link href={route("profile.edit")}>
                              <MenuItem className="flex items-center gap-2">
                                 <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       fill-rule="evenodd"
                                       clip-rule="evenodd"
                                       d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM10 5C10 5.53043 9.78929 6.03914 9.41421 6.41421C9.03914 6.78929 8.53043 7 8 7C7.46957 7 6.96086 6.78929 6.58579 6.41421C6.21071 6.03914 6 5.53043 6 5C6 4.46957 6.21071 3.96086 6.58579 3.58579C6.96086 3.21071 7.46957 3 8 3C8.53043 3 9.03914 3.21071 9.41421 3.58579C9.78929 3.96086 10 4.46957 10 5ZM8 9C7.0426 8.99981 6.10528 9.27449 5.29942 9.7914C4.49356 10.3083 3.85304 11.0457 3.454 11.916C4.01668 12.5706 4.71427 13.0958 5.49894 13.4555C6.28362 13.8152 7.13681 14.0009 8 14C8.86319 14.0009 9.71638 13.8152 10.5011 13.4555C11.2857 13.0958 11.9833 12.5706 12.546 11.916C12.147 11.0457 11.5064 10.3083 10.7006 9.7914C9.89472 9.27449 8.9574 8.99981 8 9Z"
                                       fill="#90A4AE"
                                    />
                                 </svg>

                                 <Typography
                                    variant="small"
                                    className="font-medium"
                                 >
                                    Profile
                                 </Typography>
                              </MenuItem>
                           </Link>

                           <hr className="my-2 border-blue-gray-50" />
                           <Link
                              method="post"
                              href={route("logout")}
                              as="button"
                              className="w-full"
                           >
                              <MenuItem className="flex items-center gap-2">
                                 <svg
                                    width="16"
                                    height="14"
                                    viewBox="0 0 16 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       fill-rule="evenodd"
                                       clip-rule="evenodd"
                                       d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                                       fill="#90A4AE"
                                    />
                                 </svg>

                                 <Typography
                                    variant="small"
                                    className="font-medium"
                                 >
                                    Log Out
                                 </Typography>
                              </MenuItem>
                           </Link>
                        </MenuList>
                     </Menu>
                  </div>

                  <Typography
                     variant="paragraph"
                     size="small"
                     className="text-sm font-semibold text-gray-600 dark:text-white"
                  >
                     {user.email}
                  </Typography>
               </div>
            </div>

            <main>{children}</main>
         </div>
      </div>
   );
}
