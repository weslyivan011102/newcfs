import { CgDanger } from "react-icons/cg";
import { AiOutlinePlus } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { format } from "date-fns";
import { AiOutlineRight } from "react-icons/ai";


import { Head, usePage, Deferred, Link } from "@inertiajs/react";
import {
   Avatar,
   Card,
   IconButton,
   Tooltip,
   Typography,
   Drawer,
   Button,
   Select,
   Option,
   Menu,
   MenuHandler,
   MenuList,
   MenuItem,
   Spinner,
   Input,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/Components/Pagination";
import axios from "axios";
import UseAppUrl from "@/hooks/UseAppUrl";

const TABLE_HEAD = [
   "Bill NO.",
   "Customer Name",
   "Mbps Plan",
   "Description",
   "Payment Mode",
   "Payment",
   "Total Amount Due",
   "Date Billing",
   "Payment Date",
   "Status",
   "Actions",
];
const Index = () => {
   const API_URL = UseAppUrl();
   const [batch, setBatch] = useState("");
   // const [month, setMonth] = useState();
   // const [year, setYear] = useState();
   


   const today = new Date();
   const [month, setMonth] = useState(today.getMonth() + 1); // ✅ months are 0-based
   const [year, setYear] = useState(today.getFullYear()); // ✅ full year

const handleSort = (column) => {
   setSortConfig((prev) => ({
      column: column,
      direction:
         prev.column === column && prev.direction === "asc"
            ? "desc"
            : "asc",
   }));
};

const SortIcon = ({ column }) => {
   if (sortConfig.column !== column) return <span>↕</span>;
   return sortConfig.direction === "asc" ? <span>▲</span> : <span>▼</span>;
};



   const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];

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

   const fetchBatchBills = async ({ queryKey }) => {
      const [_key, page, query, sortColumn, sortDirection, batch, month, year] =
         queryKey;
      const response = await axios.get(`${API_URL}/api/get_transactions`, {
         params: {
            page,
            search: query,
            sortColumn,
            sortDirection,
            batch,
            month,
            year,
         },
      });
      return response.data;
   };

   const { batch_bills } = usePage().props;

   const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(
      batch_bills?.current_page || 1
   );
   const [sortConfig, setSortConfig] = useState({
      column: "",
      direction: "desc",
   });

   const { data, error, isLoading, refetch } = useQuery({
      queryKey: [
         "batch_bills",
         currentPage,
         searchQuery,
         sortConfig.column,
         sortConfig.direction,
         batch,
         month,
         year,
      ],
      queryFn: fetchBatchBills,
      keepPreviousData: true,
   });

   // const TABLE_ROWS =
   //    data?.data.map((bill) => ({
   //       id: bill.id,
   //       bill_no: bill.bill_no,
   //       customer_name: `${bill.customer_plan.customer.lastname} ${
   //          bill.customer_plan.customer.firstname
   //       } ${bill.customer_plan.middlename ?? ""} `,
   //       mbps: bill.customer_plan.plan.mbps,
   //       plan_price: bill.customer_plan.plan.plan_price,
   //       amount: bill.bill_amount,
   //       date_billing: bill.date_billing,
   //       date_registration: bill.customer_plan.date_registration,
   //       partial: bill.partial,
   //       description: MONTH_LABELS[bill.description] || bill.description, // 👈 FIXED
   //       remarks: bill.remarks,
   //       description: bill.description,
   //       batch: bill.customer_plan.date_billing,
   //       status: bill.status,
   //       payment_date: bill.created_at,
   //    })) || [];

   const TABLE_ROWS =
   data?.data.map((bill) => ({
      id: bill.id,
      bill_no: bill.bill_no,

      customer_name: `${bill.customer_plan.customer.lastname} ${
         bill.customer_plan.customer.firstname
      } ${bill.customer_plan.middlename ?? ""}`,

      mbps: bill.customer_plan.plan.mbps,
      plan_price: bill.customer_plan.plan.plan_price,
      amount: bill.bill_amount,
      date_billing: bill.date_billing,

      // ✅ FIXED — use MONTH_LABELS to convert description
      description: MONTH_LABELS[bill.description] || bill.description,
      mode_payment: bill.mode_payment,

      remarks: bill.remarks,
      partial: bill.partial,
      batch: bill.customer_plan.date_billing,
      status: bill.status,
      payment_date: bill.created_at,
   })) || [];



   const handleSearch = (e) => {
      const value = e.target.value;
      setSearchQuery(value); // Update search query
      if (!value) {
         setCurrentPage(1); // Reset to first page if query is empty
      }
   };

   const handlePagination = (page) => {
      setCurrentPage(page);
   };

   const deleteBill = async (transactionID) => {
      const confirmDelete = window.confirm(
         "Are you sure you want to delete this bill transaction?"
      );
      if (confirmDelete) {
         try {
            const response = await axios.delete(
               `/admin/transactions/${transactionID}`
            );
            alert(response.data.message);
            refetch();
         } catch (error) {
            console.error(error);
            alert("An unexpected error occurred. Please try again later.");
         }
      }
   };

   const formatBillingDate = (batch) => {
      const map = {
         batch1: "Due1",
         batch2: "Due5",
         batch3: "Due10",
         batch4: "Due15",
         batch5: "Due25",
         all_cheque: "Due28-AllCheque",
      };
      return map[batch] || batch; // fallback if unknown
   };

   return (
      <AuthenticatedLayout>
         <Head title="CFS INTERNET NETWORK SOLUTIONS" />

         {/* //color bg-[#F6F6F6]  */}

         <div className="bg-white overflow-y-auto max-h-[590px]">
            <div className="mt-5  px-4">
               <div className="mb-6 flex justify-between items-center">
                  <div>
                     <div>
                        <Typography
                           variant="lead"
                           size="small"
                           className="mb-0 text-lg font-bold"
                        >
                           Billing Transactions
                        </Typography>
                        <Typography
                           className="text-sm"
                           variant="paragraph"
                           size="small"
                        >
                           Manage bills transactions
                        </Typography>
                     </div>
                     <nav className="flex items-center space-x-1 text-gray-600 text-sm mt-3">
                        <a
                           href="/admin/transactions"
                           className="font-bold text-blue-800"
                        >
                           Batch
                        </a>
                        <AiOutlineRight className="w-4 h-4" />
                        <a
                           href="/admin/transactions-advance"
                           className="hover:text-black"
                        >
                           Advance
                        </a>
                        <AiOutlineRight className="w-4 h-4" />
                     </nav>
                  </div>

                  <div>
                     <p>Month: {monthNames[month - 1]}</p> {/* display name */}
                     <p>Year: {year}</p>
                  </div>
               </div>
               <div className="flex gap-4 mt-4 mb-3">
                  <div className="min-w-[160px]">
                     <Select
                        label="Select Due"
                        onChange={(val) => setBatch(val)}
                     >
                        <Option value="batch1">Due1</Option>
                        <Option value="batch2">Due5</Option>
                        <Option value="batch3">Due10</Option>
                        <Option value="batch4">Due15</Option>
                        <Option value="batch5">Due25</Option>
                        <Option value="all_cheque">Due28-AllCheque</Option>
                     </Select>
                  </div>

                  <div className="min-w-[100px]">
                     <Input
                        type="number"
                        label="Month"
                        min={1}
                        max={12}
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                     />
                  </div>

                  <div className="min-w-[120px]">
                     <Input
                        type="number"
                        label="Year"
                        min={2000}
                        max={2100}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                     />
                  </div>

                  <Button
                     className="px-6"
                     onClick={() => window.location.reload()}
                  >
                     Reset
                  </Button>
               </div>

               <hr className="border border-gray-300" />

               <div className="mt-5 w-full  flex items-center justify-between flex-col-reverse gap-2 lg:flex-row">
                  <div className="relative w-96">
                     <input
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                        placeholder="Search lastname..."
                        value={searchQuery}
                        onChange={handleSearch}
                     />
                     <AiOutlineSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                  </div>

                  <div>
                     <Link href="/admin/transactions/create">
                        <Button
                           className="flex gap-2 items-center"
                           color="blue"
                           size="md"
                        >
                           <AiOutlinePlus className="text-lg" />
                           New Bill
                        </Button>
                     </Link>
                  </div>
               </div>
            </div>

            <div className="flex-1  p-4  overflow-x-auto max-w-min md:max-w-full">
               <table className="w-full min-w-[350px] text-left  border border-gray-300">
                  <thead>
                     <tr className="bg-gray-100">

                        
                        <th
                           onClick={() => handleSort("bill_no")}
                           className="cursor-pointer px-3 py-3 text-sm font-semibold bg-gray-300 text-gray-700 border border-gray-400"
                        >
                           Bill No. <SortIcon column="bill_no" />
                        </th>

                        <th
                           onClick={() => handleSort("customer_name")}
                           className="cursor-pointer px-3 py-3 text-sm font-semibold bg-gray-300 text-gray-700 border border-gray-400"
                        >
                           Customer Name <SortIcon column="customer_name" />
                        </th>

                        <th
                           onClick={() => handleSort("mbps")}
                           className="cursor-pointer px-3 py-3 text-sm font-semibold bg-gray-300 text-gray-700 border border-gray-400"
                        >
                           Mbps <SortIcon column="mbps" />
                        </th>

                        <th
                           onClick={() => handleSort("description")}
                           className="cursor-pointer px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 border border-gray-400"
                        >
                           Description <SortIcon column="description" />
                        </th>

                        <th
                           onClick={() => handleSort("mode_payment")}
                           className="cursor-pointer px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 border border-gray-400"
                        >
                           Payment Mode <SortIcon column="mode_payment" />
                        </th>

                        <th
                           onClick={() => handleSort("partial")}
                           className="cursor-pointer px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 border border-gray-400"
                        >
                           Payment <SortIcon column="partial" />
                        </th>

                        <th
                           onClick={() => handleSort("amount")}
                           className="cursor-pointer px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 border border-gray-400"
                        >
                           Total Amount Due <SortIcon column="amount" />
                        </th>

                        <th
                           onClick={() => handleSort("date_billing")}
                           className="cursor-pointer px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 border border-gray-400"
                        >
                           Date Billing <SortIcon column="date_billing" />
                        </th>

                        <th
                           onClick={() => handleSort("payment_date")}
                           className="cursor-pointer px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 border border-gray-400"
                        >
                           Payment Date <SortIcon column="payment_date" />
                        </th>

                        <th
                           onClick={() => handleSort("status")}
                           className="cursor-pointer px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 border border-gray-400"
                        >
                           Status <SortIcon column="status" />
                        </th>

                        <th
                           // onClick={() => handleSort("status")}
                           className=" px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 border border-gray-400"
                        >
                           Action
                        </th>

                     </tr>
                  </thead>

                  <tbody>
                     {isLoading ? (
                        <tr>
                           <td
                              colSpan={TABLE_HEAD.length}
                              className="border border-blue-gray-100 p-4"
                           >
                              <div className="flex justify-center items-center h-full">
                                 <Spinner className="h-10 w-10" color="green" />
                              </div>
                           </td>
                        </tr>
                     ) : TABLE_ROWS.length === 0 ? (
                        <tr>
                           <td
                              colSpan={TABLE_HEAD.length}
                              className="border border-blue-gray-100 p-4 text-center text-red-500"
                           >
                              <div className="flex justify-center items-center gap-2">
                                 No bill records found
                                 <CgDanger className="text-xl" />
                              </div>
                           </td>
                        </tr>
                     ) : (
                        TABLE_ROWS.map(
                           ({
                              id,
                              bill_no,
                              customer_name,
                              mbps,
                              description,
                              mode_payment,
                              plan_price,
                              partial,
                              amount,
                              remarks,
                              status,
                              date_billing,
                              batch,
                              date_registration,
                              payment_date,
                           }) => (
                              <tr key={id} className="hover:bg-blue-gray-50 ">
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {bill_no}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {customer_name}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {mbps} mbps
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {description}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {mode_payment}
                                    </Typography>
                                 </td>

                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       ₱{" "}
                                       {parseFloat(partial).toLocaleString(
                                          "en-PH",
                                          {
                                             minimumFractionDigits: 2,
                                             maximumFractionDigits: 2,
                                          }
                                       )}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       ₱{" "}
                                       {parseFloat(amount).toLocaleString(
                                          "en-PH",
                                          {
                                             minimumFractionDigits: 2,
                                             maximumFractionDigits: 2,
                                          }
                                       )}
                                    </Typography>
                                 </td>

                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {remarks === "batch"
                                          ? formatBillingDate(batch)
                                          : ""}
                                    </Typography>
                                 </td>

                                 {/* <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {format(
                                          new Date(date_billing),
                                          "MM/dd/yyyy"
                                       )}
                                    </Typography>
                                 </td> */}
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {format(
                                          new Date(payment_date),
                                          "MM/dd/yyyy"
                                       )}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800"
                                    >
                                       {status}
                                    </Typography>
                                 </td>

                                 <td className="border border-blue-gray-100 px-4">
                                    <div className="flex items-center gap-2 ">
                                       <Menu>
                                          <MenuHandler>
                                             <IconButton variant="text">
                                                <Tooltip content="Actions">
                                                   <img
                                                      src="/img/dots.png"
                                                      alt=""
                                                   />
                                                </Tooltip>
                                             </IconButton>
                                          </MenuHandler>
                                          <MenuList>
                                             <Link
                                                className="hover:bg-blue-800 hover:rounded hover:text-white"
                                                href={route(
                                                   "transactions.show",
                                                   {
                                                      id,
                                                   }
                                                )}
                                             >
                                                <MenuItem>View</MenuItem>
                                             </Link>

                                             <Link
                                                className="hover:bg-blue-800 hover:rounded hover:text-white"
                                                href={route(
                                                   "transactions.edit",
                                                   {
                                                      id,
                                                   }
                                                )}
                                             >
                                                <MenuItem>Edit</MenuItem>
                                             </Link>
                                             <MenuItem
                                                onClick={() => deleteBill(id)}
                                             >
                                                <span>Delete</span>
                                             </MenuItem>
                                          </MenuList>
                                       </Menu>
                                    </div>
                                 </td>
                              </tr>
                           )
                        )
                     )}
                  </tbody>
               </table>

               <div className="grid grid-cols-4 items-center border-t border-blue-gray-50 p-4">
                  {/* Left side: span-1 */}
                  <div className="col-span-1">
                     <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                     >
                        Page {data?.current_page} of {data?.last_page}
                     </Typography>
                  </div>

                  {/* Center content: span-2 */}
                  <div className="col-span-2 flex flex-col items-center">
                     {/* Pagination numbers */}
                     <Pagination
                        currentPage={data?.current_page || 1}
                        lastPage={data?.last_page || 1}
                        onPageChange={handlePagination}
                     />

                     {/* Entry count text */}
                     <div className="mt-3 text-gray-700">
                        Showing {(currentPage - 1) * 10 + 1} to{" "}
                        {Math.min(currentPage * 10, data?.total)} of{" "}
                        {data?.total} entries
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Index;
