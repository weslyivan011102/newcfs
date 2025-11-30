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
   CardBody,
   CardFooter,
} from "@material-tailwind/react";
import Select from "react-select";

const Create = ({ collectors }) => {
   const { data, setData, post, errors, reset, processing } = useForm({
      firstname: "",
      middlename: "",
      lastname: "",
      sex: "",
      marital_status: "",
      birthdate: "",
      address: "",
      occupation: "",
      contact_no: "",
   });

   const onSubmit = async (e) => {
      e.preventDefault();

      await post(route("customers.store"), {
         onSuccess: () => {
            alert("Customer was added successfully!");
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

   console.log(collectors);

   return (
      <AuthenticatedLayout>
         <Head title="Add Customer" />
         <div className="bg-white overflow-y-auto max-h-[590px] grid place-justify-center ">
            <div className="mt-2 px-4">
               <div className="mb-6 flex justify-between ">
                  <Card
                     color="white"
                     className=" mx-auto w-full max-w-xl  p-8 shadow-md rounded-md mt-1 mb-2"
                  >
                     <div className="flex justify-end mb-2">
                        <Tooltip content="Back">
                           <Link
                              href="/admin/customers"
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
                        Add Customer
                     </Typography>

                     <form onSubmit={onSubmit} className="mt-8 mb-2">
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              First Name
                           </Typography>
                           <Input
                              size="md"
                              value={data.firstname}
                              onChange={(e) =>
                                 setData("firstname", e.target.value)
                              }
                              error={Boolean(errors.firstname)}
                              className="w-full"
                           />
                        </div>
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Middle Name
                           </Typography>
                           <Input
                              size="md"
                              value={data.middlename}
                              onChange={(e) =>
                                 setData("middlename", e.target.value)
                              }
                              error={Boolean(errors.middlename)}
                           />
                        </div>
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Last Name
                           </Typography>
                           <Input
                              size="md"
                              value={data.lastname}
                              onChange={(e) =>
                                 setData("lastname", e.target.value)
                              }
                              error={Boolean(errors.lastname)}
                           />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Sex
                              </Typography>
                              <Select
                                 options={sexOptions}
                                 placeholder="Choose a sex"
                                 isClearable
                                 value={sexOptions.find(
                                    (option) => option.value === data.sex
                                 )}
                                 onChange={(selectedOption) =>
                                    setData(
                                       "sex",
                                       selectedOption
                                          ? selectedOption.value
                                          : ""
                                    )
                                 }
                                 className={`${
                                    errors.sex ? "border border-red-600" : ""
                                 }`}
                              />
                           </div>
                           <div className="mb-3">
                              <Typography
                                 variant="paragraph"
                                 color="blue-gray"
                                 className="mb-1 "
                              >
                                 Marital Status
                              </Typography>
                              <Select
                                 options={maritalStatusOptions}
                                 placeholder="Choose a marital status"
                                 isClearable
                                 value={maritalStatusOptions.find(
                                    (option) =>
                                       option.value === data.marital_status
                                 )}
                                 onChange={(selectedOption) =>
                                    setData(
                                       "marital_status",
                                       selectedOption
                                          ? selectedOption.value
                                          : ""
                                    )
                                 }
                                 className={`${
                                    errors.marital_status
                                       ? "border border-red-600"
                                       : ""
                                 }`}
                              />
                           </div>
                        </div>

                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Birthdate
                           </Typography>
                           <Input
                              type="date"
                              value={data.birthdate}
                              onChange={(e) =>
                                 setData("birthdate", e.target.value)
                              }
                              error={Boolean(errors.birthdate)}
                              size="md"
                           />
                        </div>
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Address
                           </Typography>
                           <Textarea
                              value={data.address}
                              onChange={(e) =>
                                 setData("address", e.target.value)
                              }
                              error={Boolean(errors.address)}
                           />
                        </div>
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Occupation
                           </Typography>
                           <Input
                              size="md"
                              value={data.occupation}
                              onChange={(e) =>
                                 setData("occupation", e.target.value)
                              }
                              error={Boolean(errors.occupation)}
                           />
                        </div>
                        <div className="mb-3">
                           <Typography
                              variant="paragraph"
                              color="blue-gray"
                              className="mb-1 "
                           >
                              Cellphone No
                           </Typography>

                           <div className="relative flex w-full">
                              <Button
                                 variant="text"
                                 color="blue-gray"
                                 className="h-10 w-14 shrink-0 rounded-r-none border border-r-0 border-blue-gray-200 bg-transparent px-3"
                              >
                                 +63
                              </Button>
                              <Input
                                 type="number"
                                 value={data.contact_no}
                                 onChange={(e) =>
                                    setData("contact_no", e.target.value)
                                 }
                                 error={Boolean(errors.contact_no)}
                                 inputMode="numeric"
                                 maxLength={10}
                                 onInput={(e) => {
                                    if (e.target.value.length > 10) {
                                       e.target.value = e.target.value.slice(
                                          0,
                                          10
                                       );
                                    }
                                 }}
                                 className="appearance-none rounded-l-none border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                 labelProps={{
                                    className:
                                       "before:content-none after:content-none",
                                 }}
                                 containerProps={{
                                    className: "min-w-0",
                                 }}
                              />
                           </div>
                        </div>

                        <hr className="mt-5" />
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
