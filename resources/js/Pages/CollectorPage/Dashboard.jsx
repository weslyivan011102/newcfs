import AuthenticatedLayoutCollector from "@/Layouts/AuthenticatedLayoutCollector";
import { Head } from "@inertiajs/react";
import React from "react";

const Dashboard = () => {
   return (
      <AuthenticatedLayoutCollector
         header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
               Dashboard
            </h2>
         }
      >
         <Head title="Dashboard" />
         <div>Collector Dashboard</div>
      </AuthenticatedLayoutCollector>
   );

};

export default Dashboard;
