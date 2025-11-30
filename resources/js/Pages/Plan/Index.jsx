import React from "react";
import { CgDanger } from "react-icons/cg";
import { AiOutlinePlus } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Deferred, Link } from "@inertiajs/react";
import {
   Typography,
   IconButton,
   Button,
   Menu,
   MenuHandler,
   MenuList,
   Tooltip,
   MenuItem,
   Spinner,
} from "@material-tailwind/react";
import axios from "axios";

const TABLE_HEAD = ["Mbps", "Plan Price", ""];

const Index = () => {
   const { plans } = usePage().props;

   // Sorting configuration
   const [sortConfig, setSortConfig] = React.useState({
      column: "",
      direction: "asc",
   });

   // Sort handler
   const handleSort = (column) => {
      setSortConfig((prev) => {
         const direction =
            prev.column === column && prev.direction === "asc"
               ? "desc"
               : "asc";
         return { column, direction };
      });
   };

   // Sorting logic
   const sortedPlans = React.useMemo(() => {
      if (!plans) return [];

      const sorted = [...plans];

      if (sortConfig.column) {
         sorted.sort((a, b) => {
            let valA = a[sortConfig.column];
            let valB = b[sortConfig.column];

            if (sortConfig.column === "plan_price") {
               valA = Number(valA);
               valB = Number(valB);
            }

            if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
         });
      }

      return sorted;
   }, [plans, sortConfig]);

   const deletePlan = async (planId) => {
      const confirmDelete = window.confirm(
         "Are you sure you want to delete this plan?"
      );
      if (confirmDelete) {
         try {
            const response = await axios.delete(`/admin/plans/${planId}`);
            alert(response.data.message);
         } catch (error) {
            console.error(error);
            alert("An unexpected error occurred. Please try again later.");
         }
      }
   };

   return (
      <AuthenticatedLayout>
         <Head title="CFS INTERNET NETWORK SOLUTIONS" />

         <div className="bg-white overflow-y-auto max-h-[550px]">
            <div className="mt-5 px-52">
               <div className="mb-6 flex justify-between items-center">
                  <div>
                     <Typography
                        variant="lead"
                        className="mb-0 text-lg font-bold"
                     >
                        Plans
                     </Typography>
                     <Typography className="text-sm">
                        Manage plans
                     </Typography>
                  </div>
                  <div>
                     <Link href="/admin/plans/create">
                        <Button
                           className="flex gap-2 items-center"
                           color="blue"
                           size="md"
                        >
                           <AiOutlinePlus className="text-lg" />
                           Create Plan
                        </Button>
                     </Link>
                  </div>
               </div>

               <div className="flex-1 p-4 overflow-x-auto">
                  <div className="min-w-[550px]">
                     <table className="w-full text-left border border-gray-300">
                        <thead>
                           <tr className="bg-gray-100">

                              {/* ========== SORT MBPS ========== */}
                              <th
                                 onClick={() => handleSort("mbps")}
                                 className="px-6 py-3 text-sm font-semibold bg-gray-300 
                                            text-gray-700 uppercase border border-gray-400
                                            cursor-pointer select-none"
                              >
                                 <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="text-[12px] font-normal leading-none opacity-70 flex items-center gap-1"
                                 >
                                    Mbps
                                    {sortConfig.column === "mbps" &&
                                       (sortConfig.direction === "asc"
                                          ? "▲"
                                          : "▼")}
                                 </Typography>
                              </th>

                              {/* ========== SORT PLAN PRICE ========== */}
                              <th
                                 onClick={() => handleSort("plan_price")}
                                 className="px-6 py-3 text-sm font-semibold bg-gray-300 
                                            text-gray-700 uppercase border border-gray-400
                                            cursor-pointer select-none"
                              >
                                 <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="text-[12px] font-normal leading-none opacity-70 flex items-center gap-1"
                                 >
                                    Plan Price
                                    {sortConfig.column === "plan_price" &&
                                       (sortConfig.direction === "asc"
                                          ? "▲"
                                          : "▼")}
                                 </Typography>
                              </th>

                              <th className="w-[15%] px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                                 <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="text-[12px] font-normal leading-none opacity-70"
                                 >
                                    {""}
                                 </Typography>
                              </th>
                           </tr>
                        </thead>

                        <tbody>
                           <Deferred
                              data={["plans"]}
                              fallback={
                                 <tr>
                                    <td colSpan={3} className="border p-4">
                                       <div className="flex justify-center items-center h-full">
                                          <Spinner className="h-8 w-8" color="green" />
                                       </div>
                                    </td>
                                 </tr>
                              }
                           >
                              {sortedPlans.length > 0 ? (
                                 sortedPlans.map((plan, index) => (
                                    <tr key={index} className="hover:bg-blue-gray-50">
                                       <td className="border px-4 py-1">
                                          <Typography
                                             variant="small"
                                             className="text-gray-800 text-[13px]"
                                          >
                                             {`${plan.mbps} mbps`}
                                          </Typography>
                                       </td>

                                       <td className="border px-4">
                                          <Typography
                                             variant="small"
                                             className="font-normal text-gray-800 text-[13px]"
                                          >
                                             {Number(plan.plan_price).toLocaleString(
                                                "en-PH",
                                                {
                                                   style: "currency",
                                                   currency: "PHP",
                                                }
                                             )}
                                          </Typography>
                                       </td>

                                       <td className="border px-4">
                                          <div className="flex items-center gap-2">
                                             <Menu>
                                                <MenuHandler>
                                                   <IconButton variant="text">
                                                      <Tooltip content="Actions">
                                                         <img src="/img/dots.png" alt="" />
                                                      </Tooltip>
                                                   </IconButton>
                                                </MenuHandler>
                                                <MenuList>
                                                   <Link
                                                      className="hover:bg-blue-800 hover:text-white"
                                                      href={route("plans.edit", { id: plan.id })}
                                                   >
                                                      <MenuItem>Edit</MenuItem>
                                                   </Link>

                                                   <MenuItem>
                                                      <span onClick={() => deletePlan(plan.id)}>
                                                         Delete
                                                      </span>
                                                   </MenuItem>
                                                </MenuList>
                                             </Menu>
                                          </div>
                                       </td>
                                    </tr>
                                 ))
                              ) : (
                                 <tr>
                                    <td
                                       colSpan={3}
                                       className="border p-4 text-center text-red-500"
                                    >
                                       <div className="flex justify-center items-center gap-2">
                                          No plan records found
                                          <CgDanger className="text-xl" />
                                       </div>
                                    </td>
                                 </tr>
                              )}
                           </Deferred>
                        </tbody>

                     </table>
                  </div>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Index;
