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
} from "@material-tailwind/react";
import Select from "react-select";

const Edit = ({ plan }) => {
   const { data, setData, patch, errors, reset, processing } = useForm({
      mbps: plan.mbps || "",
      plan_price: plan.plan_price || "",
   });
   console.log(plan);

   const onSubmit = async (e) => {
      e.preventDefault();

      await patch(route("plans.update", plan.id), {
         onSuccess: () => {
            alert("Plan was updated successfully!");
            reset();
         },
         onError: (errors) => {
            console.log(errors);
         },
      });
   };

   return (
      <AuthenticatedLayout>
         <Head title="Edit Plan" />
         <div className="bg-white overflow-y-auto max-h-[590px] grid place-justify-center ">
            <div className="mt-2 px-4">
               <div className="mb-6 flex justify-between items-center">
                  <Card
                     color="white"
                     className=" mx-auto w-full max-w-md p-8 shadow-md rounded-md mt-1 mb-2"
                  >
                     <div className="flex justify-end mb-2">
                        <Tooltip content="Back">
                           <Link
                              href="/admin/plans"
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
                        Edit Plan
                     </Typography>

                     <form onSubmit={onSubmit} className="mt-8 mb-2">
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Mbps
                           </Typography>
                           <Input
                              type="number"
                              size="md"
                              value={data.mbps}
                              onChange={(e) => setData("mbps", e.target.value)}
                              error={Boolean(errors.mbps)}
                              className="w-full"
                           />
                        </div>
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Price Plan
                           </Typography>
                           <Input
                              type="number"
                              size="md"
                              value={data.plan_price}
                              onChange={(e) =>
                                 setData("plan_price", e.target.value)
                              }
                              error={Boolean(errors.plan_price)}
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
