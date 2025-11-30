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

const Create = () => {
   const API_URL = UseAppUrl();

   const [barangays, setBarangays] = useState([]);
   const [selectedBarangayId, setBarangayId] = useState("");
   const { data, setData, post, errors, reset, processing } = useForm({
      purok_name: "",
      barangay_id: selectedBarangayId,
   });

   const onSubmit = async (e) => {
      e.preventDefault();

      await post(route("address.store"), {
         onSuccess: () => {
            alert("Address was added successfully!");
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
         const response = await axios.get(`${API_URL}/api/barangay_options`);
         setBarangays(response.data);
      } catch (error) {
         console.error("Error fetching barangays:", error);
         alert("Failed to fetch barangays.");
      }
   };

   useEffect(() => {
      fetchBarangays();
   }, []);

   const barangayOptions = barangays.map((barangay) => ({
      value: barangay.id.toString(),
      label:
         barangay.barangay_name +
         " - " +
         barangay.municipality.municipality_name,
   }));

   return (
      <AuthenticatedLayout>
         <Head title="Add Address" />
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
                              href="/admin/address"
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
                        Add Address
                     </Typography>

                     <form onSubmit={onSubmit} className="mt-8 mb-2">
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Purok Name
                           </Typography>
                           <Input
                              size="md"
                              value={data.purok_name}
                              onChange={(e) =>
                                 setData("purok_name", e.target.value)
                              }
                              error={Boolean(errors.purok_name)}
                              className="w-full"
                           />
                        </div>
                        <div className=" mb-3">
                           <div>
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Address
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
                                       "barangay_id",
                                       value ? parseInt(value, 10) : null
                                    );
                                 }}
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
