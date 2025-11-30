import { GiCoins } from "react-icons/gi";
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
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");
   const [status, setStatus] = useState(""); // ✅ new state
   const [collectorId, setCollectorId] = useState("");
   const [collectors, setCollectors] = useState([]);

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
         status, // ✅ include status
         collectorId,
      ] = queryKey;

      const today = new Date().toISOString().split("T")[0];

      const response = await axios.get(`${API_URL}/api/raw_collections`, {
         params: {
            page,
            lastname: query,
            sortColumn,
            sortDirection,
            filter,
            start_date: startDate || today,
            end_date: endDate || today,
            status, // ✅ backend filter
            collector_id: collectorId || "",
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
         status, // ✅ add status to queryKey
         collectorId,
      ],
      queryFn: fetchCollections,
      keepPreviousData: true,
   });

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

   useEffect(() => {
      axios.get(`${API_URL}/api/collectors`).then((res) => {
         setCollectors(res.data);
      });
   }, []);

   return (
      <AuthenticatedLayout>
         <Head title="Collections" />

         <div className="bg-white overflow-y-auto max-h-[590px]">
            <div className="mt-5 px-4">
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
               </div>

               {/* 🔎 Filters */}
               <div className="w-full flex items-center justify-center flex-col-reverse gap-6 lg:flex-row">
                  {/* Date filters */}
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
                  </div>
                  <div className="flex flex-col">
                     <label className="text-sm text-gray-600">Collector</label>
                     <select
                        value={collectorId}
                        onChange={(e) => setCollectorId(e.target.value)}
                     >
                        <option value="">All Collectors</option>
                        {collectors.map((collector) => (
                           <option key={collector.id} value={collector.id}>
                              {collector.firstname} {collector.lastname}
                           </option>
                        ))}
                     </select>
                  </div>

                  {/* ✅ Status filter */}
                  <div className="flex flex-col">
                     <label className="text-sm text-gray-600">Status</label>
                     <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg"
                     >
                        <option value="">All</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                     </select>
                  </div>

                  {/* Preview button */}
                  <div>
                     <a
                        href={route("collections.show", {
                           start_date:
                              startDate ||
                              new Date().toISOString().split("T")[0],
                           end_date:
                              endDate || new Date().toISOString().split("T")[0],
                           collector_id: collectorId || "", // ✅ use collectorId state
                           status,
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

               {/* Placeholder when no data */}
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
