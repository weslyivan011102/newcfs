import { Typography, Input, Button } from "@material-tailwind/react";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Edit = ({ transaction, collectors, latest }) => {
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
      description: transaction.description,
      mode_payment: transaction.mode_payment,
      remarks: transaction.remarks,
      date_billing: transaction.date_billing,
      status: transaction.status,
   });

   /** STATUS OPTIONS */
   const StatusOptions = [
      { value: "Paid", label: "Paid" },
      { value: "Unpaid", label: "Unpaid" },
   ];

   /** PAYMENT MODE OPTIONS */
   const PaymentOptions = [
      { value: "N/A", label: "N/A" },
      { value: "Cash", label: "Cash" },
      { value: "Gcash", label: "Gcash" },
      { value: "Cheque", label: "Cheque"},
   ];

   /** MONTH DESCRIPTION OPTIONS */
   const MonthOptions = [
      { value: "n/a", label: "SELECT MONTH" },
      { value: "january", label: "JAN BILL" },
      { value: "february", label: "FEB BILL" },
      { value: "march", label: "MARCH BILL" },
      { value: "april", label: "APRIL BILL" },
      { value: "may", label: "MAY BILL" },
      { value: "june", label: "JUNE BILL" },
      { value: "july", label: "JULY BILL" },
      { value: "august", label: "AUG BILL" },
      { value: "september", label: "SEPT BILL" },
      { value: "october", label: "OCT BILL" },
      { value: "november", label: "NOV BILL" },
      { value: "december", label: "DEC BILL" },
   ];

   /** AUTO-COMPUTE TOTALS */
   useEffect(() => {
      const planPrice = Number(transaction.customer_plan.plan.plan_price) || 0;
      const rebate = Number(data.rebate || 0);
      const partial = Number(editPartial || 0);

      // total after rebate
      const totalAmount = planPrice - rebate;
      setEditTotalAmountPaid(totalAmount);

      // remaining balance
      const balance = totalAmount - partial;
      setOutstandingBalance(balance);

      // sync to backend
      setData("bill_amount", totalAmount);
   }, [data.rebate, editPartial, transaction.customer_plan.plan.plan_price]);

   /** SUBMIT FORM */
   const onSubmit = async (e) => {
      e.preventDefault();

      await patch(route("transactions.update", data.id), {
         onSuccess: () => {
            alert("Transaction updated successfully!");
            window.location.reload();
            reset();
         },
         onError: (errors) => console.log(errors),
      });
   };

   return (
      <AuthenticatedLayout>
         <Head title="Billing Transactions" />

         <div className="flex justify-center overflow-y-auto max-h-[590px]">
            <div className="mb-10 w-full lg:w-[45%] p-4 overflow-auto shadow-md rounded-md border-2 border-sky-500 ">
               <form onSubmit={onSubmit}>
                  
                  {/* CUSTOMER NAME */}
                  <div className="mb-1">
                     <Typography variant="paragraph" color="blue-gray" className="mb-1">
                        Customer Name
                     </Typography>
                     <Input
                        size="md"
                        value={`${transaction.customer_plan.customer.firstname} ${transaction.customer_plan.customer.lastname}`}
                        disabled
                     />
                  </div>

                  {/* ACC NO */}
                  <div className="mb-1">
                     <Typography variant="paragraph" className="mb-1">
                        Acc No.
                     </Typography>
                     <Input size="md" value={data.customer_id} disabled />
                  </div>

                  {/* BILL NO */}
                  <div className="mb-1">
                     <Typography variant="paragraph" className="mb-1">
                        Bill No.
                     </Typography>
                     <Input size="md" value={data.bill_no} disabled />
                  </div>

                  {/* BILL AMOUNT */}
                  <div className="mb-1">
                     <Typography variant="paragraph" className="mb-1">
                        Bill Amount
                     </Typography>
                     <Input
                        size="md"
                        value={transaction.customer_plan.plan.plan_price}
                        disabled
                     />
                  </div>

                  {/* PREVIOUS BALANCE */}
                  <div className="mb-1">
                     <Typography variant="paragraph" className="mb-1">
                        Outstanding Balance Previous Month
                     </Typography>
                     <Input size="md" value={latest.balance ?? 0} disabled />
                  </div>

                  {/* REBATE */}
                  <div className="mb-1">
                     <Typography variant="paragraph" className="mb-1">
                        Rebate
                     </Typography>
                     <Input
                        type="number"
                        value={data.rebate ?? 0}
                        onChange={(e) => {
                           const value = Number(e.target.value);
                           const max = Number(transaction.customer_plan.plan.plan_price);

                           if (value > max) {
                              alert(`Rebate cannot exceed Plan Price (${max}).`);
                              setData("rebate", max);
                           } else {
                              setData("rebate", value);
                           }
                        }}
                        onWheel={(e) => e.target.blur()}
                     />
                  </div>

                  {/* TOTAL DUE */}
                  <div className="mb-1">
                     <Typography variant="paragraph" className="mb-1">
                        Total Amount Due
                     </Typography>
                     <Input value={editTotalAmountPaid} disabled />
                  </div>

                  {/* PARTIAL PAYMENT */}
                  <div className="mb-1">
                     <Typography variant="paragraph" className="mb-1">
                        Payment
                     </Typography>
                     <Input
                        type="number"
                        value={data.partial ?? 0}
                        onChange={(e) => {
                           const value = Number(e.target.value);
                           const computedTotal =
                              Number(transaction.customer_plan.plan.plan_price) -
                              Number(data.rebate || 0);

                           if (value > computedTotal) {
                              alert(`Partial cannot exceed Total Amount Due (${computedTotal}).`);
                              setData("partial", computedTotal);
                              setEditPartial(computedTotal);
                           } else {
                              setData("partial", value);
                              setEditPartial(value);
                           }
                        }}
                        onWheel={(e) => e.target.blur()}
                     />
                  </div>

                  {/* OUTSTANDING BALANCE */}
                  <div className="mb-1">
                     <Typography variant="paragraph" className="mb-1">
                        Outstanding Balance
                     </Typography>
                     <Input value={outstandingBalance} disabled />
                  </div>

                  {/* DATE BILLING */}
                  <div className="mb-3">
                     <Typography variant="paragraph" className="mb-1">
                        Date Billing
                     </Typography>
                     <Input
                        type="date"
                        value={data.date_billing}
                        onChange={(e) => setData("date_billing", e.target.value)}
                        error={!!errors.date_billing}
                     />
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mb-1">
                     <Typography variant="paragraph" className="mb-1">
                        Description
                     </Typography>
                     <Select
                        options={MonthOptions}
                        value={MonthOptions.find((m) => m.value === data.description)}
                        onChange={(selected) =>
                           setData("description", selected?.value || "n/a")
                        }
                     />
                  </div>

                  {/* PAYMENT MODE */}
                  <div className="mb-1">
                     <Typography variant="paragraph" className="mb-1">
                        Payment Mode
                     </Typography>
                     <Select
                        options={PaymentOptions}
                        value={PaymentOptions.find(
                           (option) => option.value === data.mode_payment
                        )}
                        onChange={(selected) =>
                           setData("mode_payment", selected?.value || "N/A")
                        }
                     />
                  </div>

                  {/* STATUS */}
                  <div className="mb-1">
                     <Typography variant="paragraph" className="mb-1">
                        Status
                     </Typography>
                     <Select
                        options={StatusOptions}
                        value={StatusOptions.find(
                           (option) => option.value === data.status
                        )}
                        onChange={(selected) =>
                           setData("status", selected?.value || "")
                        }
                     />
                  </div>

                  <Button type="submit" color="blue" fullWidth>
                     Update
                  </Button>

                  {/* PRINT BUTTON */}
                  <a
                     href={`/admin/transactions/print/${transaction.id}`}
                     target="_blank"
                     className="mt-4 inline-block w-full rounded-lg bg-green-600 px-4 py-2 text-center text-white font-semibold shadow-md hover:bg-green-700"
                  >
                     Print
                  </a>
               </form>
            </div>
         </div>
      </AuthenticatedLayout>
   );
};

export default Edit;
