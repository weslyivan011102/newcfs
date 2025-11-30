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
   MenuHandler,
   Menu,
} from "@material-tailwind/react";
import Select from "react-select";

const Edit = ({ bill }) => {
   const { data, setData, patch, errors, reset, processing } = useForm({
      customer_plan_id: bill.customer_plan_id,
      bill_no: bill.bill_no || "",
      bill_amount: bill.bill_amount || "",
   });

   console.log(bill);

   const onSubmit = async (e) => {
      e.preventDefault();

      await patch(route("batch_bills.update", bill.id), {
         onSuccess: () => {
            alert("Walkin bill was updated successfully!");
            reset();
         },
         onError: (errors) => {
            console.log(errors);
         },
      });
   };

   const RemarkOptions = [
      { value: "paid", label: "Paid" },
      { value: "unpaid", label: "Unpaid" },
   ];

   return (
      <AuthenticatedLayout>
         <Head title="Edit Batch Billing" />
         <div className="bg-white overflow-y-auto max-h-[590px] grid place-justify-center ">
            <div className="mt-2 px-4">
               <div className="mb-6 flex justify-between items-center">
                  <Card
                     color="white"
                     className=" mx-auto w-full max-w-lg  p-8 shadow-md rounded-md mt-1 mb-2"
                  >
                     <div className="flex justify-end mb-2">
                        <Tooltip content="Back">
                           <Link
                              href="/batch_bills"
                              className="hover:bg-gray-200 px-2 py-1 rounded"
                           >
                              <BsArrowReturnLeft className="text-xl cursor-pointer" />
                           </Link>
                        </Tooltip>
                     </div>
                     <Typography
                        variant="h5"
                        color="blue-gray"
                        className="text-center"
                     >
                        Edit Batch Bill
                     </Typography>

                     <form onSubmit={onSubmit} className="mt-8 mb-2">
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 font-bold"
                           >
                              Customer Name : <span cl></span>
                              {`${bill.customer.lastname}, ${
                                 bill.customer.firstname
                              } ${bill.customer.middlename ?? ""}`}
                           </Typography>
                        </div>
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Bill No.
                           </Typography>
                           <input
                              size="md"
                              value={data.customer_plan_id}
                              onChange={(e) =>
                                 setData("customer_plan_id", e.target.value)
                              }
                              type="hidden"
                           />
                           <Input
                              size="md"
                              value={data.bill_no}
                              onChange={(e) =>
                                 setData("bill_no", e.target.value)
                              }
                              disabled
                              className="w-full"
                           />
                        </div>

                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Bill Amount
                           </Typography>
                           <Input
                              size="md"
                              value={data.bill_amount}
                              onChange={(e) =>
                                 setData("bill_amount", e.target.value)
                              }
                              error={Boolean(errors.bill_amount)}
                           />
                        </div>

                        <Button
                           type="submit"
                           disabled={processing}
                           className="mt-6 w-full"
                           color="blue"
                           fullWidth
                        >
                           Update
                        </Button>
                     </form>
                  </Card>
               </div>
            </div>
         </div>{" "}
      </AuthenticatedLayout>
   );
};

export default Edit;
