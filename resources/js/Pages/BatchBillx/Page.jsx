import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
   Select,
   Option,
   Button,
   Typography,
   Input,
} from "@material-tailwind/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useReactToPrint } from "react-to-print";
import UseAppUrl from "@/hooks/UseAppUrl";

const Page = () => {
   const API_URL = UseAppUrl();

   // Table sorting state
   const [sortField, setSortField] = useState(null);
   const [sortOrder, setSortOrder] = useState("asc");

   // Filters and transactions
   const [filterBatch, setFilterBatch] = useState("");
   const [month, setMonth] = useState(new Date().getMonth() + 1);
   const [year, setYear] = useState(new Date().getFullYear());
   const [transactions, setTransactions] = useState([]);
   const [loading, setLoading] = useState(false);

   // Batch generation
   const [postBatch, setPostBatch] = useState("");
   const [postResult, setPostResult] = useState(null);
   const [isPostLoading, setIsPostLoading] = useState(false);

   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   // --- Sorting Function ---
   const handleSort = (field) => {
      const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
      setSortField(field);
      setSortOrder(order);

      const sorted = [...transactions].sort((a, b) => {
         const getValue = (obj) => {
            switch (field) {
               case "bill_no":
                  return obj.bill_no ?? 0;
               case "customer_no":
                  return obj.customer_plan.customer?.id ?? 0;
               case "customer_name":
                  return `${obj.customer_plan.customer?.firstname ?? ""} ${
                     obj.customer_plan.customer?.lastname ?? ""
                  }`.toLowerCase();
               case "address":
                  return `${obj.customer_plan.customer?.purok?.barangay?.barangay_name ?? ""} ${
                     obj.customer_plan.customer?.purok?.barangay?.municipality?.municipality_name ?? ""
                  }`.toLowerCase();
               case "mbps":
                  return obj.customer_plan.plan?.mbps ?? 0;
               case "plan_price":
                  return obj.customer_plan.plan?.plan_price ?? 0;
               case "previous_balance":
                  return obj.balance ?? 0;
               case "total_due":
                  return obj.outstanding_balance ?? 0;
               case "remarks":
                  return (obj.remarks || "").toLowerCase();
               default:
                  return "";
            }
         };

         let valA = getValue(a);
         let valB = getValue(b);

         if (valA < valB) return order === "asc" ? -1 : 1;
         if (valA > valB) return order === "asc" ? 1 : -1;
         return 0;
      });

      setTransactions(sorted);
   };

   const sortIcon = (field) => {
      if (sortField !== field) return "↕";
      return sortOrder === "asc" ? "↑" : "↓";
   };

   // --- Fetch unpaid transactions ---
   const fetchUnpaid = async () => {
      if (!filterBatch || !month || !year)
         return alert("Please select all filters!");

      try {
         setLoading(true);
         const res = await axios.get(
            `${API_URL}/api/batch-unpaid/${filterBatch}?month=${month}&year=${year}`
         );
         setTransactions(res.data.transactions || []);
      } catch (error) {
         console.error("Error fetching unpaid transactions:", error);
      } finally {
         setLoading(false);
      }
   };

   // --- Generate batch billing ---
   const generateBatch = async () => {
      if (!postBatch) return alert("Please select a batch!");

      try {
         setIsPostLoading(true);
         setPostResult(null);

         const res = await axios.post(
            `${API_URL}/api/batch-billing/generate/${postBatch}`
         );

         setTimeout(() => {
            setPostResult(res.data);
            setIsPostLoading(false);
         }, 5000);
      } catch (error) {
         console.error("Error generating batch:", error);
         setIsPostLoading(false);
      }
   };

   useEffect(() => {
      if (postResult) {
         const timer = setTimeout(() => {
            setPostResult(null);
            window.location.reload();
         }, 3000);
         return () => clearTimeout(timer);
      }
   }, [postResult]);

   return (
      <AuthenticatedLayout>
         <Head title="CFS INTERNET NETWORK SOLUTIONS" />

         <div className="flex justify-end items-center mb-2">
            <Button color="green" onClick={reactToPrintFn}>
               Print
            </Button>
         </div>

         <div className="flex flex-col items-center">
            <h1 className="text-4xl mt-1 mb-5">Batch Billing Generation</h1>

            {/* Batch Generation */}
            <div className="max-w-[800px] mb-4">
               <h3>
                  Generate Batch Billing for the month{" "}
                  {new Date().toLocaleDateString("en-US", {
                     month: "long",
                     year: "numeric",
                  })}
               </h3>
               <div className="flex gap-4 mt-4">
                  <Select label="Select Due" onChange={(val) => setPostBatch(val)}>
                     <Option value="1">Due1</Option>
                     <Option value="2">Due5</Option>
                     <Option value="3">Due10</Option>
                     <Option value="4">Due15</Option>
                     <Option value="5">Due25</Option>
                     <Option value="6">Due28-AllCheque</Option>
                  </Select>
                  <Button onClick={generateBatch} disabled={isPostLoading}>
                     {isPostLoading ? "Generating..." : "Generate"}
                  </Button>
               </div>
            </div>

            {postResult && (
               <div className="mt-6 p-4 bg-green-200 rounded-md w-full text-center text-green-800">
                  <Typography variant="h6">
                     Batch bill generated successfully.
                  </Typography>
               </div>
            )}

            {/* Filters */}
            <div className="max-w-[920px] w-full border-t border-gray-300 mt-2 flex gap-4 p-2">
               <Select label="Select Due" onChange={(val) => setFilterBatch(val)}>
                  <Option value="1">Due1</Option>
                  <Option value="2">Due5</Option>
                  <Option value="3">Due10</Option>
                  <Option value="4">Due15</Option>
                  <Option value="5">Due25</Option>
                  <Option value="6">Due28-AllCheque</Option>
               </Select>

               <Input
                  type="number"
                  label="Month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  min={1}
                  max={12}
               />
               <Input
                  type="number"
                  label="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min={2000}
                  max={2100}
               />
               <Button onClick={fetchUnpaid} disabled={loading}>
                  {loading ? "Fetching..." : "Filter"}
               </Button>
            </div>
         </div>

         {/* Table */}
         <div className="px-1 mt-2 h-[350px] overflow-auto">
            <div ref={contentRef} className="print:px-2">
               <div className="flex flex-col items-center mb-4 mt-4">
                  <h3 className="text-sm">
                     Batch {filterBatch ?? ""} ({month ?? ""}/{year ?? ""})
                  </h3>
               </div>

               <table className="w-full text-left border border-gray-300 text-xs text-gray-800">
                  <thead>
                     <tr>
                        {[
                           { field: "bill_no", label: "Bill No" },
                           { field: "customer_no", label: "Customer No." },
                           { field: "customer_name", label: "Customer Name" },
                           { field: "address", label: "Address" },
                           { field: "mbps", label: "Mbps" },
                           { field: "plan_price", label: "Plan Price" },
                           { field: "previous_balance", label: "Previous Balance" },
                           { field: "total_due", label: "Total Amount Due" },
                           { field: "remarks", label: "Remarks" },
                        ].map((col) => (
                           <th
                              key={col.field}
                              onClick={() => handleSort(col.field)}
                              className="cursor-pointer px-2 py-3 bg-gray-300 border"
                           >
                              {col.label} {sortIcon(col.field)}
                           </th>
                        ))}
                     </tr>
                  </thead>

                  <tbody>
                     {transactions.length > 0 ? (
                        transactions.map((txn) => (
                           <tr key={txn.id} className="hover:bg-blue-gray-50">
                              <td className="border px-1 py-1 text-[10px]">{txn.bill_no}</td>
                              <td className="border px-1 py-1 text-[10px]">{txn.customer_plan.customer?.id}</td>
                              <td className="border px-1 py-1 text-[10px]">
                                 {`${txn.customer_plan.customer?.firstname} ${txn.customer_plan.customer?.lastname}`}
                              </td>
                              <td className="border px-1 py-1 text-[10px]">
                                 {txn.customer_plan.customer?.purok?.barangay?.barangay_name},{" "}
                                 {txn.customer_plan.customer?.purok?.barangay?.municipality?.municipality_name}
                              </td>
                              <td className="border px-1 py-1 text-[10px]">{txn.customer_plan.plan?.mbps} mbps</td>
                              <td className="border px-1 py-1 text-[10px]">₱{txn.customer_plan.plan?.plan_price}</td>
                              <td className="border px-1 py-1 text-[10px]">₱{txn.balance ?? 0}</td>
                              <td className="border px-1 py-1 text-[10px]">₱{txn.outstanding_balance ?? 0}</td>
                              <td className="border px-1 py-1 text-[10px]"></td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={9} className="text-center px-1 py-1 text-[8px]">
                              {loading ? "Fetching data..." : "No records found"}
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Page;
