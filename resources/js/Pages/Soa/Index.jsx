import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import UseAppUrl from "@/hooks/UseAppUrl";
import { Button } from "@material-tailwind/react";

const Index = () => {
   const API_URL = UseAppUrl();
   const [batch, setBatch] = useState("");
   const [soa, setSoa] = useState(null);
   const [search, setSearch] = useState(""); // firstname/lastname/fullname
   const [month, setMonth] = useState(""); // optional
   const [year, setYear] = useState(new Date().getFullYear()); // default current year
   const [loading, setLoading] = useState(false);

   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   const MONTH_LABELS = {
      "n/a": "N/A",
      january: "JAN BILL",
      february: "FEB BILL",
      march: "MAR BILL",
      april: "APR BILL",
      may: "MAY BILL",
      june: "JUN BILL",
      july: "JUL BILL",
      august: "AUG BILL",
      september: "SEP BILL",
      october: "OCT BILL",
      november: "NOV BILL",
      december: "DEC BILL",
   };

   const months = [
      { value: "", label: "All Months" },
      { value: 1, label: "January" },
      { value: 2, label: "February" },
      { value: 3, label: "March" },
      { value: 4, label: "April" },
      { value: 5, label: "May" },
      { value: 6, label: "June" },
      { value: 7, label: "July" },
      { value: 8, label: "August" },
      { value: 9, label: "September" },
      { value: 10, label: "October" },
      { value: 11, label: "November" },
      { value: 12, label: "December" },
   ];

   const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

   const handleKeyDown = (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         fetchSoa();
      }
   };

   const fetchSoa = async () => {
      if (!search) return;
      setLoading(true);
      try {
         const res = await axios.get(`${API_URL}/api/customer_soa`, {
            params: { search, month, year },
         });
         setSoa(res.data.customer);
      } catch (err) {
         console.error("Error fetching SOA:", err);
         setSoa(null);
      } finally {
         setLoading(false);
      }
   };

   const formatBillingDate = (batch) => {
      const map = {
         batch1: "Due1",
         batch2: "Due5",
         batch3: "Due10",
         batch4: "Due15",
         batch5: "Due25",
         all_cheque: "Due28-AllCheque",
      };
      return map[batch] || batch;
   };

   return (
      <AuthenticatedLayout>
         <Head title="CFS INTERNET NETWORK SOLUTIONS" />

         {/* Search & Filters */}
         <div className="max-w-4xl mx-auto mt-6 mb-4 flex flex-wrap gap-2 items-center">
            <input
               type="text"
               placeholder="Enter Firstname / Lastname..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               onKeyDown={handleKeyDown}
               className="border border-gray-400 rounded-md px-3 py-2 w-[280px]"
            />
            <select
               value={month}
               onChange={(e) => setMonth(e.target.value)}
               className="border border-gray-400 rounded-md px-3 py-2"
            >
               {months.map((m) => (
                  <option key={m.value} value={m.value}>
                     {m.label}
                  </option>
               ))}
            </select>
            <select
               value={year}
               onChange={(e) => setYear(e.target.value)}
               className="border border-gray-400 rounded-md px-3 py-2"
            >
               {years.map((y) => (
                  <option key={y} value={y}>
                     {y}
                  </option>
               ))}
            </select>
            <button
               onClick={fetchSoa}
               className="bg-blue-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md"
            >
               Search
            </button>
            <Button
               variant="gradient"
               className="w-[180px]"
               color="green"
               onClick={() => reactToPrintFn()}
            >
               Print
            </Button>
         </div>

         {/* Loader */}
         {loading && <div className="p-8 text-center text-gray-600">Loading...</div>}

         {/* No SOA */}
         {!loading && soa === null && search && (
            <div className="p-8 text-center text-red-500">
               No data found for: {search}
            </div>
         )}

         {/* SOA Display */}
         {soa && (
            <div className="overflow-y-auto max-h-[590px] bg-white text-black max-w-4xl mx-auto border border-gray-400 shadow-md">
               <div ref={contentRef} className="p-8">
                  {/* Header */}
                  <div className="flex space-x-4 align-middle">
                     <img src="/img/logo.png" alt="CFS Logo" className="w-20 h-20 object-contain" />
                     <div className="text-sm text-gray-800">
                        <h1 className="font-bold text-[16px]">CFS INTERNET NETWORK SOLUTIONS</h1>
                        <p className="text-[14px]">#4 F.B BUILDING CAYABA ST.</p>
                        <p className="text-[14px]">DISTRICT II, TUMAUINI, ISABELA</p>
                        <p className="text-[14px]">TIN: 295-973-965-001</p>
                        <p className="text-[14px]">CP#: 09453367030</p>
                     </div>
                  </div>

                  {/* Info Section */}
                  <div className="space-y-3 mt-10 mb-6">
                     <p>
                        <span className="font-semibold">Printed Date:</span>{" "}
                        <span>
                           {(() => {
                              const date = new Date();
                              const day = date.toLocaleDateString("en-GB", { day: "2-digit" });
                              const month = date.toLocaleDateString("en-GB", { month: "short" });
                              const year = date.getFullYear();
                              return `${day} - ${month} - ${year}`;
                           })()}
                        </span>
                     </p>
                     <p>
                        <span className="font-semibold">Account No.:</span> <span>{soa.id}</span>
                     </p>
                     <p>
                        <span className="font-semibold">Customer Name:</span>{" "}
                        <span>{`${soa.firstname} ${soa.lastname}`}</span>
                     </p>
                     <p>
                        <span className="font-semibold">Contact No:</span> <span>{soa.contact_no}</span>
                     </p>
                  </div>

                  {/* Plan Info Table */}
                  {soa.customer_plans.length > 0 && (
                     <table className="w-full border-collapse border border-gray-400 text-sm mb-8">
                        <thead>
                           <tr>
                              <th className="border border-gray-400 px-2 py-1">Date of Registration</th>
                              <th className="border border-gray-400 px-2 py-1">Day of Billing</th>
                              <th className="border border-gray-400 px-2 py-1">MBPS</th>
                              <th className="border border-gray-400 px-2 py-1">Plan Price</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td className="border border-gray-400 px-2 py-1 h-8 text-center">{soa.customer_plans[0].date_registration}</td>
                              <td className="border border-gray-400 px-2 py-1 text-center">{soa.customer_plans[0].date_billing}</td>
                              <td className="border border-gray-400 px-2 py-1 text-center">{soa.customer_plans[0].plan.mbps}</td>
                              <td className="border border-gray-400 px-2 py-1 text-center">₱{soa.customer_plans[0].plan.plan_price}</td>
                           </tr>
                        </tbody>
                     </table>
                  )}

                  {/* Statement of Account */}
                  <h3 className="text-center font-bold mb-2">STATEMENT OF ACCOUNT</h3>
                  <table className="w-full border-collapse border border-gray-400 text-sm mb-12">
                     <thead>
                        <tr>
                           <th className="border border-gray-400 px-1 py-1">Bill No.</th>
                           <th className="border border-gray-400 px-1 py-1">Month/Year</th>
                           <th className="border border-gray-400 px-1 py-1">Description</th>
                           <th className="border border-gray-400 px-1 py-1">Billing Date</th>
                           <th className="border border-gray-400 px-1 py-1">Plan Price</th>
                           <th className="border border-gray-400 px-1 py-1">Payment</th>
                           <th className="border border-gray-400 px-1 py-1">Outstanding Balance</th>
                           <th className="border border-gray-400 px-1 py-1">Remarks</th>
                           <th className="border border-gray-400 px-1 py-1">Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        {soa.customer_plans[0]?.transactions.map((t) => (
                           <tr key={t.id}>
                              <td className="border border-gray-400 px-2 py-1">{t.bill_no}</td>
                              <td className="border border-gray-400 px-2 py-1">
                                 {new Date(t.date_billing).toLocaleString("default", { month: "long", year: "numeric" })}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                 {MONTH_LABELS[t.description?.toLowerCase()?.trim()] || t.description || "N/A"}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                 {new Date(t.date_billing).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">₱{t.plan_price}</td>
                              <td className="border border-gray-400 px-2 py-1">₱{t.partial}</td>
                              <td className="border border-gray-400 px-2 py-1">₱{t.outstanding_balance}</td>
                              <td className="border border-gray-400 px-2 py-1">{t.remarks}</td>
                              <td className="border border-gray-400 px-2 py-1">{t.status}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>

                  {/* Prepared / Checked By */}
                  <div className="grid grid-cols-3 text-center mt-12 text-sm text-gray-700">
                     <div></div>
                     <div>
                        <p className="text-[14px] font-semibold">Prepared By:</p>
                        <p className="text-[14px]">RICKA JOY A. RIVERA</p>
                     </div>
                     <div>
                        <p className="text-[14px] font-semibold">Checked By:</p>
                        <p className="text-[14px]">MELONY A. BARCELO</p>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </AuthenticatedLayout>
   );
};

export default Index;
