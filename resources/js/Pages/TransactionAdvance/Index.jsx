import { CgDanger } from "react-icons/cg";
import { AiOutlinePlus, AiOutlineSearch, AiOutlineRight } from "react-icons/ai";
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { format } from "date-fns";

import { Head, usePage, Link } from "@inertiajs/react";
import {
   Typography,
   Button,
   Input,
   Spinner,
   Menu,
   MenuHandler,
   MenuList,
   MenuItem,
   IconButton,
   Tooltip,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/Components/Pagination";
import axios from "axios";
import UseAppUrl from "@/hooks/UseAppUrl";

const TABLE_HEAD = [
   "Bill NO.",
   "Customer Name",
   "Mbps Plan",
   "Payment",
   "Total Amount Paid",
   "Date Billing",
   "Payment Date",
   "Status",
   "Actions",
];

const Index = () => {
   const API_URL = UseAppUrl();
   const today = new Date();
   const [month, setMonth] = useState(today.getMonth() + 1);
   const [year, setYear] = useState(today.getFullYear());
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

   const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [sortConfig, setSortConfig] = useState({
      column: "",
      direction: "desc",
   });

   const fetchAdvanceBills = async ({ queryKey }) => {
      const [_key, page, query, sortColumn, sortDirection, month, year] =
         queryKey;
      const response = await axios.get(`${API_URL}/api/transactions-advance`, {
         params: {
            page,
            search: query,
            sortColumn,
            sortDirection,
            month,
            year,
         },
      });
      return response.data;
   };

   const { data, isLoading, refetch } = useQuery({
      queryKey: [
         "advance_bills",
         currentPage,
         searchQuery,
         sortConfig.column,
         sortConfig.direction,
         month,
         year,
      ],
      queryFn: fetchAdvanceBills,
      keepPreviousData: true,
   });

   const handleSearch = (e) => {
      setSearchQuery(e.target.value);
      if (!e.target.value) setCurrentPage(1);
   };

   const handlePagination = (page) => setCurrentPage(page);

   const deleteBill = async (transactionID) => {
      if (
         window.confirm(
            "Are you sure you want to delete this bill transaction?"
         )
      ) {
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
         partial: bill.partial,
         remarks: bill.remarks,
         date_billing: bill.date_billing,
         payment_date: bill.created_at,
         status: bill.status,
      })) || [];

   return (
      <AuthenticatedLayout>
         <Head title="Advance Transactions" />
         <div className="bg-white overflow-y-auto max-h-[590px]">
            <div className="mt-5 px-4">
               <div className="mb-6 flex justify-between items-center">
                  <div>
                     <Typography
                        variant="lead"
                        size="small"
                        className="mb-0 text-lg font-bold"
                     >
                        Advance Transactions
                     </Typography>
                     <Typography
                        className="text-sm"
                        variant="paragraph"
                        size="small"
                     >
                        Manage advance bill transactions
                     </Typography>
                     <nav className="flex items-center space-x-1 text-gray-600 text-sm mt-3">
                        <a
                           href="/admin/transactions"
                           className="hover:text-black"
                        >
                           Batch
                        </a>
                        <AiOutlineRight className="w-4 h-4" />
                        <a
                           href="/admin/transactions-advance"
                           className="font-bold text-blue-800"
                        >
                           Advance
                        </a>
                        <AiOutlineRight className="w-4 h-4" />
                     </nav>
                  </div>
                  <div>
                     <p>Month: {monthNames[month - 1]}</p>
                     <p>Year: {year}</p>
                  </div>
               </div>

               <div className="flex gap-4 mt-4 mb-3">
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

               <div className="mt-5 w-full flex items-center justify-between flex-col-reverse gap-2 lg:flex-row">
                  <div className="relative w-96">
                     <Input
                        className="bg-transparent text-sm"
                        placeholder="Search lastname..."
                        value={searchQuery}
                        onChange={handleSearch}
                     />
                     <AiOutlineSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div>
                     <Link href="/admin/transactions-advance/create">
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

            <div className="flex-1 p-4 overflow-x-auto max-w-min md:max-w-full">
               <table className="w-full min-w-[350px] text-left border border-gray-300">
                  <thead>
                     <tr className="bg-gray-100">
                        {TABLE_HEAD.map((head) => (
                           <th
                              key={head}
                              className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400"
                           >
                              <Typography
                                 variant="small"
                                 color="blue-gray"
                                 className="text-[12px] font-normal leading-none opacity-70"
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
                              partial,
                              amount,
                              status,
                              date_billing,
                              payment_date,
                           }) => (
                              <tr key={id} className="hover:bg-blue-gray-50">
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
                                       {format(
                                          new Date(date_billing),
                                          "MM/dd/yyyy"
                                       )}
                                    </Typography>
                                 </td>
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
                                    <div className="flex items-center gap-2">
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
                                                   "transaction.advance.show",
                                                   { id }
                                                )}
                                             >
                                                <MenuItem>View</MenuItem>
                                             </Link>
                                             <Link
                                                className="hover:bg-blue-800 hover:rounded hover:text-white"
                                                href={route(
                                                   "transaction.advance.edit",
                                                   { id }
                                                )}
                                             >
                                                <MenuItem>Edit</MenuItem>
                                             </Link>
                                             <MenuItem
                                                onClick={() => deleteBill(id)}
                                             >
                                                Delete
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
                  <div className="col-span-1">
                     <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                     >
                        Page {data?.current_page} of {data?.last_page}
                     </Typography>
                  </div>
                  <div className="col-span-2 flex flex-col items-center">
                     <Pagination
                        currentPage={data?.current_page || 1}
                        lastPage={data?.last_page || 1}
                        onPageChange={handlePagination}
                     />
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
