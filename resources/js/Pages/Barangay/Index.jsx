import { CgDanger } from "react-icons/cg";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import {
   Avatar,
   Card,
   IconButton,
   Tooltip,
   Typography,
   Drawer,
   Button,
   Menu,
   MenuHandler,
   MenuList,
   MenuItem,
   Spinner,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/Components/Pagination";
import axios from "axios";
import UseAppUrl from "@/hooks/UseAppUrl";

const TABLE_HEAD = ["Barangays", "Actions"];

const Index = () => {
   const API_URL = UseAppUrl();

   const fetchBarangay = async ({ queryKey }) => {
      const [_key, page, query, sortColumn, sortDirection] = queryKey;
      const response = await axios.get(`${API_URL}/api/get_barangays`, {
         params: {
            page,
            barangay_name: query,
            sortColumn,
            sortDirection,
         },
      });
      return response.data;
   };

   const { barangays } = usePage().props;

   const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(barangays?.current_page || 1);
   const [sortConfig, setSortConfig] = useState({
      column: "",
      direction: "asc",
   });

   const { data, error, isLoading, refetch } = useQuery({
      queryKey: [
         "barangays",
         currentPage,
         searchQuery,
         sortConfig.column,
         sortConfig.direction,
      ],
      queryFn: fetchBarangay,
      keepPreviousData: true,
   });

   const toCamelCase = (str) => {
      return str
         .toLowerCase()
         .split(" ")
         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
         .join(" ");
   };

   const TABLE_ROWS =
      data?.data.map((barangay) => ({
         id: barangay.id,
         barangay_name: barangay.barangay_name,
         municipality_name: barangay.municipality.municipality_name,
         barangay_munipalities:
            toCamelCase(barangay.municipality.municipality_name) +
            ", " +
            toCamelCase(barangay.barangay_name),
      })) || [];

   const handleSearch = (e) => {
      const value = e.target.value;
      setSearchQuery(value);
      if (!value) {
         setCurrentPage(1);
      }
   };

   const handlePagination = (page) => {
      setCurrentPage(page);
   };

   const handleSort = (column) => {
      let direction = "asc";
      if (sortConfig.column === column && sortConfig.direction === "asc") {
         direction = "desc";
      }
      setSortConfig({ column, direction });
   };

   const deleteBarangay = async (barangayId) => {
      const confirmDelete = window.confirm(
         "Are you sure you want to delete this barangay?"
      );
      if (confirmDelete) {
         try {
            const response = await axios.delete(`/admin/barangays/${barangayId}`);
            alert(response.data.message);
            refetch();
         } catch (error) {
            console.error(error);
            alert("An unexpected error occurred. Please try again later.");
         }
      }
   };

   return (
      <AuthenticatedLayout>
         <Head title="CFS INTERNET NETWORK SOLUTIONS" />

         <div className="bg-white overflow-y-auto max-h-[590px]">
            <div className="mt-5 px-4">
               <div className="mb-6 flex justify-between items-center">
                  <div>
                     <Typography variant="lead" size="small" className="mb-0 text-lg font-bold">
                        Barangays
                     </Typography>
                     <Typography className="text-sm" variant="paragraph" size="small">
                        Manage barangays
                     </Typography>
                  </div>
               </div>

               <div className="w-full flex items-center justify-between flex-col-reverse gap-2 lg:flex-row">
                  <div className="relative w-96">
                     <input
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        placeholder="Search barangay name..."
                        value={searchQuery}
                        onChange={handleSearch}
                     />
                     <AiOutlineSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                  </div>

                  <div>
                     <Link href="/admin/barangays/create">
                        <Button className="flex gap-2 items-center" color="blue" size="md">
                           <AiOutlinePlus className="text-lg" />
                           Add Barangay
                        </Button>
                     </Link>
                  </div>
               </div>
            </div>

            <div className="flex-1 p-4 overflow-x-auto max-w-min md:max-w-full">
               <table className="w-full min-w-[350px] text-left border border-gray-300">
                  <thead>
                     <tr className="bg-gray-100">
                        {TABLE_HEAD.map((head) => (
                           <th
                              key={head}
                              className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400 cursor-pointer"
                              onClick={() =>
                                 handleSort(head === "Barangays" ? "barangay_name" : "")
                              }
                           >
                              <div className="flex items-center justify-between">
                                 <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="text-[12px] font-normal leading-none opacity-70"
                                 >
                                    {head}
                                 </Typography>
                                 {sortConfig.column === "barangay_name" && (
                                    <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                                 )}
                              </div>
                           </th>
                        ))}
                     </tr>
                  </thead>

                  <tbody>
                     {isLoading ? (
                        <tr>
                           <td colSpan={TABLE_HEAD.length} className="border border-blue-gray-100 p-4">
                              <div className="flex justify-center items-center h-full">
                                 <Spinner className="h-10 w-10" color="green" />
                              </div>
                           </td>
                        </tr>
                     ) : TABLE_ROWS.length === 0 ? (
                        <tr>
                           <td colSpan={TABLE_HEAD.length} className="border border-blue-gray-100 p-4 text-center text-red-500">
                              <div className="flex justify-center items-center gap-2">
                                 No barangays records found
                                 <CgDanger className="text-xl" />
                              </div>
                           </td>
                        </tr>
                     ) : (
                        TABLE_ROWS.map(({ id, barangay_munipalities }) => (
                           <tr key={id} className="hover:bg-blue-gray-50">
                              <td className="border border-blue-gray-100 px-4">
                                 <Typography variant="small" className="font-normal text-gray-800">
                                    {barangay_munipalities ?? ""}
                                 </Typography>
                              </td>

                              <td className="border border-blue-gray-100 px-4">
                                 <div className="flex items-center gap-2">
                                    <Menu>
                                       <MenuHandler>
                                          <IconButton variant="text">
                                             <Tooltip content="Actions">
                                                <img src="/img/dots.png" alt="" />
                                             </Tooltip>
                                          </IconButton>
                                       </MenuHandler>
                                       <MenuList>
                                          <Link
                                             className="hover:bg-blue-800 hover:rounded hover:text-white"
                                             href={route("barangays.edit", { id })}
                                          >
                                             <MenuItem>Edit</MenuItem>
                                          </Link>
                                          <MenuItem>
                                             <span onClick={() => deleteBarangay(id)}>Delete</span>
                                          </MenuItem>
                                       </MenuList>
                                    </Menu>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>

               <div className="grid grid-cols-4 items-center border-t border-blue-gray-50 p-4">
                  <div className="col-span-1">
                     <Typography variant="small" color="blue-gray" className="font-normal">
                        Page {data?.current_page} of {data?.last_page}
                     </Typography>
                  </div>

                  <div className="col-span-2 flex flex-col items-center">
                     <Pagination
                        currentPage={data?.current_page || 1}
                        lastPage={data?.last_page || 1}
                        onPageChange={handlePagination}
                     />
                     <div className="mt-3 text-gray-700">
                        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, data?.total)} of {data?.total} entries
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Index;
