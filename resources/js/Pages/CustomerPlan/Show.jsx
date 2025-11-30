import { BiEditAlt } from "react-icons/bi";
import { MdCellTower } from "react-icons/md";
import { BsArrowReturnLeft } from "react-icons/bs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, Deferred, usePage } from "@inertiajs/react";
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
   Spinner,
   Dialog,
   DialogHeader,
   DialogBody,
   DialogFooter,
} from "@material-tailwind/react";
import Select from "react-select";
import { format } from "date-fns";
import { useState } from "react";

const Show = ({ customer_plan, latestPlan, plans }) => {
   const [open, setOpen] = useState(false);

   console.log(customer_plan);

   const handleOpen = () => setOpen(!open);

   const planOptions = plans.map((plan) => ({
      value: plan.id,
      label: `${plan.mbps} mbps - ${new Intl.NumberFormat("en-PH", {
         style: "currency",
         currency: "PHP",
      }).format(plan.plan_price)}`,
   }));

   const onSubmit = () => {
      patch(route("customer_plans.update", data.customer_plan_id), {
         preserveScroll: true,
         onSuccess: () => {
            alert("Customer plan updated successfully!");
            handleOpen();
         },
         onError: (errors) => {
            console.error(errors);
         },
      });
   };

   return (
      <AuthenticatedLayout>
         <Head title="Collector Profile" />
         <div className="bg-white overflow-y-auto max-h-[550px]">
            <div className="mt-5 px-4 ">
               <div className="mb-6 flex justify-between items-center ">
                  <div>
                     <Typography
                        variant="lead"
                        size="small"
                        className="mb-0 text-lg font-bold border-b border-b-gray-700"
                     >
                        {customer_plan.customer.firstname}{" "}
                        {customer_plan.customer.middlename ?? ""}
                        {customer_plan.customer.lastname} Plans
                     </Typography>
                     <Typography
                        className="text-sm"
                        variant="paragraph"
                        size="small"
                     >
                        All plans
                     </Typography>
                  </div>
                  <Tooltip content="Back">
                     <Link
                        href="/admin/customer_plans"
                        className="hover:bg-gray-200 px-2 py-1 rounded mr-4"
                     >
                        <BsArrowReturnLeft className="text-xl cursor-pointer" />
                     </Link>
                  </Tooltip>
               </div>

               <div className="grid grid-cols-40/60 ">
                  <div className="flex flex-col justify-between items-center">
                     <Card
                        color="white"
                        className=" h-60 flex-2 justify-center gap-4 items-center py-2 px-8 shadow-sm rounded-md mt-1 mb-0 mr-2 w-72 border-2 border-gray-100"
                     >
                        <div>
                           <Tooltip content="Edit">
                              <Button variant="text" onClick={handleOpen}>
                                 <BiEditAlt className="text-blue-700 text-xl" />
                              </Button>
                           </Tooltip>
                        </div>
                        <MdCellTower className="text-4xl text-green-700" />
                        <div className="flex flex-col justify-center gap-1">
                           <Typography variant="h5">Current Plan</Typography>
                           <div className="bg-green-100">
                              <Typography
                                 variant="paragraph"
                                 className="text-center"
                              >
                                 {latestPlan.plan.mbps} mbps
                              </Typography>
                           </div>
                        </div>
                     </Card>
                  </div>
                  <div className="p-4 overflow-x-auto">
                     <div className="">
                        <table className="w-full text-left border border-gray-300">
                           <thead>
                              <tr className="bg-gray-100">
                                 <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                                    <Typography
                                       variant="small"
                                       color="blue-gray"
                                       className="text-[12px] font-normal leading-none opacity-70"
                                    >
                                       Mbps
                                    </Typography>
                                 </th>
                                 <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                                    <Typography
                                       variant="small"
                                       color="blue-gray"
                                       className="text-[12px] font-normal leading-none opacity-70"
                                    >
                                       Price Plan
                                    </Typography>
                                 </th>
                                  <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                                    <Typography
                                       variant="small"
                                       color="blue-gray"
                                       className="text-[12px] font-normal leading-none opacity-70"
                                    >
                                       Balance
                                    </Typography>
                                 </th>
                                 <th className="w-[15%] px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                                    <Typography
                                       variant="small"
                                       color="blue-gray"
                                       className="text-[12px] font-normal leading-none opacity-70 text-nowrap"
                                    >
                                       Date Registration
                                    </Typography>
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr className="hover:bg-blue-gray-50">
                                 <td className="border border-blue-gray-100 px-4 py-2">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800 text-[13px]"
                                    >
                                       {customer_plan.plan.mbps} Mbps
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800 text-[13px]"
                                    >
                                       {Number(
                                          customer_plan.plan.plan_price
                                       ).toLocaleString("en-PH", {
                                          style: "currency",
                                          currency: "PHP",
                                       })}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800 text-[13px]"
                                    >
                                       {/* {Number(
                                          customer_plan.plan.outstanding_balance
                                       ).toLocaleString("en-PH", {
                                          style: "currency",
                                          currency: "PHP",
                                       })} */}
                                    </Typography>
                                 </td>
                                 <td className="border border-blue-gray-100 px-4">
                                    <Typography
                                       variant="small"
                                       className="font-normal text-gray-800 text-[13px]"
                                    >
                                       {format(
                                          new Date(
                                             customer_plan.plan.created_at
                                          ),
                                          "M/d/yyyy"
                                       )}
                                    </Typography>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Show;
