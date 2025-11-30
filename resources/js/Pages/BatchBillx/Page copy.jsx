import React from "react";
import { Select, Option, Button, Typography } from "@material-tailwind/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Page = () => {
   return (
      <AuthenticatedLayout>
         <Head title="Geneate Batch Bill" />
         <div>
            <div className="flex justify-center flex-col items-center">
               <h1 className="text-4xl mt-5 mb-10">Batch Billing Generation</h1>
               <div className="max-w-[800px]">
                  <h3>
                     Generate Batch Billing for the month{" "}
                     {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                     })}
                  </h3>

                  <div className="flex gap-4 mt-4">
                     <Select label="Select Batch">
                        <Option>Batch 1</Option>
                        <Option>Batch 2</Option>
                        <Option>Batch 3</Option>
                        <Option>Batch 4</Option>
                        <Option>Batch 5</Option>
                        <Option>Batch 6</Option>
                     </Select>

                     <Button>Generate</Button>
                  </div>
               </div>
            </div>
            <div className="px-4 mt-5">
               <table className="w-full min-w-[350px] text-left  border border-gray-300">
                  <thead>
                     <tr>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Bill No.
                           </Typography>
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Customer No.
                           </Typography>
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Customer Name
                           </Typography>
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Address
                           </Typography>
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Batch
                           </Typography>
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400">
                           <Typography
                              variant="small"
                              color="blue-gray"
                              className="text-[12px] font-normal leading-none opacity-70"
                           >
                              Plan Price
                           </Typography>
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className="hover:bg-blue-gray-50 ">
                        <td className="border border-blue-gray-100 px-4">
                           <Typography
                              variant="small"
                              className="font-normal text-gray-800"
                           >
                              h
                           </Typography>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Page;
