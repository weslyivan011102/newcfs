import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import UseAppUrl from "@/hooks/UseAppUrl";
import { Button } from "@material-tailwind/react";

const Index = () => {
   const API_URL = UseAppUrl();

   const [soa, setSoa] = useState(null);
   const [customerId, setCustomerId] = useState("");
   const [loading, setLoading] = useState(false);

   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   const fetchSoa = async () => {
      if (!customerId) return;
      setLoading(true);
      try {
         const res = await axios.get(
            `${API_URL}/api/customer_soa?search=${customerId}`
         );
         console.log(res.data);
         setSoa(res.data.customer);
      } catch (err) {
         console.error("Error fetching SOA:", err);
         setSoa(null);
      } finally {
         setLoading(false);
      }
   };

   const handleKeyDown = (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         fetchSoa();
      }
   };

   return (
      <AuthenticatedLayout>
         <Head title="Customer Soa" />

         {/* Search Bar */}
         <div className="max-w-4xl mx-auto mt-6 mb-4 flex items-center gap-2">
            <div className="flex justify-between">
               <div className="flex">
                  <input
                     type="number"
                     placeholder="Enter Customer No..."
                     value={customerId}
                     onChange={(e) => setCustomerId(e.target.value)}
                     onKeyDown={handleKeyDown}
                     className="border border-gray-400 rounded-md px-3 py-2 w-[380px]"
                  />
               </div>
               <button
                  onClick={fetchSoa}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md bg-blue-600"
               >
                  Search
               </button>
            </div>

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
         {loading && (
            <div className="p-8 text-center text-gray-600">Loading...</div>
         )}

         {/* No SOA */}
         {!loading && soa === null && customerId && (
            <div className="p-8 text-center text-red-500">
               No data found for customer ID: {customerId}
            </div>
         )}

         {/* SOA Display */}
         {soa && (
            <div className="overflow-y-auto max-h-[590px]  bg-white text-black max-w-4xl mx-auto border border-gray-400 shadow-md">
               <div ref={contentRef} className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                     <h2 className="font-bold text-lg">
                        CFS INTERNET NETWORK SOLUTION
                     </h2>
                     <p className="text-sm">
                        #2, Managuelod Bldg. National High Way <br />
                        District II, Tumauini, Isabela.
                     </p>
                     <p className="text-sm">
                        TIN: 295-973-965-001 &nbsp;&nbsp; CP#: 09453367030
                     </p>
                  </div>

                  {/* Info Section */}
                  <div className="space-y-3 mb-6">
                     <p>
                        <span className="font-semibold">Printed Date:</span>{" "}
                        <span>{new Date().toLocaleDateString()}</span>
                     </p>
                     <p>
                        <span className="font-semibold">Account No.:</span>{" "}
                        <span>{soa.id}</span>
                     </p>
                     <p>
                        <span className="font-semibold">Client Name:</span>{" "}
                        <span>{`${soa.firstname} ${soa.lastname}`}</span>
                     </p>
                     <p>
                        <span className="font-semibold">Contact No:</span>{" "}
                        <span>{soa.contact_no}</span>
                     </p>
                  </div>

                  {/* Plan Info Table */}
                  {soa.customer_plans.length > 0 && (
                     <table className="w-full border-collapse border border-gray-400 text-sm mb-8">
                        <thead>
                           <tr>
                              <th className="border border-gray-400 px-2 py-1">
                                 Date of Registration
                              </th>
                              <th className="border border-gray-400 px-2 py-1">
                                 Day of Billing
                              </th>
                              <th className="border border-gray-400 px-2 py-1">
                                 MBPS
                              </th>
                              <th className="border border-gray-400 px-2 py-1">
                                 Plan Price
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td className="border border-gray-400 px-2 py-1 h-8">
                                 {soa.customer_plans[0].date_registration}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                 {soa.customer_plans[0].date_billing}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                 {soa.customer_plans[0].plan.mbps}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                 ₱{soa.customer_plans[0].plan.plan_price}
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  )}

                  {/* Statement of Account */}
                  <h3 className="text-center font-bold mb-2">
                     STATEMENT OF ACCOUNT
                  </h3>

                  <table className="w-full border-collapse border border-gray-400 text-sm mb-12">
                     <thead>
                        <tr>
                           <th className="border border-gray-400 px-2 py-1">
                              Bill No.
                           </th>
                           <th className="border border-gray-400 px-2 py-1">
                              Month/Year
                           </th>
                           <th className="border border-gray-400 px-2 py-1">
                              Billing Date
                           </th>

                           <th className="border border-gray-400 px-2 py-1">
                              Plan Price
                           </th>
                           <th className="border border-gray-400 px-2 py-1">
                              Payment
                           </th>
                           <th className="border border-gray-400 px-2 py-1">
                              Outstanding Balance
                           </th>
                           <th className="border border-gray-400 px-2 py-1">
                              Remarks
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {soa.customer_plans[0]?.transactions.map((t) => (
                           <tr key={t.id}>
                              <td className="border border-gray-400 px-2 py-1">
                                 {t.bill_no}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                 {new Date(t.date_billing).toLocaleString(
                                    "default",
                                    {
                                       month: "long",
                                       year: "numeric",
                                    }
                                 )}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                 {t.date_billing}
                              </td>

                              <td className="border border-gray-400 px-2 py-1">
                                 ₱{t.plan_price}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                 ₱{t.bill_amount}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                 ₱{t.outstanding_balance}
                              </td>
                              <td className="border border-gray-400 px-2 py-1">
                                 {t.remarks}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </AuthenticatedLayout>
   );
};

export default Index;
