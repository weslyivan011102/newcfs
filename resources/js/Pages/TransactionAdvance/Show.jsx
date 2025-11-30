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
                     <p className="text-s">#4 F.B BUILDING CAYABA ST.</p>
                     <p className="text-s">DISTRICT II, TUMAUINI, ISABELA</p>
                     <p className="font-semibold">TIN: 295-973-965-001</p>
                     <p className="font-semibold">CP#: 09453367030</p>
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
                     <p>
                        <span className="font-bold">
                           {transaction.customer_plan.customer.firstname}
                           {", "}
                           {transaction.customer_plan.customer.lastname}{" "}
                        </span>
                     </p>
                     <p>
                        Acct. No:{" "}
                        <span className="ml-2">
                           {transaction.customer_plan.customer.id}
                        </span>
                     </p>
                     <p>
                        Bill No:{" "}
                        <span className="ml-2">{transaction.bill_no}</span>
                     </p>
                     <p className="font-semibold text-s">
                        Bill of November{" "}
                        <span className="float-right">
                           ₱{transaction.customer_plan.plan.plan_price}
                        </span>
                     </p>
                  </div>

                  <hr className="my-2 border-dashed" />

                  {/* Billing Info */}
                  <div className="space-y-1">
                     <p>
                        Previous Balance:{" "}
                        <span className="float-right">
                           ₱{latest.balance ?? 0.0}
                        </span>
                     </p>
                     <p>
                        Amount Due:{" "}
                        <span className="float-right">
                           ₱{latest.amount_due ?? 0.0}
                        </span>
                     </p>
                     <p>
                        Payment:{" "}
                        <span className="float-right">
                           ₱{transaction.partial}
                        </span>
                     </p>
                     <p className="font-bold">
                        Outstanding Balance:{" "}
                        <span className="float-right">
                           {" "}
                           ₱{latest.outstanding_balance ?? 0.0}
                        </span>
                     </p>
                  </div>

                  <hr className="my-2 border-dashed border-1 border-black" />

                  {/* Collector */}
                  <p className="text-s">
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
                     <p className="text-justify text-s">
                        To avoid temporary disconnection kindly settle your bill
                        within 7 days of the due date. For assistance or to make
                        a payment
                     </p>
                  </div>

                  {/* Contact */}
                   <div className="text-s space-y-1 mt-4">
                     <p className="font-bold">PLEASE CALL:</p>
                     <p className="font-semibold">CUSTOMER SERVICE NO: 09453367030</p>
                     <p className="font-semibold">BILLING DEPT. CP NO: 09162832206</p>
                  </div>

                   <hr className="my-2 border-dashed border-1 border-black" />
                   <div className="text-s space-y-1">
                     <p className="font-bold">GCASH PAYMENT:</p>
                     <p className="font-semibold">GCASH NO: 09774066099</p>
                     <p className="font-semibold">NAME: PA****K *E*L R.</p>
                  </div> 
                           
                  <hr className="my-2 border-dashed border-1 border-black" />

                  <div className="text-center mt-6">
                        <hr className="my-2 border-line border-1 border-black" />
                        <p className="text-sm">Customer Signature</p>
                  </div>

                  <hr className="my-2 border-dashed border-1 border-black" />

                  <div className="text-center">
                     <h1 className="font-bold text-lg" >THANK YOU FOR YOUR PAYMENT!</h1>
                     <p className="font-sm">Please ask for a receipt:</p>
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
