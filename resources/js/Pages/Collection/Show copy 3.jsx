import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button, collapse } from "@material-tailwind/react";
import React from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Show = ({ transactions, grand_totals, filters }) => {
   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   console.log("high", JSON.stringify(transactions, null, 2));

   const MONTH_LABELS = {
      "n/a": "SELECT MONTH",   // ✅ FIXED — quotes required
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

   return (
      <AuthenticatedLayout>
         <Head title="Collections" />
         <div className="flex justify-end px-8 mb-2">
            <Button
               variant="gradient"
               color="green"
               onClick={() => reactToPrintFn()}
            >
               Print
            </Button>
         </div>
         <div ref={contentRef} className="w-full px-4 mx-auto bg-white py-8 ">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4">
               {/* Logo + Info */}
               <div className="flex space-x-4">
                  <img
                     src="/img/logo.png"
                     alt="CFS Logo"
                     className="w-10 h-10 object-contain"
                  />
                  <div className="text-sm text-gray-800">
                     <h1 className="font-bold text-[10px]">
                        CFS INTERNET NETWORK SOLUTIONS
                     </h1>
                     {/* <p className="text-[8px]">
                         #4 F.B BUILDING CAYABA ST.
                     </p>
                     <p className="text-[8px]">
                        DISTRICT II, TUMAUINI, ISABELA
                     </p>
                     <p className="text-[8px]">TIN: 295-973-965-001</p>
                     <p className="text-[8px]">CP#: 09453367030</p> */}
                  </div>
               </div>
               <div className="flex space-x-4 text-right">
               </div>
            </div>

            <div className="flex justify-between items-center my-4 border-b pb-2">
              <div className="text-[10px] text-gray-800">
                  <h1>
                     Collection Report 
                     <span className="font-semibold">
                     {transactions[0]?.customer_plan?.collector
                     
                        ? ` by ${transactions[0].customer_plan.collector.firstname} ${transactions[0].customer_plan.collector.lastname}`
                        : ":"}
                        </span>
                  </h1>
                  {/* ✅ Auto-generated Collection Bill Number */}
                  <p className="mt-1">
                  Collection No.:{" "}
                  <span className="font-semibold">
                     {(() => {
                        const now = new Date();
                        const year = now.getFullYear().toString().slice(-2); // e.g. "25"
                        const month = (now.getMonth() + 1).toString().padStart(2, "0"); // e.g. "11"
                        const day = now.getDate().toString().padStart(2, "0"); // e.g. "16"

                        // Count how many transactions exist today
                        const todayStr = now.toISOString().split("T")[0]; // "2025-11-16"
                        const todaysTransactions = transactions.filter(
                           (t) =>
                           new Date(t.created_at).toISOString().split("T")[0] === todayStr
                        );

                        // Auto-increment number
                        const increment = String(todaysTransactions.length + 1).padStart(2, "0"); // 01, 02, 03...

                        // Format: YY-MM-DD-XX
                        return `${year}-${month}-${day}-${increment}`;
                     })()}
                     </span>
                  </p>

               </div>
            </div>

            {/* Title */}
            <div className="flex justify-between items-center my-4 border-b pb-2">
               <h2 className="font-semibold text-gray-700 text-[10px]">
                  Collection of{" "}
                  <span>
                     {new Date(filters.start_date).toLocaleDateString("en-PH", {
                         day: "2-digit",
                         month: "long",
                         year: "numeric",
                     })}
                  </span>
               </h2>
            </div>
            <table className="w-full border-collapse">
               <thead>
                  <tr className="bg-gray-100 text-left text-[6px]">
                     <th className="border px-2 py-1">#</th>
                     <th className="border px-5 py-1">Bill No.</th>
                     <th className="border px-2 py-1">Billing Date</th>
                     <th className="border px-2 py-1">Description</th>
                     <th className="border px-2 py-1">Customer Name</th>
                     <th className="border px-2 py-1">Address</th>
                     <th className="border px-2 py-1">
                        Payment Amount
                     </th>
                     <th className="border px-2 py-1">Rebate</th>
                     <th className="border px-2 py-1">Balance</th>
                     <th className="border px-2 py-1">Status</th>
                     <th className="border px-2 py-1">Payment Recieved By:</th>
                  </tr>
               </thead>

               <tbody>
                  {transactions.length > 0 ? (
                     transactions.map((transaction, index) => (
                        <tr key={transaction.id}>
                           <td className="border px-2 py-1 text-[7px]">
                              {index + 1}
                           </td>
                           <td className="border px-2 py-1 text-[7px]">
                              {transaction.bill_no}
                           </td>
                           <td className="border px-2 py-1 text-[7px]">
                              {new Date(
                                 transaction.date_billing
                              ).toLocaleDateString("en-US", {
                                  day: "2-digit",
                                 month: "short",
                                 year: "numeric",
                              })}
                           </td>
                           <td className="border px-2 py-1 text-[7px]">
                              {MONTH_LABELS[transaction.description] || transaction.description}
                           </td>
                           <td className="border px-2 py-1 text-[7px]">
                              {transaction.customer_plan?.customer?.lastname},{" "}
                              {transaction.customer_plan?.customer?.firstname}
                           </td>
                           <td className="border px-0.5 py-1 text-[7px]">
                              {
                                 transaction.customer_plan?.customer?.purok
                                    ?.purok_name
                              }
                              ,{" "}
                              {
                                 transaction.customer_plan?.customer?.purok
                                    ?.barangay?.barangay_name
                              }
                           </td>
                           <td className="border px-2 py-1  text-[7px]">
                              ₱
                              {transaction.partial.toLocaleString("en-PH", {
                                 minimumFractionDigits: 2,
                              })}
                           </td>
                           <td className="border px-2 py-1  text-[7px]">
                              ₱
                              {transaction.rebate.toLocaleString("en-PH", {
                                 minimumFractionDigits: 2,
                              })}
                           </td>
                           <td className="border px-2 py-1  text-[7px]">
                              ₱
                              {transaction.outstanding_balance.toLocaleString(
                                 "en-PH",
                                 { minimumFractionDigits: 2 }
                              )}
                           </td>
                           <td className="border px-2 py-1 text-[7px]">
                              {transaction.status}
                           </td>
                           <td className="border px-2 py-1 text-[7px]">
                              {transaction.customer_plan?.collector?.firstname}
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td
                           colSpan="10"
                           className="text-center py-4 text-gray-500"
                        >
                           No collection records found
                        </td>
                     </tr>
                  )}
               </tbody>

               {/* ✅ Totals Row */}
               <tfoot>
                  <tr className="bg-gray-100 font-semibold text-[8px]">
                     <td colSpan="5" className="border px-2 py-1 text-right">
                        Total Payment:
                     </td>
                     <td className="border px-2 py-1 text-right">
                        ₱
                        {grand_totals.partial.toLocaleString("en-PH", {
                           minimumFractionDigits: 2,
                        })}
                     </td>
                     <td className="border px-2 py-1 text-right">
                        ₱
                        {grand_totals.rebate.toLocaleString("en-PH", {
                           minimumFractionDigits: 2,
                        })}
                     </td>
                     <td className="border px-2 py-1 text-right">
                        ₱
                        {grand_totals.balance.toLocaleString("en-PH", {
                           minimumFractionDigits: 2,
                        })}
                     </td>
                     <td colSpan="2" className="border px-2 py-1"></td>
                  </tr>
               </tfoot>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-2 text-center mt-12 text-sm text-gray-700">
               <div>
                  
                  <p className="font-semibold uppercase text-[12px] underline">
                     {transactions[0]?.customer_plan?.collector
                        ? `${transactions[0].customer_plan.collector.firstname} ${transactions[0].customer_plan.collector.lastname}`
                        : "___________________"}
                  </p>
                  <p className="text-[12px]">Collector:</p>
               </div>
               <div>
                  
                  <p className="font-semibold uppercase text-[12px] underline">MELONY A. BARCELO</p> 
                  <p className=" text-[12px]">Checked By:</p>  
               </div>
               {/* <div>
                  <p className=" text-[14px]">Approved By:</p>
                  <p className=" text-[14px]">Patrick Neil Reyes</p>
               </div> */}
            </div>
         </div>
      </AuthenticatedLayout>
   );
};
export default Show;
