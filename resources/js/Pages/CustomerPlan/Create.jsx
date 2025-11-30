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

const Create = ({ customers, collectors, plans }) => {
   const { data, setData, post, errors, reset, processing } = useForm({
      customer_id: "",
      plan_id: "",
      ppoe: "",
      password: "",
      collector_id: "",
      date_registration: "",
      date_billing: "",
   });

   const onSubmit = async (e) => {
      e.preventDefault();

      await post(route("customer_plans.store"), {
         onSuccess: () => {
            alert("Customer plan was added successfully!");
            reset();
         },
         onError: (errors) => {
            console.log(errors);
         },
      });
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
         <Head title="Add Customer Plan" />
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
                        Add Customer Plan
                     </Typography>

                     <form onSubmit={onSubmit} className="mt-8 mb-2">
                        <div className="grid grid-cols-1 gap-2">  
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Customers
                              </Typography>
                              <Select
                                 options={customerOptions}
                                 placeholder="Choose a customer"
                                 isClearable
                                 value={customerOptions.find(
                                    (option) => option.value === data.sex
                                 )}
                                 onChange={(selectedOption) =>
                                    setData(
                                       "customer_id",
                                       selectedOption
                                          ? selectedOption.value
                                          : ""
                                    )
                                 }
                                 className={`${
                                    errors.customer_id
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
                                 Plan
                              </Typography>
                              <Select
                                 options={planOptions}
                                 placeholder="Choose a plan"
                                 isClearable
                                 value={customerOptions.find(
                                    (option) => option.value === data.id
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
                                 value={customerOptions.find(
                                    (option) => option.value === data.id
                                 )}
                                 onChange={(selectedOption) =>
                                    setData(
                                       "collector_id",
                                       selectedOption
                                          ? selectedOption.value
                                          : ""
                                    )
                                 }
                                 className={`${
                                    errors.collector_id
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
                                 Date Regisration
                              </Typography>
                              <Input
                                 type="date"
                                 size="md"
                                 value={data.date_registration}
                                 onChange={(e) =>
                                    setData("date_registration", e.target.value)
                                 }
                                 error={Boolean(errors.date_registration)}
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
                           Save
                        </Button>
                     </form>
                  </Card>
               </div>
            </div>
         </div>{" "}
      </AuthenticatedLayout>
   );
};

export default Create;
