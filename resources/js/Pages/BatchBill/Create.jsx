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
import { useEffect, useState } from "react";
import axios from "axios";
import UseAppUrl from "@/hooks/UseAppUrl";
import { useQuery } from "@tanstack/react-query";

const Create = ({ collectors, generated_bill_no }) => {
   const API_URL = UseAppUrl();
   const [selectedCustomerId, setSelectedCustomerId] = useState(null);
   const [selectedCustomerPlan, setSelectedCustomerPlan] = useState({});

   const [billingType, setBillingType] = useState("");

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
         searchQuery,
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

   const { data, setData, post, errors, reset, processing } = useForm({
      customer_plan_id: "",
      bill_no: generated_bill_no,
      rebate: "",
      partial: "",
      bill_amount: "",
      remarks: "",
      status: "",
   });

   const onSubmit = async (e) => {
      e.preventDefault();

      // Client-side validation for required fields
      if (!data.customer_plan_id || Number(data.customer_plan_id) <= 0) {
         alert("Please select a customer.");
         return;
      }

      if (!data.remarks?.trim()) {
         alert("Choose a billing type.");
         return;
      }

      if (!data.partial || Number(data.partial) <= 0) {
         alert("Partial payment is required");
         return;
      }

      if (!data.status?.trim()) {
         alert("Status is required.");
         return;
      }

      // Ensure numeric values
      const submitData = {
         ...data,
         bill_amount: Number(data.bill_amount) || 0.0,
         rebate: Number(data.rebate) || 0.0,
         partial: Number(data.partial) || 0.0,
      };

      try {
         console.log(
            "Form data to submit:",
            JSON.stringify(submitData, null, 2)
         );

         const response = await axios.post(
            `${API_URL}/api/transactions`,
            submitData
         );

         console.log("Response:", response.data);
         setOpenModalPrint(true);

         // Reset form
         setData("bill_amount", "");
         refetchTransData();
      } catch (error) {
         console.error("Error creating transaction:", error.response || error);
         alert("Failed to create transaction. Check console for details.");
      }
   };

   const TABLE_HEAD = ["Month", "Bill Noww.", "Bill Amount", "Status"];
   const THEAD_CUSTOMERS = ["Acc No.", "Customer Name", "Status"];

   const StatusOptions = [
      { value: "paid", label: "Paid" },
      { value: "unpaid", label: "Unpaid" },
   ];

   const TROW_CUSTOMERS =
      customerData?.data.map((customer) => ({
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
            mbps: plan.plan.mbps,
            plan_price: plan.plan.plan_price,
            date_registration: plan.date_registration,
            customer_plan_id: plan.id,
         })),
      })) || [];

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
               status: tx.status,
               created_at: tx.created_at,
               updated_at: tx.updated_at,
            })),
         })),
      })) || [];

   useEffect(() => {
      if (selectedCustomerId !== null) {
         alert(`Selected Customer: ${selectedCustomerPlan.customer_name}`);

         // alert(
         //    `Customer: ${selectedCustomerPlan.customer_name}\n` +
         //       `Selected Customer ID: ${selectedCustomerId}\n` +
         //       `Customer Plan Id: ${selectedCustomerPlan.customer_plan_id}\n` +
         //       `Plan: ${selectedCustomerPlan.mbps} Mbps\n` +
         //       `Price: ₱${selectedCustomerPlan.plan_price}\n` +
         //       `Registered: ${selectedCustomerPlan.date_registration}`
         // );
      }
   }, [selectedCustomerId, selectedCustomerPlan]);

   const handleSelectCustomer = (customer) => {
      const latestPlan = customer.plans[0] || {};

      setSelectedCustomerId(customer.id);
      setData("customer_plan_id", latestPlan.customer_plan_id);
      setSelectedCustomerPlan({
         customer_name: `${customer.firstname} ${customer.lastname}`,
         customer_plan_id: latestPlan.customer_plan_id,
         mbps: latestPlan.mbps || "N/A",
         plan_price: latestPlan.plan_price || "N/A",
         date_registration: latestPlan.date_registration || "N/A",
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
                  <Radio
                     name="type"
                     label="Advance Billing"
                     value="advance"
                     checked={billingType === "advance"}
                     onChange={handleBillingChange}
                  />
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
                     href="/batch_bills"
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
                  <div className="relative bg-gray-100 p-6 rounded shadow h-[480px] overflow-auto">
                     {/* Diagonal Stamp */}

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
                           <p className="font-bold">Wesly Ivan Gaffud</p>
                           <p>August 1, 2025</p>
                        </div>
                     </div>

                     <div className="flex justify-between mb-2">
                        <span>Acct. No:</span>
                        <span>1258</span>
                     </div>
                     <div className="flex justify-between mb-4">
                        <span>Bill No.</span>
                        <span>2510000</span>
                     </div>

                     <div className="space-y-1 mb-4">
                        <div className="flex justify-between">
                           <span>Bill for the month of August</span>
                           <span>₱800.00</span>
                        </div>
                        <div className="flex justify-between">
                           <span>Rebate</span>
                           <span>₱0.00</span>
                        </div>
                        <div className="flex justify-between">
                           <span>Partial</span>
                           <span>₱0.00</span>
                        </div>
                        <div className="flex justify-between">
                           <span>Outstanding Balance Previous Month</span>
                           <span>₱300.00</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-gray-400 pt-2">
                           <span>Amount Due:</span>
                           <span>₱1,100.00</span>
                        </div>
                     </div>

                     <div className="flex justify-between text-sm mb-4">
                        <span>Prepared by: John</span>
                        <span>Collector: John Robert Linerto</span>
                        <span>Date:</span>
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
                     onClick={handleOpenModalPrint}
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
                     BALANCE OF JULY:{" "}
                     <span className="text-orange-900">1.5m</span>
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
                              Bill Amount
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
                                 colSpan={5}
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
                           Partial
                        </Typography>
                        <Input
                           type="number"
                           size="md"
                           value={data.partial || ""}
                           onChange={(e) => {
                              const value = Number(e.target.value);
                              const max = Number(
                                 selectedCustomerPlan.plan_price
                              );

                              if (value > max) {
                                 alert(
                                    `Partial cannot be greater than Plan Price (${max}).`
                                 );
                                 setData("partial", max); // put back exact plan price
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
                           Total Amount Paid
                        </Typography>
                        <Input
                           type="number"
                           size="md"
                           value={
                              Number(selectedCustomerPlan.plan_price) -
                              Number(data.rebate || 0)
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
                                            Number(data.bill_amount || 0))
                                   )
                           }
                           disabled
                           className="mb-3"
                        />
                     </div>

                     {/* <div className="mb-1">
                        <Typography
                           variant="paragraph"
                           color="blue-gray"
                           className="mb-1 "
                        >
                           Change
                        </Typography>
                        <Input
                           size="md"
                           value={
                              Number(selectedCustomerPlan.plan_price) -
                              Number(data.partial)
                           }
                           disabled
                           className="mb-3"
                        />
                     </div> */}

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
