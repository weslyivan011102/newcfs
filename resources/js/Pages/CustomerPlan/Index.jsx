import { CgDanger } from "react-icons/cg";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { format } from "date-fns";

import { Head, usePage, Link } from "@inertiajs/react";
import {
  IconButton,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Spinner,
} from "@material-tailwind/react";

import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/Components/Pagination";
import axios from "axios";
import UseAppUrl from "@/hooks/UseAppUrl";

const TABLE_HEAD = [
  { key: "customer_name", label: "Customer Name" },
  { key: "mbps", label: "Mbps Plan" },
  { key: "ppoe", label: "PPOE" },
  { key: "password", label: "Password" },
  { key: "date_registration", label: "Date Installation" },
  { key: "date_billing", label: "Date Billing" },
  { key: "collector_name", label: "Assign Collector" },
  { key: "actions", label: "" },
];

const Index = () => {
  const API_URL = UseAppUrl();

  const fetchCustomerPlans = async ({ queryKey }) => {
    const [_key, page, query, sortColumn, sortDirection] = queryKey;
    const response = await axios.get(`${API_URL}/api/get_customer_planx_paginate`, {
      params: { page, lastname: query, sortColumn, sortDirection },
    });
    return response.data;
  };

  const { customerPlans } = usePage().props;

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(customerPlans?.current_page || 1);

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ column: "", direction: "asc" });

  const { data, isLoading } = useQuery({
    queryKey: [
      "customerPlans",
      currentPage,
      searchQuery,
      sortConfig.column,
      sortConfig.direction,
    ],
    queryFn: fetchCustomerPlans,
    keepPreviousData: true,
  });

  const TABLE_ROWS =
    data?.data.map((customerPlan) => ({
      id: customerPlan.id,
      customer_id: customerPlan.customer.id,
      customer_name: `${customerPlan.customer.lastname} ${customerPlan.customer.firstname} ${customerPlan.customer.middlename ?? ""}`,
      collector_name: `${customerPlan.collector.lastname} ${customerPlan.collector.firstname} ${customerPlan.collector.middlename ?? ""}`,
      mbps: customerPlan.plan.mbps,
      plan_price: customerPlan.plan.plan_price,
      date_registration: format(new Date(customerPlan.date_registration), "M/d/yyyy"),
      date_billing: customerPlan.date_billing,
      ppoe: customerPlan.ppoe,
      password: customerPlan.password,
    })) || [];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
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
    return map[batch] || batch;
  };

  const handleSort = (columnKey) => {
    setSortConfig((prev) => ({
      column: columnKey,
      direction:
        prev.column === columnKey && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <AuthenticatedLayout>
      <Head title="CFS INTERNET NETWORK SOLUTIONS" />
      <div className="bg-white overflow-y-auto max-h-[590px]">
        <div className="mt-5 px-4">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <Typography variant="lead" size="small" className="mb-0 text-lg font-bold">
                Customer Plans
              </Typography>
              <Typography className="text-sm" variant="paragraph" size="small">
                Manage customer plans
              </Typography>
            </div>
          </div>

          <div className="w-full flex items-center justify-between flex-col-reverse gap-2 lg:flex-row">
            <div className="relative w-96">
              <input
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border 
                border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none 
                focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Search lastname..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <AiOutlineSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
            </div>

            <Link href="/admin/customer_plans/create">
              <Button className="flex gap-2 items-center" color="blue" size="md">
                <AiOutlinePlus className="text-lg" />
                Add Customer Plan
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-x-auto max-w-min md:max-w-full">
          <table className="w-full min-w-[350px] text-left border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {TABLE_HEAD.map(({ key, label }) => (
                  <th
                    key={key}
                    className={`px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400 
                    ${key !== "actions" ? "cursor-pointer" : ""}`}
                    onClick={() => key !== "actions" && handleSort(key)}
                  >
                    <div className="flex items-center justify-between">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`text-[12px] font-bold leading-none
                          ${sortConfig.column === key ? "text-blue-600" : "opacity-70"}
                        `}
                      >
                        {label}
                      </Typography>

                      {key !== "actions" && (
                        <span className="ml-1 text-[10px]">
                          {sortConfig.column === key ? (
                            sortConfig.direction === "asc" ? "▲" : "▼"
                          ) : (
                            "↕"
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="border p-4">
                    <div className="flex justify-center items-center h-full">
                      <Spinner className="h-10 w-10" color="green" />
                    </div>
                  </td>
                </tr>
              ) : TABLE_ROWS.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="border p-4 text-center text-red-500">
                    <div className="flex justify-center items-center gap-2">
                      No customer plan records found
                      <CgDanger className="text-sm" />
                    </div>
                  </td>
                </tr>
              ) : (
                TABLE_ROWS.map(
                  ({
                    id,
                    customer_name,
                    collector_name,
                    ppoe,
                    password,
                    mbps,
                    date_registration,
                    date_billing,
                  }) => (
                    <tr key={id} className="hover:bg-blue-gray-50">
                      <td className="border px-2 text-xs  text-gray-800">{customer_name}</td>
                      <td className="border px-2 text-xs  text-gray-800">{mbps} mbps</td>
                      <td className="border px-2 text-xs  text-gray-800">{ppoe}</td>
                      <td className="border px-2 text-xs  text-gray-800">{password}</td>
                      <td className="border px-2 text-xs  text-gray-800">{date_registration}</td>
                      <td className="border px-2 text-xs  text-gray-800">{formatBillingDate(date_billing)}</td>
                      <td className="border px-2 text-xs  text-gray-800">{collector_name}</td>

                      <td className="border px-4">
                        <Menu>
                          <MenuHandler>
                            <IconButton variant="text">
                              <img src="/img/dots.png" alt="" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList>
                            <Link href={route("customer_plans.show", id)}>
                              <MenuItem>View</MenuItem>
                            </Link>
                            <Link href={route("customer_plans.edit", id)}>
                              <MenuItem>Edit</MenuItem>
                            </Link>
                          </MenuList>
                        </Menu>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="grid grid-cols-4 items-center border-t border-blue-gray-50 p-4">
            <div className="col-span-1">
              <Typography variant="small" color="blue-gray" className="font-normal">
                Page {data?.current_page} of {data?.last_page}
              </Typography>
            </div>

            <div className="col-span-2 flex flex-col items-center">
              <Pagination
                currentPage={data?.current_page || 1}
                lastPage={data?.last_page || 1}
                onPageChange={(page) => setCurrentPage(page)}
              />

              <div className="mt-3 text-gray-700">
                Showing {(currentPage - 1) * 10 + 1} to{" "}
                {Math.min(currentPage * 10, data?.total)} of {data?.total} entries
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;
