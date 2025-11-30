import { GiCoins } from "react-icons/gi";
import { CgDanger } from "react-icons/cg";
import { AiOutlinePlus } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from "react";
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
   "Bill No.",
   "Billing Date",
   "Customer Name",
   "Address",
   "OTB",
   "Payment Amount",
   "Assigned Collector",
];
const Index = () => {
   const API_URL = UseAppUrl();
   const [filter, setFilter] = useState("month");
   // ✅ new states for date range
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");

   const handleFilterChange = (e) => {
      setFilter(e.target.value);
   };

   const fetchCollections = async ({ queryKey }) => {
      const [
         _key,
         page,
         query,
         sortColumn,
         sortDirection,
         filter,
         startDate,
         endDate,
      ] = queryKey;

      // ✅ If no startDate or endDate, use today's date
      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

      const response = await axios.get(`${API_URL}/api/raw_collections`, {
         params: {
            page,
            lastname: query,
            sortColumn,
            sortDirection,
            filter,
            start_date: startDate || today,
            end_date: endDate || today,
         },
      });

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
         "collections",
         currentPage,
         searchQuery,
         sortConfig.column,
         sortConfig.direction,
         filter,
         startDate,
         endDate,
      ],
      queryFn: fetchCollections,
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
      data?.data.map((collection) => ({
         id: collection.id,
         customer_name: `${collection.customer_plan.customer.lastname} ${
            collection.customer_plan.customer.firstname
         } ${collection.customer_plan.customer.middlename ?? ""} `,
         collector_name: `${collection.customer_plan.collector.lastname} ${
            collection.customer_plan.collector.firstname
         } ${collection.customer_plan.collector.middlename ?? ""} `,
         address: `${
            collection.customer_plan.customer.purok?.purok_name ?? ""
         }, ${
            collection.customer_plan.customer.purok?.barangay?.barangay_name ??
            ""
         }, ${
            collection.customer_plan.customer.purok?.barangay?.municipality
               ?.municipality_name ?? ""
         }`,
         bill_no: collection.bill_no,
         date_billing: new Date(collection.date_billing).toLocaleDateString(
            "en-PH"
         ),
         outstanding_balance: collection.outstanding_balance,
         bill_amount: collection.bill_amount,
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
         <Head title="Collections" />

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
                        Collections
                     </Typography>
                     <Typography
                        className="text-sm"
                        variant="paragraph"
                        size="small"
                     >
                        Manage collections
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

               <div className="w-full  flex items-center justify-center flex-col-reverse gap-6 lg:flex-row">
                  <div className="flex gap-4">
                     {/* <div className="relative w-96">
                        <div>
                           <input
                              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                              placeholder="Search lastname..."
                              value={searchQuery}
                              onChange={handleSearch}
                           />
                           <AiOutlineSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                        </div>
                     </div> */}
                     {/* <div>
                        <div className="flex gap-4 items-center">
                           <label className="mr-2 font-medium">Filter:</label>
                           <select
                              value={filter}
                              onChange={handleFilterChange}
                              className="
                                 px-6 py-1
                                 border border-gray-300
                                 rounded-lg
                                 bg-white
                                 text-gray-700
                                 shadow-sm
                                 focus:outline-none
                                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                 transition ease-in-out duration-150
                              "
                           >
                              <option value="day">Day</option>
                              <option value="week">Week</option>
                              <option value="month">Month</option>
                           </select>
                        </div>
                     </div> */}
                  </div>

                  <div className="flex gap-4 items-center">
                     <div className="flex flex-col">
                        <label className="text-sm text-gray-600">
                           Start Date
                        </label>
                        <input
                           type="date"
                           value={startDate}
                           onChange={(e) => setStartDate(e.target.value)}
                           className="px-3 py-1 border border-gray-300 rounded-lg"
                        />
                     </div>
                     <div className="flex flex-col">
                        <label className="text-sm text-gray-600">
                           End Date
                        </label>
                        <input
                           type="date"
                           value={endDate}
                           onChange={(e) => setEndDate(e.target.value)}
                           className="px-3 py-1 border border-gray-300 rounded-lg"
                        />
                     </div>
                     {/* <Button color="green" size="sm" onClick={() => refetch()}>
                        Apply
                     </Button> */}
                  </div>

                  <div>
                     <a
                        href={route("collections.show", {
                           start_date:
                              startDate ||
                              new Date().toISOString().split("T")[0],
                           end_date:
                              endDate || new Date().toISOString().split("T")[0],
                        })}
                        target="_blank"
                     >
                        <Button
                           className="flex gap-2 items-center"
                           color="blue"
                           size="md"
                        >
                           <AiOutlinePlus className="text-lg" />
                           Preview
                        </Button>
                     </a>
                  </div>
               </div>
               <div className="flex justify-center flex-col items-center mt-12">
                  <GiCoins className="text-9xl" />
                  Filter to show collection
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Index;
