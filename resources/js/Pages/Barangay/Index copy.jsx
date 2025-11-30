import { AiOutlinePlus } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Head, usePage, Deferred, Link } from "@inertiajs/react";
import {
    Avatar,
    Card,
    IconButton,
    Tooltip,
    Typography,
    Drawer,
    Button,
    Select,
    Option,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Customer Name", "Address", "Cellphone No.", ""];
const Index = () => {
    const { customers } = usePage().props;
    return (
        <AuthenticatedLayout>
            <Head title="Customers" />

            <div className="bg-[#F6F6F6] overflow-y-auto max-h-[550px]">
                <div className="mt-5  px-4">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <Typography
                                variant="lead"
                                size="small"
                                className="mb-0 text-lg font-bold"
                            >
                                Customers
                            </Typography>
                            <Typography
                                className="text-sm"
                                variant="paragraph"
                                size="small"
                            >
                                Manage customers
                            </Typography>
                        </div>
                        <div>
                            <Button
                                className="flex gap-2 items-center"
                                color="blue"
                                size="md"
                            >
                                <AiOutlinePlus className="text-lg" />
                                Add Customer
                            </Button>
                        </div>
                    </div>

                    <div className="w-full  grid md:grid-cols-4 gap-2 grid-cols-1">
                        <div className="relative col-span-2">
                            <input
                                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                placeholder="Search documents..."
                            />
                            <AiOutlineSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                        </div>
                        <div>
                            <Select label="Category">
                                <Option>Material Tailwind HTML</Option>
                                <Option>Material Tailwind React</Option>
                                <Option>Material Tailwind Vue</Option>
                                <Option>Material Tailwind Angular</Option>
                                <Option>Material Tailwind Svelte</Option>
                            </Select>
                        </div>
                        <div>
                            <Select label="Select Status">
                                <Option>Active</Option>
                                <Option>Inactive</Option>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex-1  p-4  overflow-x-auto max-w-min md:max-w-full">
                    <table className="w-full min-w-[350px] text-left  border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="px-6 py-3 text-sm font-semibold bg-gray-300 text-gray-700 uppercase border border-gray-400"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="text-[12px] font-normal leading-none opacity-70"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <Deferred
                                data={["customers"]}
                                fallback={
                                    <>
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="text-center"
                                            >
                                                Loading....
                                            </td>
                                        </tr>
                                    </>
                                }
                            >
                                {Array.isArray(customers) &&
                                customers.length > 0 ? (
                                    customers.map((customer, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="hover:bg-blue-gray-50"
                                            >
                                                <td className="border border-blue-gray-100 px-4 py-1">
                                                    <Typography
                                                        variant="small"
                                                        className="text-gray-800 text-[13px]"
                                                    >
                                                        {customer.firstname}
                                                    </Typography>
                                                </td>

                                                <td className="border border-blue-gray-100 px-4">
                                                    <Typography
                                                        variant="small"
                                                        className="font-normal text-gray-800 text-[13px]"
                                                    >
                                                        {customer.address}
                                                    </Typography>
                                                </td>

                                                <td className="border border-blue-gray-100 px-4">
                                                    <Typography
                                                        variant="small"
                                                        className="font-normal text-gray-800 text-[13px]"
                                                    >
                                                        {customer.cellphone_no}
                                                    </Typography>
                                                </td>

                                                <td className="border border-blue-gray-100 px-4">
                                                    <IconButton variant="text">
                                                        <BiDotsVertical className="text-md" />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center text-gray-500"
                                        >
                                            No Customer found.
                                        </td>
                                    </tr>
                                )}
                            </Deferred>
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
