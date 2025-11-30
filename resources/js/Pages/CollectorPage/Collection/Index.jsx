import { AiFillEye } from "react-icons/ai";
import AuthenticatedLayoutCollector from "@/Layouts/AuthenticatedLayoutCollector";
import { Head, Link } from "@inertiajs/react";
import {
   Button,
   IconButton,
   Menu,
   MenuHandler,
   MenuItem,
   MenuList,
   Tooltip,
   Typography,
} from "@material-tailwind/react";
import React from "react";

const Index = () => {
   return (
      <AuthenticatedLayoutCollector
         header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
               Dashboard
            </h2>
         }
      >
         <Head title="Collection List" />
         <div className="h-[380px] overflow-y-auto px-6">
            <div>
               <div className="flex justify-end mb-3">
                  <Button>Add New</Button>
               </div>
               <table className="w-full min-w-[350px] text-left  border border-gray-300">
                  <thead>
                     <tr className="bg-gray-100">
                        <th className="px-6 py-2 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Payment Date
                           </Typography>
                        </th>
                        <th className="px-6 py-2 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Bill No
                           </Typography>
                        </th>
                        <th className="px-6 py-2 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Client
                           </Typography>
                        </th>
                        <th className="px-6 py-2 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Mbps
                           </Typography>
                        </th>
                        <th className="px-6 py-2 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Status
                           </Typography>
                        </th>
                        <th className="px-6 py-2 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Collected By
                           </Typography>
                        </th>
                        <th className="px-6 py-2 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Action
                           </Typography>
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className="hover:bg-blue-gray-50 ">
                        <td className="border border-blue-gray-100 px-4">
                           <Typography
                              variant="small"
                              className="font-normal text-gray-800"
                           >
                              1
                           </Typography>
                        </td>

                        <td className="border border-blue-gray-100 px-4">
                           <Typography
                              variant="small"
                              className="font-normal text-gray-800"
                           >
                              1
                           </Typography>
                        </td>

                        <td className="border border-blue-gray-100 px-4">
                           <Typography
                              variant="small"
                              className="font-normal text-gray-800"
                           >
                              1
                           </Typography>
                        </td>
                        <td className="border border-blue-gray-100 px-4">
                           <Typography
                              variant="small"
                              className="font-normal text-gray-800"
                           >
                              1
                           </Typography>
                        </td>
                        <td className="border border-blue-gray-100 px-4">
                           <Typography
                              variant="small"
                              className="font-normal text-gray-800"
                           >
                              1
                           </Typography>
                        </td>
                        <td className="border border-blue-gray-100 px-4">
                           <Typography
                              variant="small"
                              className="font-normal text-gray-800"
                           >
                              1
                           </Typography>
                        </td>
                        <td className="border border-blue-gray-100 px-4">
                           <IconButton variant="outlined">
                              <AiFillEye className="text-xl" color="blue" />
                           </IconButton>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </AuthenticatedLayoutCollector>
   );
};

export default Index;
