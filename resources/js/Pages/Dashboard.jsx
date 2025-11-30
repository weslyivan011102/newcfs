import { MdAccountCircle } from "react-icons/md";
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import SkeletonCard from "@/Components/SkeletonCard";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import UseAppUrl from "@/hooks/UseAppUrl";
import useCurrency from "@/hooks/useCurrency";

export default function Dashboard({
  activeCustomers,
  inactiveCustomers,
  collectors,
  bannedcustomers,
}) {
  const API_URL = UseAppUrl();
  const { formatCurrency } = useCurrency();

  const currentYear = new Date().getFullYear();
  const [summary, setSummary] = useState(null);
  const [month, setMonth] = useState(""); // default: no month selected
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(true);

  // Municipality Chart
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: { type: "area", height: 350 },
      xaxis: { categories: [] },
    },
  });

  // Collection Chart
  const [collectionChart, setCollectionChart] = useState({
    series: [{ name: "Total Collection", data: [] }],
    options: {
      chart: { type: "bar", height: 350 },
      plotOptions: { bar: { horizontal: true } },
      dataLabels: {
        enabled: true,
        formatter: (val) => `₱${val.toLocaleString()}`,
      },
      xaxis: { categories: ["Paid", "Unpaid", "Rebate", "Cheque"] },
      tooltip: { y: { formatter: (val) => `₱${val.toLocaleString()}` } },
    },
  });

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/transaction-summary`, {
        params: { month: month || undefined, year },
      });
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Municipality Chart Data
  useEffect(() => {
    setChartLoading(true);
    axios
      .get(`${API_URL}/api/customers/count-by-municipality`)
      .then((res) => {
        const data = res.data;
        setChartData({
          series: [
            { name: "Total Customers", data: data.map((item) => item.total_customers) },
          ],
          options: {
            chart: { type: "area", height: 350, stacked: true },
            dataLabels: { enabled: false },
            stroke: { curve: "smooth" },
            xaxis: {
              categories: data.map((item) => item.municipality_name),
              title: { text: "Municipality" },
            },
            yaxis: { title: { text: "Number of Customers" } },
            tooltip: { y: { formatter: (val) => `${val} Customers` } },
            fill: {
              opacity: 0.3,
              type: "gradient",
              gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.2, stops: [0, 90, 100] },
            },
          },
        });
      })
      .finally(() => setChartLoading(false));
  }, []);

  // Update Collection Chart whenever summary changes
  useEffect(() => {
    if (summary) {
      const paidTotal = summary?.paid?.total_partial ?? 0;
      const unpaidTotal = summary?.unpaid?.total_planprice ?? 0;
      const rebateTotal = summary?.overall?.total_rebate ?? 0;
      const chequeTotal = summary?.cheque?.total_cheque ?? 0;

      setCollectionChart((prev) => ({
        ...prev,
        series: [{ name: "Total Collection", data: [paidTotal, unpaidTotal, rebateTotal, chequeTotal] }],
        options: {
          ...prev.options,
          xaxis: { ...prev.options.xaxis, categories: ["Paid", "Unpaid", "Rebate", "Cheque"] },
        },
      }));
    }
  }, [summary]);

  useEffect(() => {
    fetchSummary();
  }, [month, year]);

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
    >
      <Head title="CFS INTERNET NETWORK SOLUTIONS" />

      <div className="bg-white overflow-y-auto max-h-[550px]">
        <div className="p-6 grid grid-cols-3 gap-4">
          {/* Active Customers */}
          <div className="relative bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 text-white p-4 rounded-full">
                <MdAccountCircle size={30} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Total Active Customers</h3>
                <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
              </div>
            </div>
          </div>

          {/* Collectors */}
          <div className="relative bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 text-white p-4 rounded-full">
                <MdAccountCircle size={30} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Total Collector</h3>
                <p className="text-2xl font-bold text-gray-900">{collectors}</p>
              </div>
            </div>
          </div>

          {/* Inactive Customers */}
          <div className="relative bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 text-white p-4 rounded-full">
                <MdAccountCircle size={30} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Total Disconnection</h3>
                <p className="text-2xl font-bold text-gray-900">{inactiveCustomers}</p>
              </div>
            </div>
          </div>

          {/* Banned Customers */}
          <div className="relative bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 text-white p-4 rounded-full">
                <MdAccountCircle size={30} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Total Banned Customers</h3>
                <p className="text-2xl font-bold text-gray-900">{bannedcustomers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="p-6 bg-white shadow-md rounded-xl">
          <h2 className="text-xl font-bold mb-4">
            Transaction Summary {month ? `(Month: ${month}/${year})` : `(Year: ${year})`}
          </h2>

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">-- Whole Year --</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {!loading && summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Net Pay */}
              <div className="bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
                <h3 className="font-semibold mb-2">Overall Net Pay</h3>
                <p className="font-bold text-green-600">
                  Net Pay: {formatCurrency(summary.overall.net_pay)}
                </p>
              </div>

              {/* Overall Rebate */}
              <div className="bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
                <h3 className="font-semibold mb-2">Overall Rebate</h3>
                <p className="font-bold text-green-600">
                  Total Rebate: {formatCurrency(summary.overall.total_rebate)}
                </p>
              </div>

              {/* Overall Collection */}
              <div className="bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
                <h3 className="font-semibold mb-2">Overall Collection</h3>
                <p className="font-bold text-green-600">
                  Total Payment: {formatCurrency(summary.overall.total_partial)}
                </p>
                <p className="font-bold text-green-600">
                  Total Paid Customer: {summary?.paid?.count ?? 0}
                </p>
              </div>

              {/* Total Arrears */}
              <div className="bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
                <h3 className="font-semibold mb-2">Total Arrears</h3>
                <p className="font-bold text-green-600">
                  Total Unpaid Customers: {summary?.unpaid?.count ?? 0}
                </p>
                <p className="font-bold text-green-600">
                  Total Unpaid Collections: {formatCurrency(summary?.unpaid?.total_planprice ?? 0)}
                </p>
              </div>

              {/* Advance */}
              <div className="bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
                <h3 className="font-semibold mb-2">Advance Billing Collection</h3>
                <p className="font-bold text-green-600">
                  Total Payment: {formatCurrency(summary.advance.total_partial)}
                </p>
                <p className="font-bold text-green-600">
                  Total Rebate: {formatCurrency(summary.advance.total_rebate)}
                </p>
              </div>

              {/* Batch */}
              <div className="bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
                <h3 className="font-semibold mb-2">Batch Billing Collection</h3>
                <p className="font-bold text-green-600">
                  Total Payment: {formatCurrency(summary.batch.total_partial)}
                </p>
                <p className="font-bold text-green-600">
                  Total Rebate: {formatCurrency(summary.batch.total_rebate)}
                </p>
              </div>

              {/* Cash */}
              <div className="bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
                <h3 className="font-semibold mb-2">Cash Payment Mode</h3>
                <p className="font-bold text-green-600">
                  Total Cash: {formatCurrency(summary.cash.total_cash)}
                </p>
                <p className="font-bold text-green-600">
                  Total Cash Customers: {summary.cash.count}
                </p>
              </div>

              {/* GCash */}
              <div className="bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
                <h3 className="font-semibold mb-2">GCash Payment Mode</h3>
                <p className="font-bold text-green-600">
                  Total GCash: {formatCurrency(summary.gcash.total_gcash)}
                </p>
                <p className="font-bold text-green-600">
                  Total GCash Customers: {summary.gcash.count}
                </p>
              </div>

              {/* Cheque */}
              <div className="bg-white p-6 rounded-xl shadow-md h-[140px] border-l-4 border-blue-500">
                <h3 className="font-semibold mb-2">Cheque Payment Mode</h3>
                <p className="font-bold text-green-600">
                  Total Cheque: {formatCurrency(summary.cheque.total_cheque)}
                </p>
                <p className="font-bold text-green-600">
                  Total Cheque Customers: {summary.cheque.count}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 p-6">
          <div>
            <h1 className="text-lg font-bold mb-4">Customer Chart Per Municipality</h1>
            {chartLoading ? <SkeletonCard /> : (
              <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={350} />
            )}
          </div>

          <div>
            <h1 className="text-lg font-bold mb-4">Total Collection Chart (Paid/Unpaid/Rebate/Cheque)</h1>
            {loading || !summary ? <SkeletonCard /> : (
              <ReactApexChart options={collectionChart.options} series={collectionChart.series} type="bar" height={350} />
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
