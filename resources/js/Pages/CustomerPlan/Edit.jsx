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

const Edit = ({ customers, collectors, plans, customer_plan }) => {
   const { data, setData, patch, errors, reset, processing } = useForm({
      customer_id: customer_plan.customer.id,
      plan_id: customer_plan.plan.id,
      ppoe: customer_plan.ppoe,
      password: customer_plan.password,
      collector_id: customer_plan.collector.id,
      date_registration: customer_plan.date_registration,
      date_billing: customer_plan.date_billing,
   });

   const onSubmit = async (e) => {
      e.preventDefault();

      try {
         const response = await axios.patch(
            route("customer_plans.update", customer_plan.id),
            {
               ...data, // Make sure formData contains the data you want to send
            }
         );

         if (response.status === 200) {
            alert("Customer plan was updated successfully!");
            window.location.reload();
            reset();
         }
      } catch (error) {
         console.error("Error updating customer plan:", error);
         // You can handle error messages or validation feedback here
         alert("An error occurred while updating the customer plan.");
      }
   };

   const customerOptions = customers.map((customer) => ({
      value: customer.id,
      label: `${customer.lastname} ${customer.firstname}`,
   }));

   const collectorOptions = collectors.map((collector) => ({
      value: collector.id,
      label: `${collector.lastname} ${collector.firstname}`,
   }));

   const planOptions = plans.map((plan) => ({
      value: plan.id,
      label: `${plan.mbps} mbps - ₱ ${Number(plan.plan_price).toLocaleString(
         "en-PH"
      )}`,
   }));

   const dateBillingOptions = [
      { value: "batch1", label: "Due1" },
      { value: "batch2", label: "Due5" },
      { value: "batch3", label: "Due10" },
      { value: "batch4", label: "Due15" },
      { value: "batch5", label: "Due25" },
      { value: "all_cheque", label: "Due28-AllCheque" },
   ];
   return (
      <AuthenticatedLayout>
         <Head title="Edit Customer Plan" />
         <div className="bg-white overflow-y-auto max-h-screen grid place-justify-center ">
            <div className="mt-2 px-4">
               <div className="mb-6 flex justify-between items-center">
                  <Card
                     color="white"
                     className=" mx-auto w-full max-w-lg  p-8 shadow-md rounded-md mt-1 mb-2"
                  >
                     <div className="flex justify-end mb-2">
                        <Tooltip content="Back">
                           <Link
                              href="/admin/customer_plans"
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
                        Edit Customer Plan
                     </Typography>

                     <form onSubmit={onSubmit} className="mt-8 mb-2">
                        <div className="grid grid-cols-1 gap-2">
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Customer
                              </Typography>
                              <Input
                                 size="md"
                                 value={
                                    customer_plan.customer.firstname +
                                       " " +
                                       customer_plan.customer.firstname ??
                                    " " + customer_plan.customer.lastname
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
                                 Plan
                              </Typography>
                              <Select
                                 options={planOptions}
                                 placeholder="Choose a plan"
                                 isClearable
                                 value={planOptions.find(
                                    (option) => option.value === data.plan_id
                                 )}
                                 onChange={(selectedOption) =>
                                    setData(
                                       "plan_id",
                                       selectedOption
                                          ? selectedOption.value
                                          : ""
                                    )
                                 }
                                 className={`${
                                    errors.plan_id
                                       ? "border border-red-600"
                                       : ""
                                 }`}
                              />
                           </div>
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 PPOE
                              </Typography>
                              <Input
                                 size="md"
                                 value={data.ppoe}
                                 onChange={(e) =>
                                    setData("ppoe", e.target.value)
                                 }
                                 error={Boolean(errors.ppoe)}
                                 className="w-full"
                              />
                           </div>
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Password
                              </Typography>
                              <Input
                                 size="md"
                                 value={data.password}
                                 onChange={(e) =>
                                    setData("password", e.target.value)
                                 }
                                 error={Boolean(errors.password)}
                                 className="w-full"
                              />
                           </div>
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Assign Collector
                              </Typography>
                              <Select
                                 options={collectorOptions}
                                 placeholder="Choose a collector"
                                 isClearable
                                 value={collectorOptions.find(
                                    (option) =>
                                       option.value === data.collector_id
                                 )}
                                 onChange={(selectedOption) =>
                                    setData(
                                       "collector_id",
                                       selectedOption
                                          ? selectedOption.value
                                          : ""
                                    )
                                 }
                              />
                           </div>

                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Date of Billing
                              </Typography>
                              <Select
                                 options={dateBillingOptions}
                                 placeholder="Choose a date billing"
                                 isClearable
                                 value={dateBillingOptions.find(
                                    (option) =>
                                       option.value === data.date_billing
                                 )}
                                 onChange={(selectedOption) =>
                                    setData(
                                       "date_billing",
                                       selectedOption
                                          ? selectedOption.value
                                          : ""
                                    )
                                 }
                                 className={`${
                                    errors.date_billing
                                       ? "border border-red-600"
                                       : ""
                                 }`}
                              />
                           </div>
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
