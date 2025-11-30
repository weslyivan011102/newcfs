import { CgDanger } from "react-icons/cg";
import { BsArrowReturnLeft } from "react-icons/bs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
   Card,
   Input,
   Checkbox,
   Button,
   Typography,
   IconButton,
   Textarea,
   Tooltip,
   Dialog,
   DialogHeader,
   DialogBody,
   DialogFooter,
   Radio,
   Spinner,
   Menu,
   MenuHandler,
   MenuList,
   MenuItem,
} from "@material-tailwind/react";
import Select from "react-select";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import UseAppUrl from "@/hooks/UseAppUrl";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";

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
const descriptionOptions = Object.entries(MONTH_LABELS).map(([key, label]) => ({
   value: key,
   label: label,
}));


const Create = ({ collectors }) => {
   const API_URL = UseAppUrl();
   const [selectedCustomerId, setSelectedCustomerId] = useState(null);
   const [selectedCustomerPlan, setSelectedCustomerPlan] = useState({});
   const [billingType, setBillingType] = useState("batch");
   const [transactionResponse, setTransactionResponse] = useState(null);
   const [selectedCollectorId, setSelectedCollectorId] = useState("");
   const [searchCustomer, setSearchCustomer] = useState("");

   const [billNo, setBillNo] = useState("");

   const contentRef = useRef();
   const reactToPrintFn = useReactToPrint({ contentRef });

   const fetchCustomers = async ({ queryKey }) => {
      const [_key, page, query, sortColumn, sortDirection] = queryKey;
      const response = await axios.get(
         `${API_URL}/api/customers/transactions`,
         {
            params: {
               page,
               search: query,
               sortColumn,
               sortDirection,
            },
         }
      );
      //console.log(response.data);
      return response.data;
   };

   const fetchCustomerTransactions = async ({ queryKey }) => {
      const [_key, page, sortColumn, sortDirection, customerId] = queryKey;

      if (!customerId) return { data: [], current_page: 1 }; // skip fetch if not selected

      const response = await axios.get(
         `${API_URL}/api/customers/transactions`,
         {
            params: {
               page,
               search: customerId,
               sortColumn,
               sortDirection,
            },
         }
      );

      return response.data;
   };

   const { customers } = usePage().props;
   const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(customers?.current_page || 1);
   const [sortConfig, setSortConfig] = useState({
      column: "",
      direction: "asc",
   });

   const { customer_transactions } = usePage().props;
   const [searchTransQuery, setSearchTransQuery] = useState("");
   const [currentTransPage, setCurrentTransPage] = useState(
      customer_transactions?.current_page || 1
   );
   const [sortTransConfig, setSortTransConfig] = useState({
      column: "",
      direction: "asc",
   });

   const {
      data: customerData,
      error,
      isLoading,
      refetch,
   } = useQuery({
      queryKey: [
         "customers",
         currentPage,
         searchCustomer, // 👈 now using searchCustomer
         sortConfig.column,
         sortConfig.direction,
      ],
      queryFn: fetchCustomers,
      keepPreviousData: true,
   });

   const {
      data: customerTransactionsData,
      isTransLoading,
      refetch: refetchTransData,
   } = useQuery({
      queryKey: [
         "customer-transactions",
         currentPage,
         sortConfig.column,
         sortConfig.direction,
         selectedCustomerId, // pass the selected ID here
      ],
      queryFn: fetchCustomerTransactions,
      enabled: !!selectedCustomerId, // only run query if ID is not null
      keepPreviousData: true,
   });

   const [open, setOpen] = useState(false);
   const handleOpen = () => setOpen(!open);

   const [openModalPrint, setOpenModalPrint] = useState(false);
   const handleOpenModalPrint = () => {
      setOpenModalPrint(!openModalPrint);
   };

   const fetchBillNo = async () => {
      try {
         const res = await axios.get(
            `${API_URL}/api/transactions/generate-bill-no`
         );
         setBillNo(res.data.bill_no);
         setData("bill_no", res.data.bill_no);
      } catch (error) {
         console.error("Failed to fetch new bill number", error);
      }
   };

   const { data, setData, post, errors, reset, processing } = useForm({
   customer_plan_id: "",
   collector_id: "",
   bill_no: billNo,
   rebate: "",
   partial: "",
   bill_amount: "",
   remarks: "batch",
   status: "",
   date_billing: "",
   description: "n/a",  // default value
   mode_payment: "N/A",
});


   const onSubmit = async (e) => {
      e.preventDefault();

      // validation checks...

      const computedBillAmount =
         Number(selectedCustomerPlan?.plan_price || 0) -
         Number(data.rebate || 0);

      const submitData = {
         ...data,
         bill_amount: computedBillAmount,
         rebate: Number(data.rebate) || 0.0,
         partial: Number(data.partial) || 0.0,
      };

      try {
         const response = await axios.post(
            `${API_URL}/api/transactions`,
            submitData  
         );

         // ✅ Open the print page in a new tab
         const transactionId = response.data.transaction.id;
         window.open(`/admin/transactions/print/${transactionId}`, "_blank");

         window.location.reload();
      } catch (error) {
         console.error("Error creating transaction:", error.response || error);
         alert("Failed to create transaction. Check console for details.");
      }
   };

   const TABLE_HEAD = ["Month", "Bill Noww.", "Bill Amount", "Status"];
   const THEAD_CUSTOMERS = ["Acc No.", "Customer Name", "Status"];

   const StatusOptions = [
      { value: "N/A", label: "N/A"},
      { value: "Paid", label: "Paid" },
      { value: "Unpaid", label: "Unpaid" },
   ];

   const ModePaymentOptons = [
      { value: "N/A", label: "N/A"},
      { value: "Cash", label: "Cash"},
      { value: "Gcash", label: "Gcash"},
   ]

   const TROW_CUSTOMERS =
      customerData?.data.map((customer) => {
         return {
            id: customer.id,
            customer_name: `${customer.lastname} ${customer.firstname} ${
               customer.middlename ?? ""
            }`,
            firstname: customer.firstname,
            middlename: customer.middlename,
            lastname: customer.lastname,
            address: customer.address,
            contact_no: customer.contact_no,
            sex: customer.sex,
            marital_status: customer.marital_status,
            birthdate: customer.birthdate,
            occupation: customer.occupation,
            mode_payment: customer.mode_payment,
            status: customer.status,

            plans: customer.customer_plans.map((plan) => {
               // get last transaction (by created_at)
               const lastTransaction = plan.transactions.length
                  ? [...plan.transactions].sort(
                       (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )[0]
                  : null;

               let balance = null;
               let balanceMonth = null;

               if (lastTransaction) {
                  balance =
                     Number(lastTransaction.bill_amount) -
                     Number(lastTransaction.partial);

                  balanceMonth = dayjs(lastTransaction.created_at).format(
                     "MMMM"
                  );
               }

               return {
                  customer_plan_id: plan.id,
                  mbps: plan.plan.mbps,
                  plan_price: plan.plan.plan_price,
                  date_registration: plan.date_registration,

                  // ✅ include API fields
                  latest_balance: plan.latest_balance,
                  latest_balance_month: plan.latest_balance_month,

                  // include transactions
                  transactions: plan.transactions.map((trx) => ({
                     id: trx.id,
                     bill_no: trx.bill_no,
                     rebate: trx.rebate,
                     partial: trx.partial,
                     bill_amount: trx.bill_amount,
                     remarks: trx.remarks,
                     status: trx.status,
                     mode_payment: trx.mode_payment,
                     created_at: trx.created_at,
                  })),

                  // last transaction summary
                  last_transaction: lastTransaction,
                  balance,
                  balanceMonth,

                  // Extract and include the collector_id
                  collector_id: plan.collector_id, // Add this line to extract collector_id
               };
            }),
         };
      }) || [];

   const TROW_TRANSACTIONS =
      customerTransactionsData?.data.map((customer) => ({
         id: customer.id,
         customer_name: `${customer.lastname} ${customer.firstname} ${
            customer.middlename ?? ""
         }`,
         firstname: customer.firstname,
         middlename: customer.middlename,
         lastname: customer.lastname,
         address: customer.address,
         contact_no: customer.contact_no,
         sex: customer.sex,
         marital_status: customer.marital_status,
         birthdate: customer.birthdate,
         occupation: customer.occupation,
         status: customer.status,
         plans: customer.customer_plans.map((plan) => ({
            customer_plan_id: plan.id,
            collector_id: plan.collector_id,
            mbps: plan.plan.mbps,
            plan_price: plan.plan.plan_price,
            date_registration: plan.date_registration,
            transactions: plan.transactions.map((tx) => ({
               id: tx.id,
               bill_no: tx.bill_no,
               rebate: Number(tx.rebate) || 0.0,
               partial: Number(tx.partial) || 0.0,
               bill_amount: Number(tx.bill_amount) || 0.0,
               remarks: tx.remarks,
               mode_payment: tx.mode_payment,
               status: tx.status,
               created_at: tx.created_at,
               updated_at: tx.updated_at,
            })),
         })),
      })) || [];

   useEffect(() => {
      fetchBillNo();
   }, []);

   useEffect(() => {
      if (selectedCustomerId !== null) {
         alert(`Selected Customer: ${selectedCustomerPlan.customer_name}`);
      }
   }, [selectedCustomerId, selectedCustomerPlan]);

   useEffect(() => {
      if (selectedCustomerPlan?.customer_plan_id) {
         setData("customer_plan_id", selectedCustomerPlan.customer_plan_id);
      }
      if (selectedCustomerPlan?.collector_id) {
         setData("collector_id", selectedCustomerPlan.collector_id);
      }
   }, [selectedCustomerPlan]);

   useEffect(() => {
   if (data.date_billing) {
      const monthIndex = new Date(data.date_billing).getMonth(); 
      const monthNames = [
         "january","february","march","april","may","june",
         "july","august","september","october","november","december"
      ];
      const monthKey = monthNames[monthIndex] || "n/a";
      setData("description", monthKey);
   }
}, [data.date_billing]);


   const handleSelectCustomer = (customer) => {
      const latestPlan = customer.plans[0] || {};

      setSelectedCustomerId(customer.id);
      setData("customer_plan_id", latestPlan.customer_plan_id);
      setData("collector_id", latestPlan.collector_id);

      setSelectedCustomerPlan({
         customer_name: `${customer.firstname} ${customer.lastname}`,
         customer_plan_id: latestPlan.customer_plan_id,
         mbps: latestPlan.mbps || "N/A",
         plan_price: latestPlan.plan_price || "N/A",
         date_registration: latestPlan.date_registration || "N/A",
         latest_balance: latestPlan.latest_balance || 0,
         latest_balance_month: latestPlan.latest_balance_month || "N/A",
         collector_id: latestPlan.collector_id || "",
      });

      setOpen(false);
   };

   const handleBillingChange = (event) => {
      const selected = event.target.value;
      setBillingType(selected); // ✅ update the state for checked binding
      setData("remarks", selected); // ✅ also update the form data
      // alert(`Selected Billing Type: ${selected}`);
   };

   return (
      <AuthenticatedLayout>
         <Head title="Create New Bill" />
         <div className="bg-white overflow-y-auto max-h-[590px] grid place-justify-center ">
            <div className="flex justify-between mt-5 mb-2 px-4">
               <div className="flex gap-10">
                  {/* <Radio
                     name="type"
                     label="Advance Billing"
                     value="advance"
                     checked={billingType === "advance"}
                     onChange={handleBillingChange}
                  /> */}
                  <Radio
                     name="type"
                     label="Batch Billing"
                     value="batch"
                     checked={billingType === "batch"}
                     onChange={handleBillingChange}
                  />
               </div>

               <Tooltip content="Back">
                  <Link
                     href="/admin/transactions"
                     className="hover:bg-gray-200 px-2 py-1 rounded"
                  >
                     <BsArrowReturnLeft className="text-xl cursor-pointer" />
                  </Link>
               </Tooltip>
            </div>

            {/* dialog modal print */}
            <Dialog
               open={openModalPrint}
               handler={handleOpenModalPrint}
               size="lg"
            >
               <DialogHeader>Billing Notice</DialogHeader>

               <DialogBody>
                  <div className="h-[480px] overflow-auto">
                     <div
                        ref={contentRef}
                        className="relative  p-6 rounded shadow"
                     >
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
                                 {transactionResponse?.customer
                                    ? [
                                         transactionResponse.customer
                                            ?.firstname,
                                         transactionResponse.customer
                                            ?.middlename,
                                         transactionResponse.customer?.lastname,
                                      ]
                                         .filter(Boolean) // removes null/empty middlename
                                         .join(" ")
                                    : ""}
                              </p>

                              <p>
                                 {transactionResponse?.transaction?.created_at
                                    ? format(
                                         new Date(
                                            transactionResponse.transaction.created_at
                                         ),
                                         "MMMM dd, yyyy"
                                      )
                                    : ""}
                              </p>
                           </div>
                        </div>

                        <div className="flex justify-between mb-2">
                           <span>Acct. No:</span>
                           <span>
                              {transactionResponse?.transaction?.customer_plan
                                 ?.customer_id ?? ""}
                           </span>
                        </div>
                        <div className="flex justify-between mb-4">
                           <span>Bill No.</span>
                           <span>
                              {transactionResponse?.transaction?.bill_no ?? ""}
                           </span>
                        </div>
                        <div className="space-y-1 mb-4">
                           <div className="flex justify-between">
                              <span>Bill for the month of August</span>
                              <span>
                                 ₱{" "}
                                 {transactionResponse?.transaction
                                    ?.bill_amount ?? "0.00"}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span>Rebate</span>
                              <span>
                                 ₱{" "}
                                 {transactionResponse?.transaction?.rebate ??
                                    "0.00"}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span>Partial</span>
                              <span>
                                 ₱{" "}
                                 {transactionResponse?.transaction?.partial ??
                                    "0.00"}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span>Outstanding Balance Previous Month</span>
                              <span>
                                 ₱{" "}
                                 {transactionResponse?.outstanding_balance ??
                                    "0.00"}
                              </span>
                           </div>
                           <div className="flex justify-between font-bold border-t border-gray-400 pt-2">
                              <span>Amount Due:</span>
                              <span>
                                 ₱{" "}
                                 {transactionResponse?.transaction
                                    ?.bill_amount ?? "0.00"}
                              </span>
                           </div>
                        </div>

                        <div className="flex justify-between text-sm mb-4">
                           <span>Prepared by: John</span>
                           <span>
                              Collector:{" "}
                              {transactionResponse?.customer
                                 ? [
                                      transactionResponse.collector?.firstname,
                                      transactionResponse.collector?.middlename,
                                      transactionResponse.collector?.lastname,
                                   ]
                                      .filter(Boolean) // removes null/empty middlename
                                      .join(" ")
                                 : ""}
                           </span>
                           <span>
                              Date:{" "}
                              {transactionResponse?.transaction?.created_at
                                 ? format(
                                      new Date(
                                         transactionResponse.transaction.created_at
                                      ),
                                      "MMMM dd, yyyy"
                                   )
                                 : ""}
                           </span>
                        </div>

                        <div className="border border-red-500 p-3 rounded text-sm bg-red-50 flex items-start gap-2">
                           <div className="text-red-600 font-bold">⚠</div>
                           <div>
                              <p>
                                 7 Days Notice: To avoid temporary disconnection
                                 kindly settle your bill within 7 days of the
                                 due date. For assistance or to make a payment
                                 please call:
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
               </DialogBody>

               <DialogFooter>
                  <Button
                     variant="text"
                     color="red"
                     onClick={handleOpenModalPrint}
                     className="mr-2"
                  >
                     Cancel
                  </Button>
                  <Button
                     variant="gradient"
                     color="green"
                     onClick={() => reactToPrintFn()}
                  >
                     Print
                  </Button>
               </DialogFooter>
            </Dialog>

            <div className="flex justify-between items-center px-4">
               <div className="flex gap-6 px-4">
                  <Typography variant="h6" color="blue-gray">
                     ACC NO.:{" "}
                     <span className="text-orange-900">
                        {selectedCustomerId}
                     </span>
                  </Typography>
                  <Typography variant="h6" color="blue-gray">
                     CUSTOMER:{" "}
                     <span className="text-orange-900">
                        {selectedCustomerPlan?.customer_name || ""}
                        -- {selectedCustomerPlan?.collector_id || ""}
                     </span>
                  </Typography>
                  <Typography variant="h6" color="blue-gray">
                     PLAN:{" "}
                     <span className="text-orange-900">
                        {selectedCustomerPlan && selectedCustomerPlan.mbps
                           ? `${
                                selectedCustomerPlan.mbps
                             } mbps - ${new Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: "PHP",
                             }).format(selectedCustomerPlan.plan_price)}`
                           : ""}
                     </span>
                  </Typography>

                  <Typography variant="h6" color="blue-gray">
                     REGISTRATION:{" "}
                     <span className="text-orange-900">
                        {selectedCustomerPlan.date_registration}
                     </span>
                  </Typography>
                  <Typography variant="h6" color="blue-gray">
                     BALANCE OF {selectedCustomerPlan.latest_balance_month}:{" "}
                     <span className="text-orange-900">
                        {selectedCustomerPlan.latest_balance}
                     </span>
                  </Typography>
               </div>
               <div>
                  <Button onClick={handleOpen} variant="gradient">
                     New Bill
                  </Button>
                  <Dialog open={open} handler={handleOpen}>
                     <DialogBody>
                        <Card className="h-[480px] w-full overflow-scroll">
                           <div className="mb-6">
                              <Typography variant="h6" color="blue-gray">
                                 SEARCH CUSTOMER
                              </Typography>
                              <input
                                 className="w-96 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                 placeholder="Search lastname..."
                                 value={searchCustomer}
                                 onChange={(e) =>
                                    setSearchCustomer(e.target.value)
                                 } // 👈 bind state
                              />
                           </div>
                           <table className="w-full min-w-max table-auto text-left">
                              <thead>
                                 <tr>
                                    {THEAD_CUSTOMERS.map((head) => (
                                       <th
                                          key={head}
                                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                       >
                                          <Typography
                                             variant="small"
                                             color="blue-gray"
                                             className="font-normal leading-none opacity-70"
                                          >
                                             {head}
                                          </Typography>
                                       </th>
                                    ))}
                                 </tr>
                              </thead>
                              <tbody>
                                 {isLoading ? (
                                    <tr>
                                       <td
                                          colSpan={THEAD_CUSTOMERS.length}
                                          className="border border-blue-gray-100 p-4"
                                       >
                                          <div className="flex justify-center items-center h-full">
                                             <Spinner
                                                className="h-10 w-10"
                                                color="green"
                                             />
                                          </div>
                                       </td>
                                    </tr>
                                 ) : TROW_CUSTOMERS.length === 0 ? (
                                    <tr>
                                       <td
                                          colSpan={TABLE_HEAD.length}
                                          className="border border-blue-gray-100 p-4 text-center text-red-500"
                                       >
                                          <div className="flex justify-center items-center gap-2">
                                             No customer records found
                                             <CgDanger className="text-xl" />
                                          </div>
                                       </td>
                                    </tr>
                                 ) : (
                                    TROW_CUSTOMERS.map((customer) => {
                                       const {
                                          id,
                                          customer_name,
                                          status,
                                          plans,
                                       } = customer;

                                       return (
                                          <tr
                                             key={id}
                                             className="hover:bg-blue-gray-50 cursor-pointer"
                                             onClick={() =>
                                                handleSelectCustomer(customer)
                                             }
                                          >
                                             <td className="border border-blue-gray-100 px-4 py-2 ">
                                                <Typography
                                                   variant="small"
                                                   className="font-normal text-gray-800"
                                                >
                                                   {id}
                                                </Typography>
                                             </td>
                                             <td className="border border-blue-gray-100 px-4 py-2 ">
                                                <Typography
                                                   variant="small"
                                                   className="font-normal text-gray-800"
                                                >
                                                   {customer_name}
                                                </Typography>
                                             </td>
                                             <td className="border border-blue-gray-100 px-4 py-2 ">
                                                <Typography
                                                   variant="small"
                                                   className="font-normal text-gray-800"
                                                >
                                                   {status}
                                                </Typography>
                                             </td>
                                          </tr>
                                       );
                                    })
                                 )}
                              </tbody>
                           </table>
                        </Card>
                     </DialogBody>
                  </Dialog>
               </div>
            </div>
            <hr />
            <div className="flex flex-col lg:flex-row gap-1">
               {/* Transaction Card */}
               <div className="w-full lg:w-[60%] h-[480px] overflow-auto p-4 border-2 border-sky-500">
                  <Typography variant="h6" color="blue-gray">
                     ALL TRANSACTION
                  </Typography>
                  <table className="w-full min-w-max table-auto text-left">
                     <thead>
                        <tr>
                           <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                              Month
                           </th>
                           <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                              Bill No
                           </th>
                           <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                              Partial
                           </th>
                           <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                              Total Amount Paid
                           </th>
                           <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                              Remarks
                           </th>
                           <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                              Status
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {isLoading ? (
                           <tr>
                              <td colSpan={4} className="border p-4">
                                 <div className="flex justify-center items-center h-full">
                                    <Spinner
                                       className="h-10 w-10"
                                       color="green"
                                    />
                                 </div>
                              </td>
                           </tr>
                        ) : TROW_TRANSACTIONS.length === 0 ? (
                           <tr>
                              <td
                                 colSpan={6}
                                 className="border p-4 text-center text-red-500"
                              >
                                 No transaction records found
                              </td>
                           </tr>
                        ) : (
                           TROW_TRANSACTIONS.map((customer) =>
                              customer.plans.flatMap((plan) =>
                                 plan.transactions.map((tx) => (
                                    <tr
                                       key={tx.id}
                                       className="hover:bg-blue-gray-50"
                                    >
                                       <td className="border px-4 py-2">
                                          {new Date(
                                             tx.created_at
                                          ).toLocaleDateString("en-US")}
                                       </td>
                                       <td className="border px-4 py-2">
                                          {tx.bill_no}
                                       </td>
                                       <td className="border px-4 py-2">
                                          {new Intl.NumberFormat("en-PH", {
                                             style: "currency",
                                             currency: "PHP",
                                          }).format(tx.partial)}
                                       </td>
                                       <td className="border px-4 py-2">
                                          {new Intl.NumberFormat("en-PH", {
                                             style: "currency",
                                             currency: "PHP",
                                          }).format(tx.bill_amount)}
                                       </td>
                                       <td className="border px-4 py-2">
                                          {tx.remarks}
                                       </td>
                                       <td className="border px-4 py-2">
                                          {tx.status}
                                       </td>
                                    </tr>
                                 ))
                              )
                           )
                        )}
                     </tbody>
                  </table>
               </div>

               {/* Form Card */}
               <div className="w-full lg:w-[35%] p-4 overflow-auto shadow-md rounded-md border-2 border-sky-500">
                  <form onSubmit={onSubmit}>
                     <input
                        type="hidden"
                        value={data.customer_plan_id}
                        onChange={(e) =>
                           setData("customer_plan_id", e.target.value)
                        }
                        className="mb-2"
                     />

                     <input
                        type="hidden"
                        value={data.collector_id}
                        onChange={(e) =>
                           setData("collector__id", e.target.value)
                        }
                        className="mb-2"
                     />
                     <div className="mb-1">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Acc No.
                        </Typography>
                        <Input
                           size="md"
                           value={data.customer_plan_id}
                           disabled
                           className="mb-3"
                        />
                     </div>
                     <div className="mb-1">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Bill No.
                        </Typography>
                        <Input
                           size="md"
                           value={data.bill_no}
                           disabled
                           className="mb-3"
                        />
                     </div>
                     <div className="mb-1">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Bill Amount
                        </Typography>
                        <Input
                           size="md"
                           value={
                              selectedCustomerPlan && selectedCustomerPlan.mbps
                                 ? selectedCustomerPlan.plan_price
                                 : ""
                           }
                           disabled
                           className="mb-3"
                        />
                     </div>
                     <div className="mb-1">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Outstanding Balance Previous Month
                        </Typography>
                        <Input
                           size="md"
                           value={selectedCustomerPlan.latest_balance}
                           disabled
                           className="mb-3"
                        />
                     </div>
                     <div className="mb-1">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Rebate
                        </Typography>
                        <Input
                           type="number"
                           size="md"
                           value={data.rebate || ""}
                           onChange={(e) => {
                              const value = Number(e.target.value);
                              const max = Number(
                                 selectedCustomerPlan.plan_price
                              );

                              if (value > max) {
                                 alert(
                                    `Rebate cannot be greater than Plan Price (${max}).`
                                 );
                                 setData("rebate", max); // reset to plan price
                              } else {
                                 setData("rebate", value);
                              }
                           }}
                           className="mb-3"
                           onWheel={(e) => e.target.blur()}
                        />
                     </div>
                     <div className="mb-1">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Total Amount Due
                        </Typography>
                        <Input
                           type="number"
                           size="md"
                           value={
                                 Number(selectedCustomerPlan.plan_price || 0) -
                                 Number(data.rebate || 0) +
                                 Number(selectedCustomerPlan.latest_balance || 0)
                           }
                           onChange={(e) =>
                              setData("bill_amount", e.target.value)
                           }
                           className="mb-3"
                           disabled
                        />
                     </div>
                     <div className="mb-1">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Payment
                        </Typography>
                        <Input
                           type="number"
                           size="md"
                           value={data.partial || ""}
                           onChange={(e) => {
                              const value = Number(e.target.value);
                              const computedTotal =
                                 Number(selectedCustomerPlan.plan_price || 0) -
                                 Number(data.rebate || 0) +
                                 Number(selectedCustomerPlan.latest_balance || 0)   

                              if (value > computedTotal) {
                                 alert(
                                    `Partial cannot be greater than Total Amount Paid (${computedTotal}).`
                                 );
                                 setData("partial", computedTotal); // reset to exact computed total
                              } else {
                                 setData("partial", value);
                              }
                           }}
                           className="mb-3"
                           onWheel={(e) => e.target.blur()}
                        />
                     </div>
                     <div className="mb-1">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Outstanding Balance
                        </Typography>
                        <Input
                           size="md"
                           value={
                              Number(data.partial) ===
                              Number(selectedCustomerPlan.plan_price)
                                 ? 0
                                 : Math.max(
                                      0,
                                      Number(selectedCustomerPlan.plan_price) -
                                         Number(data.rebate || 0) -
                                         (Number(data.partial || 0) +
                                          Number(data.bill_amount  || 0))
                                   )
                           }
                           disabled
                           className="mb-3"
                        />
                     </div>
                     <div className="mb-3">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Date Billing
                        </Typography>
                        <Input
                           size="md"
                           type="date"
                           value={data.date_billing}
                           onChange={(e) =>
                              setData("date_billing", e.target.value)
                           }
                           error={Boolean(errors.date_billing)}
                           className="w-full"
                        />
                     </div>
                     <div className="mb-3">
                        <Typography variant="paragraph" color="blue-gray" className="mb-1">
                           Description
                        </Typography>
                        <Select
                           options={descriptionOptions}
                           value={descriptionOptions.find(opt => opt.value === data.description)}
                           onChange={(selected) =>
                              setData("description", selected ? selected.value : "n/a")
                           }
                           placeholder="Select Description"
                           className="mb-3"
                        />
                     </div>
                     <div className="mb-1">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Payment Mode
                        </Typography>
                        <Select
                           options={ModePaymentOptons}
                           placeholder="Choose a Payment Mode"
                           value={ModePaymentOptons.find(
                              (option) => option.value === data.mode_payment
                           )}
                           onChange={(selected) =>
                              setData("mode_payment", selected ? selected.value : "")
                           }
                           className="mb-3"
                        />
                     </div>
                     <div className="mb-1">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Status
                        </Typography>
                        <Select
                           options={StatusOptions}
                           placeholder="Choose a status"
                           value={StatusOptions.find(
                              (option) => option.value === data.status
                           )}
                           onChange={(selected) =>
                              setData("status", selected ? selected.value : "")
                           }
                           className="mb-3"
                        />
                     </div>
                     <Button
                        type="submit"
                        disabled={processing}
                        color="blue"
                        fullWidth
                     >
                        Save
                     </Button>
                  </form>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Create;
