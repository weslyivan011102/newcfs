import { CgDanger } from "react-icons/cg";
import { AiOutlinePlus } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";

import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head, usePage, Link } from "@inertiajs/react";
import {
   IconButton,
   Tooltip,
   Typography,
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
   "Marital Status",
   "Address",
   "Contact No.",
   "Banned Date",
   "Status",
   "",
];

const sortableColumns = {
   id: "Acc No.",
   customer_name: "Customer Name",
   sex: "Sex",
   marital_status: "Marital Status",
   address: "Address",
   contact_no: "Contact No.",
   banned_date: "Banned Date",
   status: "Status",
};

const Index = () => {
   const API_URL = UseAppUrl();
   const [municipalities, setMunicipalities] = useState([]);
   const [barangays, setBarangays] = useState([]);
   const [selectedMunicipality, setSelectedMunicipality] = useState("");
   const [selectedBarangay, setSelectedBarangay] = useState("");

   const { customers } = usePage().props;

   const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(
      customers?.current_page || 1
   );

   const [sortConfig, setSortConfig] = useState({
      column: "",
      direction: "asc",
   });

   useEffect(() => {
      axios
         .get(`${API_URL}/api/municipalities`)
         .then((res) => setMunicipalities(res.data))
         .catch((err) => console.error("Error loading municipalities:", err));
   }, []);

   useEffect(() => {
      if (selectedMunicipality) {
         axios
            .get(
               `${API_URL}/api/municipalities/${selectedMunicipality}/barangays`
            )
            .then((res) => setBarangays(res.data))
            .catch((err) => console.error("Error loading barangays:", err));
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
         `${API_URL}/api/customer_banned`,
         {
            params: {
               page,
               lastname: query,
               sortColumn,
               sortDirection,
               municipality_id: municipalityId || "",
               barangay_id: barangayId || "",
            },
         }
      );

      return response.data;
   };

   const { data, isLoading, refetch } = useQuery({
      queryKey: [
         "customers",
         currentPage,
         searchQuery,
         sortConfig.column,
         sortConfig.direction,
         selectedMunicipality,
         selectedBarangay,
      ],
      queryFn: fetchCustomers,
      keepPreviousData: true,
   });

   const toCamelCase = (str) => {
      if (!str) return "";
      return str
         .toLowerCase()
         .split(" ")
         .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
         .join(" ");
   };

   const TABLE_ROWS =
      data?.data?.map((customer) => ({
         id: customer.id,
         customer_name: `${customer.lastname} ${customer.firstname} ${
            customer.middlename ?? ""
         }`,
         sex: customer.sex,
         marital_status: customer.marital_status ?? "",
         address:
            customer?.purok?.barangay?.municipality?.municipality_name
               ? `${toCamelCase(
                    customer.purok.barangay.municipality.municipality_name
                 )}, ${toCamelCase(
                    customer.purok.barangay.barangay_name
                 )}, ${toCamelCase(customer.purok.purok_name)}`
               : "—",
         contact_no: customer.contact_no,
         banned_date: customer.banned_date
            ? new Date(customer.banned_date).toLocaleDateString()
            : "—",
         status: customer.status,
      })) || [];

   const handleSearch = (e) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
   };

   const handlePagination = (page) => setCurrentPage(page);

   const deleteCustomer = async (customerId) => {
      if (!window.confirm("Delete this banned customer?")) return;

      try {
         const response = await axios.delete(`/customers/${customerId}`);
         alert(response.data.message);
         refetch();
      } catch (error) {
         alert("An unexpected error occurred.");
      }
   };

   return (
      <AuthenticatedLayout>
         <Head title="CFS INTERNET NETWORK SOLUTIONS" />

         <div className="bg-white overflow-y-auto max-h-[590px]">
            <div className="mt-5 px-4">
               <div className="mb-6 flex justify-between items-center">
                  <div>
                     <Typography className="mb-0 text-lg font-bold">
                        Customer Banned
                     </Typography>
                     <Typography className="text-sm">
                        Manage customer banned
                     </Typography>
                  </div>
               </div>

               {/* FILTERS */}
               <div className="flex gap-4 mb-5">
                  <div>
                     <label className="text-sm font-medium">Municipality</label>
                     <select
                        value={selectedMunicipality}
                        onChange={(e) => {
                           setSelectedMunicipality(e.target.value);
                           setCurrentPage(1);
                        }}
                        className="w-full border rounded-lg px-3 py-2"
                     >
                        <option value="">-- Select Municipality --</option>
                        {municipalities.map((mun) => (
                           <option key={mun.id} value={mun.id}>
                              {mun.municipality_name}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div>
                     <label className="text-sm font-medium">Barangay</label>
                     <select
                        value={selectedBarangay}
                        onChange={(e) => {
                           setSelectedBarangay(e.target.value);
                           setCurrentPage(1);
                        }}
                        className="w-full border rounded-lg px-3 py-2"
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

               <div className="relative w-96">
                  <input
                     className="w-full border rounded-md pl-3 pr-10 py-2"
                     placeholder="Search lastname..."
                     value={searchQuery}
                     onChange={handleSearch}
                  />
                  <AiOutlineSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
               </div>
            </div>

            {/* TABLE */}
            <div className="flex-1 p-4 overflow-x-auto">
               <table className="w-full text-left border border-gray-300">
                  <thead>
                     <tr className="bg-gray-100">
                        {Object.entries(sortableColumns).map(([key, label]) => (
                           <th
                              key={key}
                              onClick={() =>
                                 setSortConfig({
                                    column: key,
                                    direction:
                                       sortConfig.column === key && sortConfig.direction === "asc"
                                          ? "desc"
                                          : "asc",
                                 })
                              }
                              className=" px-6 py-3 text-xs  border-gray-300 text-gray-800 uppercase border
                               cursor-pointer  hover:bg-gray-200 select-none"
                           >
                              <div className="flex items-center gap-2">
                                 {label}

                                 {/* Sort Icon */}
                                 <span className="text-xs">
                                    {sortConfig.column === key ? (
                                       sortConfig.direction === "asc" ? "▲" : "▼"
                                    ) : (
                                       "↕"
                                    )}
                                 </span>
                              </div>
                           </th>
                        ))}

                        {/* ACTION COLUMN (Not sortable) */}
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           Action
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {isLoading ? (
                        <tr>
                           <td colSpan={TABLE_HEAD.length} className="p-4">
                              <div className="flex justify-center">
                                 <Spinner className="h-10 w-10" color="green" />
                              </div>
                           </td>
                        </tr>
                     ) : TABLE_ROWS.length === 0 ? (
                        <tr>
                           <td
                              colSpan={TABLE_HEAD.length}
                              className="p-4 text-center text-red-500"
                           >
                              No banned customer records found <CgDanger />
                           </td>
                        </tr>
                     ) : (
                        TABLE_ROWS.map(
                           ({
                              id,
                              customer_name,
                              sex,
                              marital_status,
                              address,
                              contact_no,
                              banned_date,
                              status,
                           }) => (
                              <tr key={id} className="hover:bg-blue-gray-50">
                                 <td className="border text-sm px-2">{id}</td>
                                 <td className="border text-sm px-2">{customer_name}</td>
                                 <td className="border text-sm px-2">{sex}</td>
                                 <td className="border text-sm px-2">
                                    {marital_status}
                                 </td>
                                 <td className="border text-sm px-2">{address}</td>
                                 <td className="border text-sm px-2">{contact_no}</td>
                                 <td className="border text-sm px-2">{banned_date}</td>
                                 <td className="border text-sm px-2">{status}</td>

                                 <td className="border text-sm px-2">
                                    <Menu>
                                       <MenuHandler>
                                          <IconButton variant="text">
                                             <Tooltip content="Actions">
                                                <img src="/img/dots.png" />
                                             </Tooltip>
                                          </IconButton>
                                       </MenuHandler>
                                       <MenuList>
                                          <Link
                                             href={route("banned.show", { id })}
                                          >
                                             <MenuItem>View</MenuItem>
                                          </Link>
                                          <Link
                                             href={route("banned.edit", { id })}
                                          >
                                             <MenuItem>Edit</MenuItem>
                                          </Link>
                                          <MenuItem
                                             onClick={() => deleteCustomer(id)}
                                          >
                                             Delete
                                          </MenuItem>
                                       </MenuList>
                                    </Menu>
                                 </td>
                              </tr>
                           )
                        )
                     )}
                  </tbody>
               </table>

               <div className="grid grid-cols-4 items-center border-t p-4">
                  <div>
                     Page {data?.current_page} of {data?.last_page}
                  </div>

                  <div className="col-span-2 flex flex-col items-center">
                     <Pagination
                        currentPage={data?.current_page || 1}
                        lastPage={data?.last_page || 1}
                        onPageChange={handlePagination}
                     />

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
