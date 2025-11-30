import { Typography, Input, Button } from "@material-tailwind/react";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { set } from "date-fns";

const Edit = ({ transaction, collectors, latest }) => {
   const [editRebate, setEditRebate] = useState("");
   const [editPartial, setEditPartial] = useState(transaction.partial ?? 0);
   const [editTotalAmountPaid, setEditTotalAmountPaid] = useState(0);
   const [outstandingBalance, setOutstandingBalance] = useState(0);

   const { data, setData, patch, errors, reset, processing } = useForm({
      id: transaction.id,
      customer_id: transaction.customer_plan.customer.id,
      collector_id: transaction.customer_plan.collector.id,
      customer_plan_id: transaction.customer_plan_id,
      bill_no: transaction.bill_no,
      rebate: transaction.rebate,
      partial: transaction.partial,
      bill_amount: transaction.bill_amount,
      remarks: transaction.remarks,
      date_billing: transaction.date_billing,
      status: transaction.status,
   });

   //console.log("latest", latest);

   const StatusOptions = [
      { value: "paid", label: "Paid" },
      { value: "unpaid", label: "Unpaid" },
   ];

   console.log("Waw", JSON.stringify(transaction, null, 2));

   useEffect(() => {
      const planPrice = Number(transaction.customer_plan.plan.plan_price) || 0;
      const rebate = Number(data.rebate || 0);
      const partial = Number(editPartial || 0);

      // total amount after rebate
      const totalAmount = planPrice - rebate;
      setEditTotalAmountPaid(totalAmount);

      // outstanding = total amount - partial
      const balance = totalAmount - partial;
      setOutstandingBalance(balance);
      setData("bill_amount", totalAmount);
   }, [data.rebate, editPartial, transaction.customer_plan.plan.plan_price]);

   const onSubmit = async (e) => {
      e.preventDefault();

      console.log("Form Dataee:", JSON.stringify(data, null, 2)); // pretty print

      await patch(route("transactions.update", data.id), {
         onSuccess: () => {
            alert("Transaction updated successfully!");
            window.location.reload();
            reset();
         },
         onError: (errors) => {
            console.log(errors);
         },
      });
   };

   return (
      <AuthenticatedLayout>
         <Head title="Billing Transactions" />
         {/* <div>{transaction.customer_plan.customer.firstname}</div>
         <div>{transaction.customer_plan.collector.firstname}</div> */}
         <div className="flex justify-center overflow-y-auto max-h-[590px]">
            <div className="mb-10 w-full lg:w-[45%] p-4 overflow-auto shadow-md rounded-md border-2 border-sky-500 ">
               <form onSubmit={onSubmit}>
                  <input
                     type="hidden"
                     value={data.collector_id}
                     onChange={(e) => setData("collector_id", e.target.value)}
                     className="mb-2"
                  />
                  <div className="mb-1">
                     <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="mb-1 "
                     >
                        Customer Name
                     </Typography>
                     <Input
                        size="md"
                        value={`${transaction.customer_plan.customer.firstname} ${transaction.customer_plan.customer.lastname}`}
                        disabled
                        className="mb-3"
                     />
                  </div>
                  <div className="mb-1">
                     <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="mb-1 "
                     >
                        Acc No.
                     </Typography>
                     <Input
                        size="md"
                        value={data.customer_id}
                        disabled
                        className="mb-3"
                     />
                  </div>
                  <div className="mb-1">
                     <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="mb-1 "
                     >
                        Bill No.
                     </Typography>
                     <Input
                        size="md"
                        value={data.bill_no}
                        disabled
                        className="mb-3"
                     />
                  </div>

                  <div className="mb-1">
                     <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="mb-1 "
                     >
                        Bill Amount
                     </Typography>
                     <Input
                        size="md"
                        value={transaction.customer_plan.plan.plan_price}
                        disabled
                        className="mb-3"
                     />
                  </div>

                  <div className="mb-1">
                     <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="mb-1 "
                     >
                        Outstanding Balance Previous Month
                     </Typography>
                     <Input
                        size="md"
                        value={latest.balance ?? 0}
                        disabled
                        className="mb-3"
                     />
                  </div>

                  <div className="mb-1">
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
                        value={data.rebate ?? 0.0}
                        onChange={(e) => {
                           const value = Number(e.target.value);
                           const max = Number(
                              transaction.customer_plan.plan.plan_price
                           );

                           if (value > max) {
                              alert(
                                 `Rebate cannot be greater than Plan Price (${max}).`
                              );
                              setData("rebate", max); // reset to plan price
                           } else {
                              setData("rebate", value);
                           }
                           setEditRebate(value);
                        }}
                        className="mb-3"
                        onWheel={(e) => e.target.blur()}
                     />
                  </div>

                  <div className="mb-1">
                     <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="mb-1 "
                     >
                        Total Amount Due
                     </Typography>
                     <Input
                        type="number"
                        size="md"
                        value={editTotalAmountPaid}
                        className="mb-3"
                        disabled
                     />
                  </div>

                  <div className="mb-1">
                     <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="mb-1 "
                     >
                        Payment
                     </Typography>
                     <Input
                        type="number"
                        size="md"
                        value={data.partial ?? 0.0}
                        onChange={(e) => {
                           const value = Number(e.target.value);
                           const computedTotal =
                              Number(
                                 transaction.customer_plan.plan.plan_price
                              ) - Number(data.rebate || 0);

                           if (value > computedTotal) {
                              alert(
                                 `Partial cannot be greater than Total Amount Paid (${computedTotal}).`
                              );
                              setData("partial", computedTotal); // reset to exact computed total
                              setEditPartial(computedTotal);
                           } else {
                              setData("partial", value);
                              setEditPartial(value);
                           }
                        }}
                        className="mb-3"
                        onWheel={(e) => e.target.blur()}
                     />
                  </div>

                  <div className="mb-1">
                     <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="mb-1 "
                     >
                        Outstanding Balance
                     </Typography>
                     <Input
                        size="md"
                        value={outstandingBalance}
                        disabled
                        className="mb-3"
                     />
                  </div>

                  <div className="mb-3">
                     <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="mb-1 "
                     >
                        Date Billing
                     </Typography>
                     <Input
                        size="md"
                        disabled
                        type="date"
                        value={data.date_billing}
                        onChange={(e) =>
                           setData("date_billing", e.target.value)
                        }
                        error={Boolean(errors.date_billing)}
                        className="w-full"
                     />
                  </div>

                  <div className="mb-1">
                     <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="mb-1 "
                     >
                        Status
                     </Typography>
                     <Select
                        options={StatusOptions}
                        placeholder="Choose a status"
                        value={StatusOptions.find(
                           (option) => option.value === data.status
                        )}
                        onChange={(selected) =>
                           setData("status", selected ? selected.value : "")
                        }
                        className="mb-3"
                     />
                  </div>

                  <Button
                     type="submit"
                     // disabled={processing}
                     color="blue"
                     fullWidth
                  >
                     Update
                  </Button>
               </form>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Edit;
