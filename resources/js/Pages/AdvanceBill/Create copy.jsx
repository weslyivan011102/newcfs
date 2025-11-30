import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
    IconButton,
    Textarea,
} from "@material-tailwind/react";
import Select from "react-select";

const Create = () => {
    const sexOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
    ];

    const maritalStatusOptions = [
        { value: "single", label: "Single" },
        { value: "married", label: "Married" },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Add Customer" />
            <div className="bg-[#F6F6F6] max-h-[600px] overflow-y-auto  flex justify-center items-center ">
                <Card
                    color="white"
                    className="w-full max-w-lg p-8 shadow-lg rounded-md mt-16 mb-2"
                >
                    <Typography
                        variant="h4"
                        color="blue-gray"
                        className="text-center"
                    >
                        Add Customer
                    </Typography>

                    <form className="mt-8 mb-2">
                        <div className="mb-3">
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-1"
                            >
                                First Name
                            </Typography>
                            <Input
                                size="md"
                                className="w-full !border-gray-300 focus:!border-gray-500"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-1"
                            >
                                Middle Name
                            </Typography>
                            <Input
                                size="md"
                                className="w-full !border-gray-300 focus:!border-gray-500"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-1"
                            >
                                Last Name
                            </Typography>
                            <Input
                                size="md"
                                placeholder="John Doe"
                                className="w-full !border-gray-300 focus:!border-gray-500"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-1"
                            >
                                Sex
                            </Typography>
                            <Select
                                options={sexOptions}
                                placeholder="Choose a flavor"
                                isClearable
                            />
                        </div>
                        <div className="mb-3">
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-1"
                            >
                                Marital Status
                            </Typography>
                            <Select
                                options={maritalStatusOptions}
                                placeholder="Choose a marital status"
                                isClearable
                            />
                        </div>
                        <div className="mb-3">
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-1"
                            >
                                Birthdate
                            </Typography>
                            <Input
                                type="date"
                                size="md"
                                className="w-full !border-gray-300 focus:!border-gray-500"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-1"
                            >
                                Address
                            </Typography>
                            <Textarea label="Message" />
                        </div>
                        <div className="mb-3">
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-1"
                            >
                                Occupation
                            </Typography>
                            <Input
                                size="md"
                                className="w-full !border-gray-300 focus:!border-gray-500"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                            />
                        </div>

                        <Button className="mt-6 w-full" color="blue" fullWidth>
                            Sign Up
                        </Button>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
