import { CgDanger } from "react-icons/cg";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head, usePage, Link } from "@inertiajs/react";
import {
   Card,
   IconButton,
   Tooltip,
   Typography,
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

const TABLE_HEAD = [
   "Acc No.",
   "Customer Name",
   "Sex",
   "Address",
   "contact no",
   "disconnection date",
   "Status",
   "",
];

// 🔥 SORTING MAP — matches UI label → database/key
const sortableColumns = {
   "Acc No.": "id",
   "Customer Name": "customer_name",
   Sex: "sex",
   Address: "address",
   contact_no: "contact_no",
   disconnection: "disconnection",
   Status: "status",
};

const Index = () => {
   const API_URL = UseAppUrl();
   const [municipalities, setMunicipalities] = useState([]);
   const [barangays, setBarangays] = useState([]);
   const [selectedMunicipality, setSelectedMunicipality] = useState("");
   const [selectedBarangay, setSelectedBarangay] = useState("");

   const { customers } = usePage().props;

   const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(customers?.current_page || 1);

   // 🔥 Sort Configuration
   const [sortConfig, setSortConfig] = useState({
      column: "",
      direction: "asc",
   });

   // Load municipalities
   useEffect(() => {
      axios
         .get(`${API_URL}/api/municipalities`)
         .then((res) => setMunicipalities(res.data))
         .catch((err) => console.error("Error fetching municipalities:", err));
   }, []);

   // Load barangays after selecting municipality
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

   // API Fetching function
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
         `${API_URL}/api/customer_disconnection`,
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

   const { data, error, isLoading, refetch } = useQuery({
      queryKey: [
         "students",
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
         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
         .join(" ");
   };

   const TABLE_ROWS =
      data?.data.map((customer) => ({
         id: customer.id,
         customer_name: `${customer.lastname} ${customer.firstname} ${
            customer.middlename ?? ""
         }`,
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
         disconnection: customer.disconnection,
         status: customer.status,
      })) || [];

   const handleSearch = (e) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
   };

   const handlePagination = (page) => setCurrentPage(page);

   const deleteCustomer = async (customerId) => {
      if (!window.confirm("Are you sure you want to delete this customer?"))
         return;

      try {
         const response = await axios.delete(`/customers/${customerId}`);
         alert(response.data.message);
         refetch();
      } catch (error) {
         console.error(error);
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
                     <Typography variant="lead" className="text-lg font-bold">
                        Disconnection
                     </Typography>
                     <Typography className="text-sm">
                        Manage Disconnection
                     </Typography>
                  </div>
                  <Link href="/disconnections/create">
                     <Button
                        className="flex gap-2 items-center"
                        color="blue"
                        size="md"
                     >
                        <AiOutlinePlus />
                        Add Disconnection
                     </Button>
                  </Link>
               </div>

               {/* FILTERS */}
               <div className="flex gap-4 mb-5">
                  {/* Municipality */}
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

                  {/* Barangay */}
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

               {/* SEARCH BAR */}
               <div className="w-full mb-5">
                  <div className="relative w-96">
                     <input
                        className="w-full border rounded-md pl-3 pr-10 py-2
                        text-sm shadow-sm"
                        placeholder="Search lastname..."
                        value={searchQuery}
                        onChange={handleSearch}
                     />
                     <AiOutlineSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                  </div>
               </div>
            </div>

            {/* TABLE */}
            <div className="flex-1 p-4 overflow-x-auto">
               <table className="w-full text-left border border-gray-300">
                  <thead>
                     <tr className="bg-gray-100">
                        {TABLE_HEAD.map((head) => {
                           const isSortable = sortableColumns[head];
                           const isActive = sortConfig.column === sortableColumns[head];

                           return (
                              <th
                                 key={head}
                                 className={`
                                    px-6 py-3 text-xs  border-gray-300 text-gray-800 uppercase
                                    ${isSortable ? "cursor-pointer hover:bg-gray-200" : ""}
                                 `}
                                 onClick={() => {
                                    if (!isSortable) return;

                                    setSortConfig((prev) => ({
                                       column: sortableColumns[head],
                                       direction:
                                          prev.column === sortableColumns[head] &&
                                          prev.direction === "asc"
                                             ? "desc"
                                             : "asc",
                                    }));

                                    setCurrentPage(1);
                                 }}
                              >
                                 <div className="flex items-center gap-2">
                                    <span>{head}</span>

                                    {isSortable && (
                                       <span className="text-xs">
                                          {isActive
                                             ? sortConfig.direction === "asc"
                                                ? "▲"
                                                : "▼"
                                             : "↕"}
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
                           <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                              <Spinner className="h-10 w-10" color="green" />
                           </td>
                        </tr>
                     ) : TABLE_ROWS.length === 0 ? (
                        <tr>
                           <td colSpan={TABLE_HEAD.length} className="p-4 text-center text-red-500">
                              <div className="flex justify-center items-center gap-2">
                                 No customer disconnection records found
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
                              address,
                              contact_no,
                              disconnection,
                              status,
                           }) => (
                              <tr key={id} className="hover:bg-blue-gray-50">
                                 <td className="border text-sm px-2 py-2">{id}</td>
                                 <td className="border text-sm px-2 py-2">{customer_name}</td>
                                 <td className="border text-sm px-2 py-2">{sex}</td>
                                 <td className="border text-sm px-2 py-2">{address}</td>
                                 <td className="border text-sm px-2 py-2">{contact_no}</td>
                                 <td className="border text-sm px-2 py-2">{disconnection}</td>
                                 <td className="border text-sm px-2 py-2">{status}</td>

                                 {/* ACTIONS */}
                                 <td className="border px-4">
                                    <Menu>
                                       <MenuHandler>
                                          <IconButton variant="text">
                                             <Tooltip content="Actions">
                                                <img src="/img/dots.png" alt="actions" />
                                             </Tooltip>
                                          </IconButton>
                                       </MenuHandler>
                                       <MenuList>
                                          <Link href={route("disconnections.show", { id })}>
                                             <MenuItem>View</MenuItem>
                                          </Link>

                                          <Link href={route("disconnections.edit", { id })}>
                                             <MenuItem>Edit</MenuItem>
                                          </Link>

                                          <MenuItem onClick={() => deleteCustomer(id)}>
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

               {/* PAGINATION */}
               <div className="grid grid-cols-4 items-center border-t p-4">
                  <div className="col-span-1">
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
                        {Math.min(currentPage * 10, data?.total)} of {data?.total} entries
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Index;
