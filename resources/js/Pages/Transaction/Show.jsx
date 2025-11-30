import { BsArrowReturnLeft } from "react-icons/bs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
   Card,
   Input,
   Checkbox,
   Button,
   Typography,
   IconButton,
   Textarea,
   Tooltip,
   Avatar,
} from "@material-tailwind/react";
import Select from "react-select";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const Show = ({ transaction, collectors, latest }) => {
   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   
      const MONTH_LABELS = {
      "n/a": "N/A",   // ✅ FIXED — quotes required
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

   console.log("Transaction:", transaction);
   console.log("Collectors:", collectors);
   console.log("Latest:", latest);

   return (
      <AuthenticatedLayout>
         <Head title="Batch Bill" />
         <div className="bg-white overflow-y-auto max-h-[590px] grid place-justify-center m-2">
            <div className="flex justify-between items-center">
               <Typography
                  variant="lead"
                  size="small"
                  className="mb-5 text-lg font-bold"
               >
                  Bill Transaction
               </Typography>
               <Tooltip content="Back">
                  <Link
                     href="/admin/transactions"
                     className="hover:bg-gray-200 px-2 py-1 rounded mr-4"
                  >
                     <BsArrowReturnLeft className="text-xl cursor-pointer" />
                  </Link>
               </Tooltip>
            </div>

            <div className="h-[480px] overflow-auto">
               <div
                  ref={contentRef}
                  className="mt-2 max-w-sm mx-auto bg-white border border-gray-300 shadow-md p-4 font-mono text-sm leading-relaxed"
               >
                  {/* Header */}
                  <div className="text-center">
                    <div className="text-center">
                     { <img
                        src="/img/logo.png"
                        alt="CFS Logo"
                        className="w-10 h-10 object-contain mx-auto" // Center the image itself
                     /> }
                     <h1 className="font-extrabold text-xs">CFS INTERNET NETWORK SOLUTIONS</h1>
                     
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
                           {transaction.customer_plan.customer.lastname}{" "}
                        </span>
                     </p>
                     <p className="text-xs">
                        Acct. No:{" "}
                        <span className="ml-2">
                           {transaction.customer_plan.customer.id}
                        </span>
                     </p>
                     <p className="text-xs">
                        Bill No:{" "}
                        <span className="ml-2">{transaction.bill_no}</span>
                     </p>

                     <hr className="my-2 border-dashed border-1 border-black" />
                     
                     <p className="font-semibold text-xs">
                        Bill Amount:{" "}
                        <span className="float-right">
                           ₱{transaction.customer_plan.plan.plan_price}
                        </span>
                     </p>
                  </div>

                  {/* Billing Info */}
                  <div className="space-y-1">
                     <p className="text-xs">
                        Previous Balance:{" "}
                        <span className="float-right">
                           ₱{latest.balance ?? 0.0}
                        </span>
                     </p>
                     <p className="text-xs">
                        Amount Due:{" "}
                        <span className="float-right">
                           ₱{latest.amount_due ?? 0.0}
                        </span>
                     </p>
                     <p className="font-bold text-xs">
                        Payment:{" "}
                        <span className="float-right">
                           ₱{transaction.partial}
                        </span>
                     </p>
                     <p className="text-xs">
                        Balance:{" "}
                        <span className="float-right">
                           {" "}
                           ₱{latest.outstanding_balance ?? 0.0}
                        </span>
                     </p>
                  </div>

                  <hr className="my-2 border-dashed border-1 border-black" />

                  <p className="text-xs font-semibold">
                        Remarks:{" "}
                        <span className="float-right">
                           {" "}
                           {transaction.status}
                        </span>
                  </p>

                   <p className="text-xs font-semibold">
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
                     <p className="text-justif text-xs">
                        To avoid temporary disconnection kindly settle your bill
                        within 7 days of the due date. For assistance or to make
                        a payment.
                     </p>
                  </div>

                  {/* Contact */}
                   <div className="text-s space-y-1 mt-1">
                     <p className="font-bold text-xs">PLEASE CALL:</p>
                     <p className="text-xs">BILLING DEPT. CP NO: 09162832206</p>
                  </div>

                   
                   <div className="text-s space-y-1">
                     {/* <p className="font-bold">GCASH PAYMENT:</p> */}
                     <p className="text-xs">GCASH NO: 09774066099</p>
                     <p className="text-xs">NAME: PA****K *E*L R.</p>
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
                     {/* <h1 className="font-bold text-base" >THANK YOU FOR YOUR PAYMENT!</h1> */}
                     <p className="font-s">Please ask for a receipt:</p>
                  </div>
               </div>
            </div>
            <div className="flex justify-end mt-3 mb-5">
               <Link href="/admin/transactions-advance" className="mr-2">
                  <Button variant="text" color="red">
                     Cancel
                  </Button>
               </Link>

               <Button
                  variant="gradient"
                  color="green"
                  onClick={() => reactToPrintFn()}
               >
                  Print
               </Button>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};
export default Show;
