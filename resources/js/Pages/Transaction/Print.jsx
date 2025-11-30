import React, { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { Button } from "@material-tailwind/react";
import { Head } from "@inertiajs/react";


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


export default function Print({
   transaction,
   billing_month,
   balance,
   latest,
   amount_due,
   outstanding_balance,
}) {
   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   // useEffect(() => {
   //    if (transaction) {
   //       reactToPrintFn();
   //    }
   // }, [transaction]);

   console.log(transaction);

   return (
      <>
         <Head title="Print Bill" />
         <div className="flex justify-center items-center px-6 mt-2 mb-5">
            <Button
               variant="gradient"
               className="w-[320px]"
               color="green"
               onClick={() => reactToPrintFn()}
            >
               Print
            </Button>
         </div>
         <div
            ref={contentRef}
            className="mt-2 max-w-sm mx-auto bg-white border border-gray-300 shadow-md p-4 font-mono text-sm leading-relaxed"
         >
            {/* Header */}
           <div className="flex justify-center">
               <div className="text-center">
                  { <img
                     src="/img/logo.png"
                     alt="CFS Logo"
                     className="w-10 h-10 object-contain mx-auto" // Center the image itself
                  /> }
                  <h1 className="font-extrabold text-xs">CFS INTERNET NETWORK SOLUTIONS</h1>
                  {/* <p>#4 F.B BUILDING CAYABA ST.</p>
                  <p>DISTRICT II, TUMAUINI, ISABELA</p>
                  <p className="font-semibold">TIN: 295-973-965-001</p>
                  <p className="font-semibold">CP#: 09453367030</p> */}
               </div>
            </div>

            <hr className="my-2 border-dashed border-1 border-black" />

            <div className="text-center">
               <h1 className="font-extrabold text-xs">COLLECTION <br/>
                  ACKNOWLEDGEMENT</h1>
            </div>

            <hr className="my-2 border-dashed border-1 border-black" />

            {/* Customer Info */}
            <div className="space-y-1">
                <p className="text-xs">
                     Date:{" "}
                       <span>
                        {(() => {
                           const date_billing = new Date();
                           const day = date_billing.toLocaleDateString("en-GB", { day: "2-digit" });
                           const month = date_billing.toLocaleDateString("en-GB", { month: "short" });
                           const year = date_billing.getFullYear();
                           return `${day} - ${month} - ${year}`;
                        })()} 
                        </span>
                     </p>
               <p className="text-xs">
                  <span className="font-bold">
                     {transaction.customer_plan.customer.firstname}
                     {", "}
                     {transaction.customer_plan.customer.lastname}
                  </span>
               </p>
               <p className="font-semibold text-xs">
                  Acct. No:{" "}
                  <span className="ml-2">
                     {transaction.customer_plan?.customer_id ?? ""}
                  </span>
               </p>
               <p className="text-xs">
                  Bill No: <span className="ml-2">{transaction.bill_no}</span>
               </p>

               <hr className="my-2 border-dashed border-1 border-black" />

               <p className="font-semibold text-xs">
                  Bill Amount{" "}
                  <span className="float-right">
                     ₱{transaction.customer_plan.plan.plan_price}
                  </span>
               </p>
            </div>
            {/* Billing Info */}
            <div className="space-y-1 mt-2">
               <p className="text-xs">
                  Previous Balance:{" "}
                  <span className="float-right">₱{balance ?? 0.0}</span>
               </p>
               <p className="text-xs">
                  Amount Due:{" "}
                  <span className="float-right">₱{amount_due ?? 0.0}</span>
               </p>
               <p className="font-bold text-xs">
                  Payment:{" "}
                  <span className="float-right">₱{transaction.partial}</span>
               </p>
               <p className="text-xs">
                  Balance:{" "}
                  <span className="float-right">
                     {" "}
                     ₱{outstanding_balance ?? 0.0}
                  </span>
               </p>
            </div>

           <hr className="my-2 border-dashed border-1 border-black" />
                     <p className="text-xs  font-semibold">
                        Remarks:{" "}
                        <span className="float-right">
                           {" "}
                           {transaction.status}
                        </span>
                     </p>
                      <p className="text-xs  font-semibold">
                        Payment Mode:{" "}
                        <span className="float-right">
                           {" "}
                           {transaction.mode_payment}
                        </span>
                     </p>
                     <p className="text-xs font-semibold">
                     Description:{" "}
                     <span className="float-right">
                        {MONTH_LABELS[transaction.description] || transaction.description}
                     </span>
                  </p>
            <hr className="my-2 border-dashed border-1 border-black" />

            {/* Collector */}
            <p className="text-xs">
               Collector:{" "}
               <span className="ml-2">
                  {transaction.customer_plan.collector.firstname},
                  {" "}
                  {transaction.customer_plan.collector.lastname}
               </span>
            </p>

            <hr className="my-2 border-dashed border-1 border-black" />

            {/* Notice */}
            <div className="text-justify text-s">
               <p className="font-bold">NOTICE:</p>
               <p className="text-justify text-xs">
                  To avoid temporary disconnection kindly settle your bill
                  within 7 days of the due date. For assistance or to make a
                  payment.
               </p>
            </div>

            {/* Contact */}
            <div className="text-s space-y-1 mt-1">
               <p className="font-bold">PLEASE CALL:</p>
               <p className="font-xs">BILLING DEPT. CP NO: 09162832206</p>
            </div>
            <div className="text-sm space-y-1">
               <p className="font-bold">GCASH PAYMENT:</p>
               <p className="font-xs">GCASH NO: 09774066099</p>
               <p className="font-xs">NAME: PA****K *E*L R.</p>
            </div> 
                           
            <hr className="my-2 border-dashed border-1 border-black" />

            <div className="text-center mt-6">
               <hr className="my-2 border-line border-1 border-black" />
               <p className="text-sm">Customer Signature</p>
            </div>

            <div className="text-center mt-6">
               <hr className="my-2 border-line border-1 border-black" />
               <p className="text-sm">Collector Signature</p>
            </div>

            <hr className="my-2 border-dashed border-1 border-black" />

            <div className="text-center">
               <h1 className="font-bold text-base" >THANK YOU FOR YOUR PAYMENT!</h1>
               <p className="font-sm">Please ask for a receipt:</p>
             </div>
         </div>
      </>
   );
}
