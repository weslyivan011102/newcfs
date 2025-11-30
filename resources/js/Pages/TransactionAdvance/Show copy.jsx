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
                     href="/transactions"
                     className="hover:bg-gray-200 px-2 py-1 rounded mr-4"
                  >
                     <BsArrowReturnLeft className="text-xl cursor-pointer" />
                  </Link>
               </Tooltip>
            </div>

            <div className="h-[480px] overflow-auto">
               <div ref={contentRef} className="relative  p-6 rounded shadow">
                  <div
                     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-30deg]
                text-green-800 font-bold text-6xl border-2 border-green-800
  px-8 py-4 opacity-40 select-none pointer-events-none
                whitespace-nowrap inline-block"
                  >
                     CFS NOTICE PAID
                  </div>

                  {/* Bill Content */}
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <img
                           src="/img/internet.png"
                           alt="CFS Logo"
                           className="w-16 h-16"
                        />
                        <div className="text-sm mt-1">
                           #2, Manguelod Bldg. National High Way
                           <br />
                           District II, Tumauini, Isabela
                           <br />
                           TIN: 295-973-965-001
                           <br />
                           CP#: 09453367030
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="font-bold">
                           {transaction.customer_plan.customer.firstname}{" "}
                           {transaction.customer_plan.customer.middlename ?? ""}
                           {transaction.customer_plan.customer.lastname}{" "}
                        </p>
                        <p>
                           {transaction.created_at
                              ? format(
                                   new Date(transaction.date_billing),
                                   "MMMM dd, yyyy"
                                )
                              : ""}
                        </p>
                     </div>
                  </div>

                  <div className="flex justify-between mb-2">
                     <span>Acct. No:</span>
                     <span>{transaction.customer_plan.customer.id}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                     <span>Bill No.</span>
                     <span>{transaction.bill_no}</span>
                  </div>

                  <div className="space-y-1 mb-4">
                     <div className="flex justify-between">
                        <span>Bill for the month of August</span>
                        <span>₱{transaction.bill_amount}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Rebate</span>
                        <span>₱{transaction.rebate ?? 0.0}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Payment</span>
                        <span>₱{transaction.partial}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Outstanding Balance Previous Month</span>
                        <span>₱{latest.balance ?? 0.0}</span>
                     </div>
                     <div className="flex justify-between font-bold border-t border-gray-400 pt-2">
                        <span>Total Amount Due:</span>
                        <span>₱{transaction.bill_amount}</span>
                     </div>
                  </div>

                  <div className="flex justify-between text-sm mb-4">
                     <span>Prepared by: John</span>
                     <span>
                        Collector:{" "}
                        {transaction.customer_plan.collector.firstname}{" "}
                        {transaction.customer_plan.collector.middlename ?? ""}
                        {transaction.customer_plan.collector.lastname}{" "}
                     </span>
                     <p>
                        {transaction.created_at
                           ? format(
                                new Date(transaction.created_at),
                                "MMMM dd, yyyy"
                             )
                           : ""}
                     </p>
                  </div>

                  <div className="border border-red-500 p-3 rounded text-sm bg-red-50 flex items-start gap-2">
                     <div className="text-red-600 font-bold">⚠</div>
                     <div>
                        <p>
                           7 Days Notice: To avoid temporary disconnection
                           kindly settle your bill within 7 days of the due
                           date. For assistance or to make a payment please
                           call:
                        </p>
                        <p className="font-bold">
                           CUSTOMER SERVICE NO: 09453367030
                        </p>
                        <p className="font-bold">
                           BILLING DEPT. CP NO: 09162832206
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex justify-end mt-3 mb-5">
               <Link href="/transactions" className="mr-2">
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
