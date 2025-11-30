import { CgDanger } from "react-icons/cg";
import { AiOutlinePlus } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head, usePage, Deferred, Link } from "@inertiajs/react";
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
   Spinner,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/Components/Pagination";
import axios from "axios";
import UseAppUrl from "@/hooks/UseAppUrl";

const TABLE_HEAD = [
   "Acc No.",
   "Customer Name",
   "Sex",
   
   "Birthdate",
   "Address",
   "Status",
   "",
];
const Index = () => {
   const API_URL = UseAppUrl();
   const [municipalities, setMunicipalities] = useState([]);
   const [barangays, setBarangays] = useState([]);
   const [selectedMunicipality, setSelectedMunicipality] = useState("");
   const [selectedBarangay, setSelectedBarangay] = useState("");

   // Load municipalities on mount
   useEffect(() => {
      axios
         .get(`${API_URL}/api/municipalities`)
         .then((res) => setMunicipalities(res.data))
         .catch((err) => console.error("Error fetching municipalities:", err));
   }, []);

   // Load barangays when municipality changes
   useEffect(() => {
      if (selectedMunicipality) {
         axios
            .get(
               `${API_URL}/api/municipalities/${selectedMunicipality}/barangays`
            )
            .then((res) => setBarangays(res.data))
            .catch((err) => console.error("Error fetching barangays:", err));
      } else {
         setBarangays([]);
         setSelectedBarangay("");
      }
   }, [selectedMunicipality]);

   const fetchCustomers = async ({ queryKey }) => {
      const [
         _key,
         page,
         query,
         sortColumn,
         sortDirection,
         municipalityId,
         barangayId,
      ] = queryKey;

      const response = await axios.get(
         `${API_URL}/api/get_customerx_paginate`,
         {
            params: {
               page,
               lastname: query,
               sortColumn,
               sortDirection,
               municipality_id: municipalityId || "", // 👈 add filter
               barangay_id: barangayId || "", // 👈 add filter
            },
         }
      );
      return response.data;
   };

   const { customers } = usePage().props;
   const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(customers?.current_page || 1);
   const [sortConfig, setSortConfig] = useState({
      column: "",
      direction: "asc",
   });

   const { data, error, isLoading, refetch } = useQuery({
      queryKey: [
         "customers",
         currentPage,
         searchQuery,
         sortConfig.column,
         sortConfig.direction,
         selectedMunicipality, // 👈 include in key
         selectedBarangay, // 👈 include in key
      ],
      queryFn: fetchCustomers,
      keepPreviousData: true,
   });

   console.log(data);
   const toCamelCase = (str) => {
      return str
         .toLowerCase()
         .split(" ")
         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
         .join(" ");
   };

   const TABLE_ROWS =
      data?.data.map((customer) => ({
         id: customer.id,
         customer_name: `${customer.lastname} ${customer.firstname} ${
            customer.middlename ?? ""
         } `,
         firstname: customer.firstname,
         middlename: customer.middlename,
         lastname: customer.lastname,
         address:
            toCamelCase(
               customer.purok.barangay.municipality.municipality_name
            ) +
            ", " +
            toCamelCase(customer.purok.barangay.barangay_name) +
            ", " +
            toCamelCase(customer.purok.purok_name),

         contact_no: customer.contact_no,
         sex: customer.sex,
         marital_status: customer.marital_status,
         birthdate: customer.birthdate,
         occupation: customer.occupation,
         disconnection: customer.disconnection,
         status: customer.status,
      })) || [];

   const handleSearch = (e) => {
      const value = e.target.value;
      setSearchQuery(value); // Update search query
      if (!value) {
         setCurrentPage(1); // Reset to first page if query is empty
      }
   };

   const handlePagination = (page) => {
      setCurrentPage(page);
   };

   const deleteCustomer = async (customerId) => {
      const confirmDelete = window.confirm(
         "Are you sure you want to delete this customer?"
      );
      if (confirmDelete) {
         try {
            const response = await axios.delete(`/customers/${customerId}`);
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

         {/* //color bg-[#F6F6F6]  */}

         <div className="bg-white overflow-y-auto max-h-[590px]">
            <div className="mt-5  px-4">
               <div className="mb-6 flex justify-between items-center">
                  <div>
                     <Typography
                        variant="lead"
                        size="small"
                        className="mb-0 text-lg font-bold"
                     >
                        Customers
                     </Typography>
                     <Typography
                        className="text-sm"
                        variant="paragraph"
                        size="small"
                     >
                        Manage customers
                     </Typography>
                  </div>
                  {/* <div>
                            <Button
                                className="flex gap-2 items-center"
                                color="blue"
                                size="md"
                            >
                                <AiOutlinePlus className="text-lg" />
                                Add Customer
                            </Button>
                        </div> */}
               </div>

               <div className="flex gap-4 mb-5">
                  {/* Municipality Dropdown */}
                  <div>
                     <label className="block text-sm font-medium mb-1">
                        Municipality
                     </label>
                     <select
                        value={selectedMunicipality}
                        onChange={(e) => {
                           setSelectedMunicipality(e.target.value);
                           setCurrentPage(1); // reset to page 1
                        }}
                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                     >
                        <option value="">-- Select Municipality --</option>
                        {municipalities.map((mun) => (
                           <option key={mun.id} value={mun.id}>
                              {mun.municipality_name}
                           </option>
                        ))}
                     </select>
                  </div>

                  {/* Barangay Dropdown */}
                  <div>
                     <label className="block text-sm font-medium mb-1">
                        Barangay
                     </label>
                     <select
                        value={selectedBarangay}
                        onChange={(e) => {
                           setSelectedBarangay(e.target.value);
                           setCurrentPage(1); // reset to page 1
                        }}
                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-300"
                        disabled={!selectedMunicipality}
                     >
                        <option value="">-- Select Barangay --</option>
                        {barangays.map((brgy) => (
                           <option key={brgy.id} value={brgy.id}>
                              {brgy.barangay_name}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="w-full  flex items-center justify-between flex-col-reverse gap-2 lg:flex-row">
                  <div className="relative w-96">
                     <input
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        placeholder="Search lastname..."
                        value={searchQuery}
                        onChange={handleSearch}
                     />
                     <AiOutlineSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                  </div>

                  <div>
                     <Link href="/admin/customers/create">
                        <Button
                           className="flex gap-2 items-center"
                           color="blue"
                           size="md"
                        >
                           <AiOutlinePlus className="text-lg" />
                           Add Customer
                        </Button>
                     </Link>
                  </div>
               </div>
            </div>

            <div className="flex-1  p-4  w-full">
               <table className="w-full text-left  border border-gray-300 overflow-x-auto">
                  <thead>
    <tr className="bg-gray-100">
        {TABLE_HEAD.map((head, index) => {

            // map table headers to actual database columns
            const columnMap = {
                "Acc No.": "id",
                "Customer Name": "lastname",
                Sex: "sex",
                Birthdate: "birthdate",
                Address: "address",
                Status: "status",
            };

            const columnKey = columnMap[head] ?? "";

            return (
                <th
                    key={head}
                    className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400 cursor-pointer"
                    onClick={() =>
                        columnKey &&
                        setSortConfig({
                            column: columnKey,
                            direction:
                                sortConfig.column === columnKey &&
                                sortConfig.direction === "asc"
                                    ? "desc"
                                    : "asc",
                        })
                    }
                >
                    <div className="flex items-center gap-2">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className={`text-[12px] font-bold ${
                                sortConfig.column === columnKey
                                    ? "text-blue-600"
                                    : "opacity-70"
                            }`}
                        >
                            {head}
                        </Typography>

                        {columnKey && (
                            <span className="text-[10px]">
                                {sortConfig.column === columnKey ? (
                                    sortConfig.direction === "asc" ? (
                                        "▲"
                                    ) : (
                                        "▼"
                                    )
                                ) : (
                                    "⇅"
                                )}
                            </span>
                        )}
                    </div>
                </th>
            );
        })}
    </tr>
</thead>

                  <tbody>
                     {isLoading ? (
                        <tr>
                           <td
                              colSpan={TABLE_HEAD.length}
                              className="border border-blue-gray-100 p-4"
                           >
                              <div className="flex justify-center items-center h-full">
                                 <Spinner className="h-10 w-10" color="green" />
                              </div>
                           </td>
                        </tr>
                     ) : TABLE_ROWS.length === 0 ? (
                        <tr>
                           <td
                              colSpan={TABLE_HEAD.length}
                              className="border border-blue-gray-100 p-4 text-center text-red-500"
                           >
                              <div className="flex justify-center items-center gap-2">
                                 No customer records found
                                 <CgDanger className="text-xl" />
                              </div>
                           </td>
                        </tr>
                     ) : (
                        TABLE_ROWS.map(
                           ({
                              id,
                              customer_name,
                              sex,
                              marital_status,
                              birthdate,
                              address,
                              occupation,
                              contact_no,
                              status,
                           }) => (
                              <tr key={id} className="hover:bg-blue-gray-50 ">
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {id}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {customer_name}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {sex}
                                    </Typography>
                                 </td> 
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {birthdate}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {address ?? ""}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {status}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <div className="flex items-center gap-2 ">   
                                       <Menu>
                                          <MenuHandler>
                                             <IconButton variant="text">
                                                <Tooltip content="Actions">
                                                   <img
                                                      src="/img/dots.png"
                                                      alt=""
                                                   />
                                                </Tooltip>
                                             </IconButton>
                                          </MenuHandler>
                                          <MenuList>
                                             <Link
                                                className="hover:bg-blue-800 hover:rounded hover:text-white"
                                                href={route("customers.show", {
                                                   id,
                                                })}
                                             >
                                                <MenuItem>Payment History</MenuItem>
                                             </Link>
                                             <Link
                                                className="hover:bg-blue-800 hover:rounded hover:text-white"
                                                href={route("customers.show", {
                                                   id,
                                                })}
                                             >
                                                <MenuItem>View</MenuItem>
                                             </Link>

                                             <Link
                                                className="hover:bg-blue-800 hover:rounded hover:text-white"
                                                href={route("customers.edit", {
                                                   id,
                                                })}
                                             >
                                                <MenuItem>Edit</MenuItem>
                                             </Link>
                                             <MenuItem>
                                                <span
                                                   onClick={() =>
                                                      deleteCustomer(id)
                                                   }
                                                >
                                                   Delete
                                                </span>
                                             </MenuItem>
                                          </MenuList>
                                       </Menu>
                                    </div>
                                 </td>
                              </tr>
                           )
                        )
                     )}
                  </tbody>
               </table>

               <div className="grid grid-cols-4 items-center border-t border-blue-gray-50 p-4">
                  {/* Left side: span-1 */}
                  <div className="col-span-1">
                     <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                     >
                        Page {data?.current_page} of {data?.last_page}
                     </Typography>
                  </div>

                  {/* Center content: span-2 */}
                  <div className="col-span-2 flex flex-col items-center">
                     {/* Pagination numbers */}
                     <Pagination
                        currentPage={data?.current_page || 1}
                        lastPage={data?.last_page || 1}
                        onPageChange={handlePagination}
                     />

                     {/* Entry count text */}
                     <div className="mt-3 text-gray-700">
                        Showing {(currentPage - 1) * 10 + 1} to{" "}
                        {Math.min(currentPage * 10, data?.total)} of{" "}
                        {data?.total} entries
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Index;
