import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@material-tailwind/react";
import React, { useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";

const Show = ({ transactions, grand_totals, filters }) => {
  // Refs for printing each section separately
  const dailyRef = useRef();
  const monthlyRef = useRef();
  const yearlyRef = useRef();

  const printDaily = useReactToPrint({ content: () => dailyRef.current });
  const printMonthly = useReactToPrint({ content: () => monthlyRef.current });
  const printYearly = useReactToPrint({ content: () => yearlyRef.current });

  const MONTH_LABELS = {
    "n/a": "SELECT MONTH",
    january: "JAN BILL",
    february: "FEB BILL",
    march: "MAR BILL",
    april: "APR BILL",
    may: "MAY BILL",
    june: "JUN BILL",
    july: "JUL BILL",
    august: "AUG BILL",
    september: "SEP BILL",
    october: "OCT BILL",
    november: "NOV BILL",
    december: "DEC BILL",
  };

  return (
    <AuthenticatedLayout>
      <Head title="Collection Report" />

      {/* PRINT BUTTONS */}
      <div className="flex gap-3 justify-center mb-4">
        <Button color="green" onClick={printDaily} className="transition duration-200 hover:brightness-110 hover:scale-105 hover:shadow-lg">Print Daily</Button>
        <Button color="blue" onClick={printMonthly} className="transition duration-200 hover:brightness-110 hover:scale-105 hover:shadow-lg">Print Monthly</Button>
        <Button color="amber" onClick={printYearly} className="transition duration-200 hover:brightness-110 hover:scale-105 hover:shadow-lg">Print Yearly</Button>
      </div>

      {/* DAILY COLLECTION */}
      <div ref={dailyRef} className="w-full px-4 mx-auto bg-white py-8 mb-10 shadow">
        <div className="flex items-start justify-between border-b pb-4">
          <div className="flex space-x-4">
            <img src="/img/logo.png" className="w-10 h-10" />
            <div className="text-sm">
              <h1 className="font-bold text-[10px]">CFS INTERNET NETWORK SOLUTIONS</h1>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center my-4 border-b pb-2">
          <div className="text-[10px]">
            <h1>
              Daily Collection Report
              <span className="font-semibold">
                {transactions[0]?.customer_plan?.collector
                  ? ` by ${transactions[0].customer_plan.collector.firstname} ${transactions[0].customer_plan.collector.lastname}`
                  : ""}
              </span>
            </h1>
          </div>
        </div>

        {/* DAILY TABLE */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-[6px]">
              <th className="border px-2 py-1">#</th>
              <th className="border px-5 py-1">Bill No.</th>
              <th className="border px-2 py-1">Billing Date</th>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">Customer</th>
              <th className="border px-2 py-1">Address</th>
              <th className="border px-2 py-1">Payment</th>
              <th className="border px-2 py-1">Rebate</th>
              <th className="border px-2 py-1">Balance</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Collected By</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, i) => (
              <tr key={t.id}>
                <td className="border px-2 py-1 text-[7px]">{i + 1}</td>
                <td className="border px-2 py-1 text-[7px]">{t.bill_no}</td>
                <td className="border px-2 py-1 text-[7px]">{new Date(t.date_billing).toLocaleDateString("en-US")}</td>
                <td className="border px-2 py-1 text-[7px]">{MONTH_LABELS[t.description] || t.description}</td>
                <td className="border px-2 py-1 text-[7px]">{t.customer_plan?.customer?.lastname}, {t.customer_plan?.customer?.firstname}</td>
                <td className="border px-2 py-1 text-[7px]">{t.customer_plan?.customer?.purok?.purok_name}, {t.customer_plan?.customer?.purok?.barangay?.barangay_name}</td>
                <td className="border px-2 py-1 text-[7px]">₱{t.partial.toLocaleString()}</td>
                <td className="border px-2 py-1 text-[7px]">₱{t.rebate.toLocaleString()}</td>
                <td className="border px-2 py-1 text-[7px]">₱{t.outstanding_balance.toLocaleString()}</td>
                <td className="border px-2 py-1 text-[7px]">{t.status}</td>
                <td className="border px-2 py-1 text-[7px]">{t.customer_plan?.collector?.firstname}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-gray-100 font-semibold text-[8px]">
              <td colSpan="6" className="border px-2 py-1 text-right">Totals:</td>
              <td className="border px-2 py-1">₱{grand_totals.partial.toLocaleString()}</td>
              <td className="border px-2 py-1">₱{grand_totals.rebate.toLocaleString()}</td>
              <td className="border px-2 py-1">₱{grand_totals.balance.toLocaleString()}</td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>

        <div className="flex justify-end mt-3">
          <div className="text-center">
            <p className="text-[8px] font-semibold">Checked By:</p>
            <p className="text-[8px]">MELONY A. BARCELO</p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Show;
