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
import { useEffect, useState } from "react";
import UseAppUrl from "@/hooks/UseAppUrl";

const Edit = ({ barangay }) => {
   const API_URL = UseAppUrl();

   console.log(barangay.barangay_name);

   const [barangays, setBarangays] = useState([]);
   const [selectedBarangayId, setBarangayId] = useState(
      barangay.municipality_id ? barangay.municipality_id.toString() : ""
   );
   const { data, setData, patch, errors, reset, processing } = useForm({
      barangay_name: barangay.barangay_name || "",
      municipality_id: selectedBarangayId,
   });

   const onSubmit = async (e) => {
      e.preventDefault();

      await patch(route("barangays.update", barangay.id), {
         onSuccess: () => {
            alert("Barangay was updated successfully!");
            window.location.reload();
            reset();
         },
         onError: (errors) => {
            console.log(errors);
         },
      });
   };

   const sexOptions = [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
   ];

   const maritalStatusOptions = [
      { value: "single", label: "Single" },
      { value: "married", label: "Married" },
      { value: "divorced", label: "Divorced" },
      { value: "widowed", label: "Widowed" },
      { value: "separated", label: "Separated" },
   ];

   const fetchBarangays = async () => {
      try {
         const response = await axios.get(
            `${API_URL}/api/municipality_options`
         );
         setBarangays(response.data);
      } catch (error) {
         console.error("Error fetching municipalies:", error);
         alert("Failed to fetch municipalities.");
      }
   };

   useEffect(() => {
      fetchBarangays();
   }, []);

   const barangayOptions = barangays.map((barangay) => ({
      value: barangay.id.toString(),
      label: barangay.municipality_name,
   }));

   return (
      <AuthenticatedLayout>
         <Head title="Edit Barangay" />
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
                              href="/admin/barangays"
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
                        Edit Barangay
                     </Typography>

                     <form onSubmit={onSubmit} className="mt-8 mb-2">
                        <div className=" mb-3">
                           <div>
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Municipality
                              </Typography>

                              <Select
                                 value={barangayOptions.find(
                                    (option) =>
                                       option.value === selectedBarangayId
                                 )}
                                 options={barangayOptions}
                                 onChange={(selectedOption) => {
                                    const value = selectedOption?.value || "";
                                    setBarangayId(value);
                                    setData(
                                       "municipality_id",
                                       value ? parseInt(value, 10) : null
                                    );
                                 }}
                              />
                           </div>
                        </div>
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Barangay Name
                           </Typography>
                           <Input
                              size="md"
                              value={data.barangay_name}
                              onChange={(e) =>
                                 setData("barangay_name", e.target.value)
                              }
                              error={Boolean(errors.barangay_name)}
                              className="w-full"
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
