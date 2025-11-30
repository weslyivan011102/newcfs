import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@material-tailwind/react";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Show = ({ transactions, grand_totals, filters }) => {
   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   const MONTH_LABELS = {
      "n/a": "SELECT MONTH",
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

   /* ---------------------------------------------- */
   /* GROUP TRANSACTIONS BY PAYMENT MODE             */
   /* ---------------------------------------------- */
   const grouped = transactions.reduce((acc, t) => {
      const mode = t.mode_payment || "UNKNOWN";

      if (!acc[mode]) {
         acc[mode] = {
            rows: [],
            totals: { partial: 0, rebate: 0, balance: 0 },
         };
      }

      acc[mode].rows.push(t);
      acc[mode].totals.partial += parseFloat(t.partial);
      acc[mode].totals.rebate += parseFloat(t.rebate);
      acc[mode].totals.balance += parseFloat(t.outstanding_balance);

      return acc;
   }, {});

   /* ---------------------------------------------- */
   /* ARREARS LOGIC — BELOW CURRENT MONTH            */
   /* ---------------------------------------------- */
   const monthOrder = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december"
   ];

   const getMonthIndex = (desc) => {
      const key = Object.keys(MONTH_LABELS).find(
         (k) => MONTH_LABELS[k] === desc
      );
      return monthOrder.indexOf(key);
   };

   const currentMonthIndex = new Date(filters.start_date).getMonth();

   const arrears = transactions.filter((t) => {
      const desc = MONTH_LABELS[t.description] || t.description;
      const idx = getMonthIndex(desc);
      return idx !== -1 && idx < currentMonthIndex;
   });

   /* ---------------------------------------------- */
   /* COMPUTE GRAND TOTALS ACROSS PAYMENT MODES     */
   /* ---------------------------------------------- */
   const totalCollection = Object.values(grouped).reduce(
      (acc, g) => {
         acc.partial += g.totals.partial;
         acc.rebate += g.totals.rebate;
         acc.balance += g.totals.balance;
         return acc;
      },
      { partial: 0, rebate: 0, balance: 0 }
   );

   const arrearsTotals = arrears.reduce(
      (acc, t) => {
         acc.partial += parseFloat(t.partial);
         acc.rebate += parseFloat(t.rebate);
         acc.balance += parseFloat(t.outstanding_balance);
         return acc;
      },
      { partial: 0, rebate: 0, balance: 0 }
   );

   const finalCollection = {
      partial: totalCollection.partial,
      rebate: totalCollection.rebate,
      balance: totalCollection.balance,
   };

   /* ---------------------------------------------- */
   /* MAIN RETURN LAYOUT                             */
   /* ---------------------------------------------- */
   return (
      <AuthenticatedLayout>
         <Head title="Collections" />

         {/* PRINT BUTTON */}
         <div className="flex justify-end px-8 mb-2">
            <Button variant="gradient" color="green" onClick={() => reactToPrintFn()}>
               Print
            </Button>
         </div>

         <div ref={contentRef} className="w-full px-4 mx-auto bg-white py-8">

            {/* HEADER */}
            <div className="flex items-start justify-between border-b pb-4">
               <div className="flex space-x-4">
                  <img src="/img/logo.png" className="w-10 h-10 object-contain" />
                  <div className="text-sm text-gray-800">
                     <h1 className="font-bold text-[10px]">
                        CFS INTERNET NETWORK SOLUTIONS
                     </h1>
                  </div>
               </div>
            </div>

            {/* REPORT INFO */}
            <div className="flex justify-between items-center my-4 border-b pb-2">
               <div className="text-[10px] text-gray-800">
                  <h1>
                     Collection Report{" "}
                     <span className="font-semibold">
                        {transactions[0]?.customer_plan?.collector
                           ? `by ${transactions[0].customer_plan.collector.firstname} ${transactions[0].customer_plan.collector.lastname}`
                           : ":"}
                     </span>
                  </h1>
                  <p className="mt-1">
                     Collection No.:{" "}
                     <span className="font-semibold">
                        {(() => {
                           const now = new Date();
                           const year = now.getFullYear().toString().slice(-2);
                           const month = String(now.getMonth() + 1).padStart(2, "0");
                           const day = String(now.getDate()).padStart(2, "0");
                           const todayStr = now.toISOString().split("T")[0];
                           const todaysTransactions = transactions.filter(
                              (t) =>
                                 new Date(t.created_at).toISOString().split("T")[0] === todayStr
                           );
                           const inc = String(todaysTransactions.length + 1).padStart(2, "0");
                           return `${year}-${month}-${day}-${inc}`;
                        })()}
                     </span>
                  </p>
               </div>
            </div>

            {/* DATE TITLE */}
            <div className="flex justify-between items-center my-4 border-b pb-2">
               <h2 className="font-semibold text-gray-700 text-[10px]">
                  Collection of{" "}
                  {new Date(filters.start_date).toLocaleDateString("en-PH", {
                     day: "2-digit",
                     month: "long",
                     year: "numeric",
                  })}
               </h2>
            </div>

            {/* PAYMENT MODE TABLES */}
            {Object.keys(grouped).map((mode) => (
               <div key={mode} className="mb-10">
                  <h2 className="text-[12px] font-bold mb-2 mt-6 bg-gray-200 px-3 py-2 uppercase">
                     PAYMENT MODE: {mode}
                  </h2>

                  <table className="w-full border-collapse">
                     <thead>
                        <tr className="bg-gray-100 text-left text-[6px]">
                           <th className="border px-2 py-1">#</th>
                           <th className="border px-5 py-1">Bill No.</th>
                           <th className="border px-2 py-1">Billing Date</th>
                           <th className="border px-2 py-1">Description</th>
                           <th className="border px-2 py-1">Customer Name</th>
                           <th className="border px-2 py-1">Address</th>
                           <th className="border px-2 py-1">Payment</th>
                           <th className="border px-2 py-1">Rebate</th>
                           <th className="border px-2 py-1">Balance</th>
                           <th className="border px-2 py-1">Status</th>
                        </tr>
                     </thead>

                     <tbody>
                        {grouped[mode].rows.map((t, i) => (
                           <tr key={t.id}>
                              <td className="border px-2 py-1 text-[7px]">{i + 1}</td>
                              <td className="border px-2 py-1 text-[7px]">{t.bill_no}</td>
                              <td className="border px-2 py-1 text-[7px]">
                                 {new Date(t.date_billing).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                 })}
                              </td>
                              <td className="border px-2 py-1 text-[7px]">
                                 {MONTH_LABELS[t.description] || t.description}
                              </td>
                              <td className="border px-2 py-1 text-[7px]">
                                 {t.customer_plan?.customer?.lastname},{" "}
                                 {t.customer_plan?.customer?.firstname}
                              </td>
                              <td className="border px-0.5 py-1 text-[7px]">
                                 {t.customer_plan?.customer?.purok?.purok_name},{" "}
                                 {t.customer_plan?.customer?.purok?.barangay?.barangay_name}
                              </td>
                              <td className="border px-2 py-1 text-[7px]">
                                 ₱{t.partial.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="border px-2 py-1 text-[7px]">
                                 ₱{t.rebate.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="border px-2 py-1 text-[7px]">
                                 ₱{t.outstanding_balance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="border px-2 py-1 text-[7px]">{t.status}</td>
                           </tr>
                        ))}
                     </tbody>

                     <tfoot>
                        <tr className="bg-gray-100 font-semibold text-[7px]">
                           <td colSpan="6" className="border px-2 py-1 text-right">
                              TOTAL FOR {mode}:
                           </td>
                           <td className="border px-2 py-1 text-right">
                              ₱{grouped[mode].totals.partial.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                           </td>
                           <td className="border px-2 py-1 text-right">
                              ₱{grouped[mode].totals.rebate.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                           </td>
                           <td className="border px-2 py-1 text-right">
                              ₱{grouped[mode].totals.balance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                           </td>
                           <td className="border"></td>
                        </tr>
                     </tfoot>
                  </table>
               </div>
            ))}

            {/* ARREARS TABLE */}
            {arrears.length > 0 && (
               <div className="mt-10">
                  <h2 className="text-[12px] font-bold mb-2 mt-6 bg-red-200 px-3 py-2 uppercase">
                     ARREARS
                  </h2>

                  <table className="w-full border-collapse">
                     <thead>
                        <tr className="bg-gray-100 text-left text-[6px]">
                           <th className="border px-2 py-1">#</th>
                           <th className="border px-5 py-1">Bill No.</th>
                           <th className="border px-2 py-1">Billing Date</th>
                           <th className="border px-2 py-1">Description</th>
                           <th className="border px-2 py-1">Customer Name</th>
                           <th className="border px-2 py-1">Address</th>
                           <th className="border px-2 py-1">Payment</th>
                           <th className="border px-2 py-1">Rebate</th>
                           <th className="border px-2 py-1">Balance</th>
                           <th className="border px-2 py-1">Status</th>
                        </tr>
                     </thead>

                     <tbody>
                        {arrears.map((t, i) => (
                           <tr key={t.id}>
                              <td className="border px-2 py-1 text-[7px]">{i + 1}</td>
                              <td className="border px-2 py-1 text-[7px]">{t.bill_no}</td>
                              <td className="border px-2 py-1 text-[7px]">
                                 {new Date(t.date_billing).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                              </td>
                              <td className="border px-2 py-1 text-[7px]">{MONTH_LABELS[t.description] || t.description}</td>
                              <td className="border px-2 py-1 text-[7px]">
                                 {t.customer_plan?.customer?.lastname}, {t.customer_plan?.customer?.firstname}
                              </td>
                              <td className="border px-0.5 py-1 text-[7px]">
                                 {t.customer_plan?.customer?.purok?.purok_name}, {t.customer_plan?.customer?.purok?.barangay?.barangay_name}
                              </td>
                              <td className="border px-2 py-1 text-[7px]">
                                 ₱{t.partial.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="border px-2 py-1 text-[7px]">
                                 ₱{t.rebate.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="border px-2 py-1 text-[7px]">
                                 ₱{t.outstanding_balance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="border px-2 py-1 text-[7px]">{t.status}</td>
                           </tr>
                        ))}
                     </tbody>

                     <tfoot>
                        <tr className="bg-gray-100 font-semibold text-[7px]">
                           <td colSpan="6" className="border px-2 py-1 text-right">
                              TOTAL ARREARS:
                           </td>
                           <td className="border px-2 py-1 text-right">
                              ₱{arrearsTotals.partial.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                           </td>
                           <td className="border px-2 py-1 text-right">
                              ₱{arrearsTotals.rebate.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                           </td>
                           <td className="border px-2 py-1 text-right">
                              ₱{arrearsTotals.balance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                           </td>
                           <td className="border"></td>
                        </tr>
                     </tfoot>
                  </table>
               </div>
            )}

            {/* TOTAL COLLECTION SUMMARY */}
            <div className="mt-10 w-full max-w-md mx-auto">
               <h2 className="text-[12px] font-bold mb-2 bg-green-200 px-3 py-2 uppercase">
                  TOTAL COLLECTION
               </h2>

               <table className="w-full border-collapse text-[7px]">
               <thead>
                  <tr className="bg-gray-100 text-center">
                     <th className="border px-2 py-1">Payment</th>
                     <th className="border px-2 py-1">Rebate</th>
                     <th className="border px-2 py-1">Balance</th>
                  </tr>
               </thead>

               <tbody>
                  <tr className="font-semibold text-[7px] text-center">
                     <td className="border px-2 py-1">
                     ₱{finalCollection.partial.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                     </td>
                     <td className="border px-2 py-1">
                     ₱{finalCollection.rebate.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                     </td>
                     <td className="border px-2 py-1">
                     ₱{finalCollection.balance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                     </td>
                  </tr>
               </tbody>
               </table>

            </div>

            {/* SIGNATURES */}
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
                  <p className="font-semibold uppercase text-[12px] underline">
                     MELONY A. BARCELO
                  </p>
                  <p className="text-[12px]">Checked By:</p>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Show;
