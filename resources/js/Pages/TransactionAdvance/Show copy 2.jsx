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
   const reactToPrintFn = useReactToPrint({
      contentRef,
      pageStyle: `
      @page {
         size: auto;
         margin: 10mm;
      }
      @media print {
         body {
            -webkit-print-color-adjust: exact !important;
         }
         .print-area {
            transform: scale(0.48);   /* ✅ scale down */
            transform-origin: top left; /* ✅ keep it aligned */
         }
      }
   `,
   });

   console.log("Transaction:", transaction);
   console.log("Collectors:", collectors);
   console.log("Latest:", latest);

   return (
      <AuthenticatedLayout>
         <Head title="Batch Bill" />
         <div className="flex justify-center mb-5">
            <Button
               variant="gradient"
               color="green"
               onClick={() => reactToPrintFn()}
            >
               Print
            </Button>
         </div>
         <div
            ref={contentRef}
            className="print-area max-w-md mx-auto bg-white p-6 border border-gray-300 rounded-md font-mono text-sm"
         >
            {/* Header */}
            <div className=" mb-4">
               <h2 className="font-bold text-lg">ANGIELEN AGCAOILI</h2>
               <p>September 02, 2025</p>
               <p>
                  #2, Manguelod Bldg. National High Way <br />
                  District II, Tumauini, Isabela
               </p>
            </div>

            {/* Info Section */}
            <div className="space-y-1 mb-4">
               <p>
                  TIN: <span className="ml-2">295-973-965-001</span>
               </p>
               <p>
                  CP#: <span className="ml-2">09453367030</span>
               </p>
               <p className="flex justify-between">
                  Acct. No: <span className="ml-2">149</span>
               </p>
               <p className="flex justify-between">
                  Bill No: <span className="ml-2">259-0007</span>
               </p>
               <p className="flex justify-between">
                  Bill for the month of August
                  <span className="ml-2 font-semibold">₱1200.00</span>
               </p>
               <p className="flex justify-between">
                  Rebate <span className="ml-2">₱0.00</span>
               </p>
               <p className="flex justify-between">
                  Partial <span className="ml-2">₱1000.00</span>
               </p>
               <p className="flex justify-between">
                  Outstanding <span className="ml-2">₱200</span>
               </p>
               <p className="flex justify-between">
                  Balance Previous Month<span className="ml-2">₱0.0</span>
               </p>
               <p className="font-bold flex justify-between">
                  Total Amount Due: <span className="ml-2">₱1400.00</span>
               </p>
            </div>

            {/* Prepared by */}
            <div className="mb-4">
               <p className="flex justify-between">
                  Prepared by: <span className="font-semibold">John</span>
               </p>
               <p className="flex justify-between">
                  Collector:{" "}
                  <span className="font-semibold">BALMAR BILIZARBARCELO</span>
               </p>
               <p>September 02, 2025</p>
            </div>

            {/* Notice */}
            <div className="mb-4">
               <p>
                  <span className="font-bold">7 Days Notice:</span> To avoid
                  temporary disconnection kindly settle your bill within 7 days
                  of the due date.
               </p>
            </div>

            {/* Contact Info */}
            <div>
               <p>For assistance or to make a payment please call:</p>
               <p className="font-bold">CUSTOMER SERVICE NO: 09453367030</p>
               <p className="font-bold">BILLING DEPT. CP NO: 09162832206</p>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Show;
