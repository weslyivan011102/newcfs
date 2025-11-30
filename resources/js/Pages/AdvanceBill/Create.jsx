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
import { useState } from "react";
import axios from "axios";

const Create = ({ customers, collectors, generated_bill_no }) => {
   const [customerPlanId, setCustomerPlanId] = useState("");
   const [mbpsPlan, setMbpsPlan] = useState("");
   const [planPrice, setPlanPrice] = useState("");
   const [registrationDate, setRegistrationDate] = useState("");

   const { data, setData, post, errors, reset, processing } = useForm({
      customer_plan_id: "",
      bill_no: generated_bill_no,
      rebate: "",
      partial: "",
      bill_amount: "",
      remarks: "",
   });

   const onSubmit = async (e) => {
      e.preventDefault();

      console.log(data);

      await post(route("advance_bills.store"), {
         onSuccess: () => {
            alert("Advance Bill was created successfully!");
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

   const handleCustomerChange = async (selectedOption) => {
      console.log("Selected Option: ", selectedOption.value);

      if (selectedOption) {
         // Set customer_id in your form data
         setData("customer_id", selectedOption.value);

         try {
            // Send the request to fetch the latest plan for the selected customer
            const response = await axios.get(
               `/api/customers/${selectedOption.value}/latest-plan`
            );

            if (response.data) {
               const { id, mbps, plan_price, registration_date } =
                  response.data;

               // Log the plan details
               console.log("Latest Plan Mbps: ", mbps);
               console.log("Plan Price: ", plan_price);

               // Set the Mbps plan and price
               setData("customer_plan_id", id);
               setCustomerPlanId(id);
               setMbpsPlan(mbps);
               setPlanPrice(plan_price);
               setRegistrationDate(registration_date);

               // If you also want to set the plan price, you can update another state variable
               // setPlanPrice(plan_price);
            } else {
               console.log("No plan found for the selected customer.");
               setMbpsPlan("No Mbps plan available");
            }
         } catch (error) {
            console.error("Error fetching the plan:", error);
            setMbpsPlan("Error fetching Mbps plan");
         }
      } else {
         setMbpsPlan(""); // Reset Mbps plan if no customer is selected
      }
   };

   const RemarkOptions = [
      { value: "paid", label: "Paid" },
      { value: "unpaid", label: "Unpaid" },
   ];

   console.log("trish" + generated_bill_no);

   return (
      <AuthenticatedLayout>
         <Head title="Create New Bill" />
         <div className="bg-white overflow-y-auto max-h-[590px] grid place-justify-center ">
            <div className="mt-2 px-4">
               <div className="mb-6 flex justify-between items-center">
                  <Card
                     color="white"
                     className=" mx-auto w-full max-w-xl  p-8 shadow-md rounded-md mt-1 mb-2"
                  >
                     <div className="flex justify-end mb-2">
                        <Tooltip content="Back">
                           <Link
                              href="/walkin_bills"
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
                        New Bill
                     </Typography>

                     <form onSubmit={onSubmit} className="mt-8 mb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Bill No.
                              </Typography>
                              <input
                                 type="hidden"
                                 value={data.customer_plan_id}
                                 onChange={(e) =>
                                    setData("customer_plan_id", e.target.value)
                                 }
                              />
                              <input
                                 type="hidden"
                                 value={data.bill_no}
                                 onChange={(e) =>
                                    setData("bill_no", e.target.value)
                                 }
                              />
                              <Input size="md" value={data.bill_no} disabled />
                           </div>
                        </div>

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
                              isSearchable
                              value={customerOptions.find(
                                 (option) => option.value === data.customer_id
                              )}
                              onChange={handleCustomerChange}
                              className={`${
                                 errors.customer_id
                                    ? "border border-red-600"
                                    : ""
                              }`}
                           />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Mbps Plan
                              </Typography>
                              <Input
                                 disabled
                                 size="md"
                                 value={`${mbpsPlan} mbps - ₱${new Intl.NumberFormat(
                                    "en-PH"
                                 ).format(planPrice)}`}
                                 onChange={(e) => setMbpsPlan(e.target.value)} // Added onChange here
                              />
                           </div>
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Date Registration
                              </Typography>
                              <Input
                                 disabled
                                 type="date"
                                 size="md"
                                 value={registrationDate}
                                 onChange={(e) => setMbpsPlan(e.target.value)} // Added onChange here
                              />
                           </div>
                        </div>

                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Rebate
                           </Typography>
                           <Input
                              type="number"
                              size="md"
                              value={data.rebate}
                              onChange={(e) =>
                                 setData("rebate", e.target.value)
                              }
                              error={Boolean(errors.rebate)}
                           />
                        </div>
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Partial
                           </Typography>
                           <Input
                              type="number"
                              size="md"
                              value={data.partial}
                              onChange={(e) =>
                                 setData("partial", e.target.value)
                              }
                              error={Boolean(errors.partial)}
                           />
                        </div>
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Amount
                           </Typography>
                           <Input
                              type="number"
                              size="md"
                              value={data.bill_amount}
                              onChange={(e) =>
                                 setData("bill_amount", e.target.value)
                              }
                              error={Boolean(errors.bill_amount)}
                           />
                        </div>
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Remark
                           </Typography>
                           <Select
                              options={RemarkOptions}
                              placeholder="Choose a remark"
                              isClearable
                              value={RemarkOptions.find(
                                 (option) => option.value === data.remarks
                              )}
                              onChange={(selectedOption) =>
                                 setData(
                                    "remarks",
                                    selectedOption ? selectedOption.value : ""
                                 )
                              }
                           />
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
         </div>
      </AuthenticatedLayout>
   );
};

export default Create;
