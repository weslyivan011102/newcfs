import React, { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { Button } from "@material-tailwind/react";
import { Head } from "@inertiajs/react";

export default function Print({
   transaction,
   outstanding_balance,
   billing_month,
}) {
   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   // useEffect(() => {
   //    if (transaction) {
   //       reactToPrintFn();
   //    }
   // }, [transaction]);

   return (
      <>
         <Head title="Print Bill" />
         <div className="p-6" ref={contentRef}>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
               <div>
                  <img
                     src="/img/internet.png"
                     alt="CFS Logo"
                     className="w-16 h-16"
                  />
                  <div className="text-sm mt-1">
                     #2, Manguelod Bldg. National High Way <br />
                     District II, Tumauini, Isabela <br />
                     TIN: 295-973-965-001 <br />
                     CP#: 09453367030
                  </div>
               </div>
               <div className="text-right">
                  <p className="font-bold">
                     {[
                        transaction.customer?.firstname,
                        transaction.customer?.middlename,
                        transaction.customer?.lastname,
                     ]
                        .filter(Boolean)
                        .join(" ")}
                  </p>
                  <p>
                     {transaction.date_billing
                        ? format(
                             new Date(transaction.date_billing),
                             "MMMM dd, yyyy"
                          )
                        : ""}
                  </p>
               </div>
            </div>

            {/* Bill Info */}
            <div className="flex justify-between mb-2">
               <span>Acct. No:</span>
               <span>{transaction.customer_plan?.customer_id ?? ""}</span>
            </div>
            <div className="flex justify-between mb-4">
               <span>Bill No.</span>
               <span>{transaction.bill_no}</span>
            </div>

            {/* Charges */}
            <div className="space-y-1 mb-4">
               <div className="flex justify-between">
                  <span>
                     Bill for the month of {billing_month ?? "Current"}
                  </span>
                  <span>₱ {transaction.bill_amount ?? "0.00"}</span>
               </div>
               <div className="flex justify-between">
                  <span>Rebate</span>
                  <span>₱ {transaction.rebate ?? "0.00"}</span>
               </div>
               <div className="flex justify-between">
                  <span>Payment</span>
                  <span>₱ {transaction.partial ?? "0.00"}</span>
               </div>
               <div className="flex justify-between">
                  <span>Outstanding Balance Previous Month</span>
                  <span>₱ {outstanding_balance ?? "0.00"}</span>
               </div>
               <div className="flex justify-between font-bold border-t border-gray-400 pt-2">
                  <span>Amount Due:</span>
                  <span>₱ {transaction.bill_amount ?? "0.00"}</span>
               </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between text-sm mb-4">
               <span>Prepared by: John</span>
               <span>
                  Collector:{" "}
                  {[
                     transaction.collector?.firstname,
                     transaction.collector?.middlename,
                     transaction.collector?.lastname,
                  ]
                     .filter(Boolean)
                     .join(" ")}
               </span>
               <span>
                  Date:{" "}
                  {transaction.created_at
                     ? format(new Date(transaction.created_at), "MMMM dd, yyyy")
                     : ""}
               </span>
            </div>

            <div className="border border-red-500 p-3 rounded text-sm bg-red-50 flex items-start gap-2">
               <div className="text-red-600 font-bold">⚠</div>
               <div>
                  <p>
                     7 Days Notice: To avoid temporary disconnection kindly
                     settle your bill within 7 days of the due date. For
                     assistance or to make a payment please call:
                  </p>
                  <p className="font-bold">CUSTOMER SERVICE NO: 09453367030</p>
                  <p className="font-bold">BILLING DEPT. CP NO: 09162832206</p>
               </div>
            </div>
         </div>

         <div className="flex justify-center items-center px-6">
            <Button
               variant="gradient"
               className="w-[320px]"
               color="green"
               onClick={() => reactToPrintFn()}
            >
               Print
            </Button>
         </div>
      </>
   );
}
