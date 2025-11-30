import AuthenticatedLayoutCollector from "@/Layouts/AuthenticatedLayoutCollector";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function Create() {
   const [form, setForm] = useState({
      dateCollected: "",
      receiptNumber: "",
      paymentMethod: "",
      clientName: "",
      collectedBy: "Jomar Ballesteros",
      note: "",
      fees: {
         balance: 0,
         installation: 0,
         monthly: 0,
      },
      discount: 0,
      discountReason: "",
   });

   return (
      <AuthenticatedLayoutCollector
         header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
               Dashboard
            </h2>
         }
      >
         <Head title="Collection List" />
         <div className="p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-6">Add New Collection</h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Left side */}
               <div className="space-y-4">
                  {/* Date Collected */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Collected *
                     </label>
                     <input
                        type="date"
                        value={form.dateCollected}
                        onChange={(e) =>
                           setForm({ ...form, dateCollected: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                     />
                  </div>

                  {/* Receipt Number */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Receipt Number
                     </label>
                     <input
                        type="text"
                        value={form.receiptNumber}
                        onChange={(e) =>
                           setForm({ ...form, receiptNumber: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                     />
                  </div>

                  {/* Payment Method */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method *
                     </label>
                     <select
                        value={form.paymentMethod}
                        onChange={(e) =>
                           setForm({ ...form, paymentMethod: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                     >
                        <option value="">Select an option</option>
                        <option value="cash">Cash</option>
                        <option value="gcash">GCash</option>
                        <option value="bank">Bank Transfer</option>
                     </select>
                  </div>

                  {/* Client Name */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Name *
                     </label>
                     <select
                        value={form.clientName}
                        onChange={(e) =>
                           setForm({ ...form, clientName: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                     >
                        <option value="">Select an option</option>
                        <option value="client1">Client 1</option>
                        <option value="client2">Client 2</option>
                     </select>
                  </div>

                  {/* Collected By */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Collected By
                     </label>
                     <input
                        type="text"
                        value={form.collectedBy}
                        readOnly
                        className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                     />
                  </div>

                  {/* Note */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note
                     </label>
                     <textarea
                        rows={3}
                        value={form.note}
                        onChange={(e) =>
                           setForm({ ...form, note: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                     ></textarea>
                  </div>
               </div>

               {/* Right side */}
               <div className="space-y-4">
                  {/* Categories Table */}
                  <div className="border rounded-lg">
                     <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                           <tr>
                              <th className="px-3 py-2 text-left">
                                 <input type="checkbox" />
                              </th>
                              <th className="px-3 py-2 text-left">Category</th>
                              <th className="px-3 py-2 text-left">Fee</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr className="border-b">
                              <td className="px-3 py-2">
                                 <input type="checkbox" />
                              </td>
                              <td className="px-3 py-2">
                                 Balance From Previous Bills
                              </td>
                              <td className="px-3 py-2">
                                 <input
                                    type="number"
                                    value={form.fees.balance}
                                    onChange={(e) =>
                                       setForm({
                                          ...form,
                                          fees: {
                                             ...form.fees,
                                             balance: e.target.value,
                                          },
                                       })
                                    }
                                    className="w-full border rounded px-2 py-1"
                                 />
                              </td>
                           </tr>
                           <tr className="border-b">
                              <td className="px-3 py-2">
                                 <input type="checkbox" />
                              </td>
                              <td className="px-3 py-2">Installation Fee</td>
                              <td className="px-3 py-2">
                                 <input
                                    type="number"
                                    value={form.fees.installation}
                                    onChange={(e) =>
                                       setForm({
                                          ...form,
                                          fees: {
                                             ...form.fees,
                                             installation: e.target.value,
                                          },
                                       })
                                    }
                                    className="w-full border rounded px-2 py-1"
                                 />
                              </td>
                           </tr>
                           <tr>
                              <td className="px-3 py-2">
                                 <input type="checkbox" />
                              </td>
                              <td className="px-3 py-2">Net Monthly Fee</td>
                              <td className="px-3 py-2">
                                 <input
                                    type="number"
                                    value={form.fees.monthly}
                                    onChange={(e) =>
                                       setForm({
                                          ...form,
                                          fees: {
                                             ...form.fees,
                                             monthly: e.target.value,
                                          },
                                       })
                                    }
                                    className="w-full border rounded px-2 py-1"
                                 />
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  {/* Totals */}
                  <div className="space-y-3">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Total Collection
                        </label>
                        <input
                           type="text"
                           value="0.00"
                           readOnly
                           className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Discount
                        </label>
                        <input
                           type="number"
                           value={form.discount}
                           onChange={(e) =>
                              setForm({ ...form, discount: e.target.value })
                           }
                           className="w-full border rounded-lg px-3 py-2"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Discount Reason
                        </label>
                        <input
                           type="text"
                           value={form.discountReason}
                           onChange={(e) =>
                              setForm({
                                 ...form,
                                 discountReason: e.target.value,
                              })
                           }
                           className="w-full border rounded-lg px-3 py-2"
                        />
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Discounted Total Collection
                        </label>
                        <input
                           type="text"
                           value="0.00"
                           readOnly
                           className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                        />
                     </div>
                  </div>
               </div>

               {/* Action buttons */}
               <div className="col-span-2 flex justify-end gap-3 pt-4">
                  <button
                     type="button"
                     className="px-4 py-2 rounded-lg bg-gray-500 text-white"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                  >
                     Save
                  </button>
               </div>
            </form>
         </div>
      </AuthenticatedLayoutCollector>
   );
}
