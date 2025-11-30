import { GiCoins } from "react-icons/gi";
import { AiOutlinePlus } from "react-icons/ai";
<<<<<<< HEAD
import { MdAccountCircle } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
=======
>>>>>>> c432348 (git)
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import UseAppUrl from "@/hooks/UseAppUrl";

const Index = () => {
   const API_URL = UseAppUrl();

   const [period, setPeriod] = useState("");        // 👈 daily | monthly | yearly
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");
<<<<<<< HEAD
   const [status, setStatus] = useState(""); // ✅ new state
   const [collectorId, setCollectorId] = useState("");
   const [collectors, setCollectors] = useState([]);
=======
>>>>>>> c432348 (git)

   const [status, setStatus] = useState("");
   const [collectorId, setCollectorId] = useState("");
   const [collectors, setCollectors] = useState([]);

   const today = new Date().toISOString().split("T")[0];

   // ---------------------------------------------------------
   // 🔵 AUTO-SET DATES WHEN period IS SELECTED
   // ---------------------------------------------------------
   useEffect(() => {
      if (period === "daily") {
         setStartDate(today);
         setEndDate(today);
      }

      if (period === "monthly") {
         const d = new Date();
         const first = new Date(d.getFullYear(), d.getMonth(), 1)
            .toISOString()
            .split("T")[0];
         const last = new Date(d.getFullYear(), d.getMonth() + 1, 0)
            .toISOString()
            .split("T")[0];

         setStartDate(first);
         setEndDate(last);
      }

      if (period === "yearly") {
         const d = new Date();
         const first = `${d.getFullYear()}-01-01`;
         const last = `${d.getFullYear()}-12-31`;

         setStartDate(first);
         setEndDate(last);
      }
   }, [period]);


   // ---------------------------------------------------------
   // 🔵 FETCH COLLECTIONS
   // ---------------------------------------------------------
   const fetchCollections = async ({ queryKey }) => {
      const [
         _key,
         page,
         period,
         startDate,
         endDate,
<<<<<<< HEAD
         status, // ✅ include status
=======
         status,
>>>>>>> c432348 (git)
         collectorId,
      ] = queryKey;

      const response = await axios.get(`${API_URL}/api/raw_collections`, {
         params: {
            page,
<<<<<<< HEAD
            lastname: query,
            sortColumn,
            sortDirection,
            filter,
            start_date: startDate || today,
            end_date: endDate || today,
            status, // ✅ backend filter
            collector_id: collectorId || "",
=======
            period,      // 👈 BACKEND PERIOD FILTER
            start_date: startDate,
            end_date: endDate,
            status,
            collector_id: collectorId,
>>>>>>> c432348 (git)
         },
      });

      return response.data;
   };

   const { data, isLoading } = useQuery({
      queryKey: [
         "collections",
         1,
         period,
         startDate,
         endDate,
<<<<<<< HEAD
         status, // ✅ add status to queryKey
=======
         status,
>>>>>>> c432348 (git)
         collectorId,
      ],
      queryFn: fetchCollections,
      keepPreviousData: true,
   });

   // ---------------------------------------------------------
   // 🔵 LOAD COLLECTORS
   // ---------------------------------------------------------
   useEffect(() => {
      axios.get(`${API_URL}/api/collectors`).then((res) => {
         setCollectors(res.data);
      });
   }, []);

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
               <Typography variant="lead" className="text-lg font-bold">
                  Collections
               </Typography>
               <Typography className="text-sm">
                  Manage collections
               </Typography>

               {/* ---------------------------------------------------------
                  FILTERS SECTION
               --------------------------------------------------------- */}
               {/* ---------------------------------------------------------
   FILTERS FORM (UX IMPROVED)
--------------------------------------------------------- */}
               <div className="w-full bg-gray-50 p-6 rounded-xl shadow-sm mt-6">

                  <h3 className="font-semibold text-gray-800 text-lg mb-4">
                     Filter Collections
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                     {/* PERIOD */}
                     <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Period</label>
                        <select
                           value={period}
                           onChange={(e) => setPeriod(e.target.value)}
                           className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        >
                           <option value="">Custom</option>
                           <option value="daily">Daily</option>
                           <option value="monthly">Monthly</option>
                           <option value="yearly">Yearly</option>
                        </select>
                     </div>

                     {/* START DATE */}
                     <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Start Date</label>
                        <input
                           type="date"
                           value={startDate}
                           onChange={(e) => setStartDate(e.target.value)}
                           className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                     </div>

                     {/* END DATE */}
                     <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">End Date</label>
                        <input
                           type="date"
                           value={endDate}
                           onChange={(e) => setEndDate(e.target.value)}
                           className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                     </div>

                     {/* COLLECTOR */}
                     <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Collector</label>
                        <select
                           value={collectorId}
                           onChange={(e) => setCollectorId(e.target.value)}
                           className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        >
                           <option value="">All Collectors</option>
                           {collectors.map((c) => (
                              <option key={c.id} value={c.id}>
                                 {c.firstname} {c.lastname}
                              </option>
                           ))}
                        </select>
                     </div>

                     {/* STATUS */}
                     <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">Status</label>
                        <select
                           value={status}
                           onChange={(e) => setStatus(e.target.value)}
                           className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        >
                           <option value="">All</option>
                           <option value="paid">Paid</option>
                           <option value="unpaid">Unpaid</option>
                        </select>
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

                  {/* BUTTONS */}
                  <div className="flex flex-wrap gap-4 mt-6">

                     {/* PREVIEW */}
                     <a
                        href={route("collections.show", {
<<<<<<< HEAD
                           start_date:
                              startDate ||
                              new Date().toISOString().split("T")[0],
                           end_date:
                              endDate || new Date().toISOString().split("T")[0],
                           collector_id: collectorId || "", // ✅ use collectorId state
=======
                           period,
                           start_date: startDate,
                           end_date: endDate,
                           collector_id: collectorId,
>>>>>>> c432348 (git)
                           status,
                        })}
                        target="_blank"
                     >
                        <Button color="blue" className="flex items-center gap-2 px-4 py-2">
                           <AiOutlinePlus />
                           Preview
                        </Button>
                     </a>

                     {/* MONTHLY */}
                     {/* <a
                        href={route("collections.monthly", {
                           period,
                           start_date: startDate,
                           end_date: endDate,
                           collector_id: collectorId,
                           status,
                        })}
                        target="_blank"
                     >
                        <Button color="green" className="flex items-center gap-2 px-4 py-2">
                           <AiOutlinePlus />
                           Monthly
                        </Button>
                     </a> */}

                  </div>
               </div>


               {/* ---------------------------------------------------------
                  NO DATA PLACEHOLDER
               --------------------------------------------------------- */}
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
