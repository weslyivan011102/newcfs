import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
   Card,
   CardBody,
   CardFooter,
   Typography,
   Button,
} from "@material-tailwind/react";

const BillCard = () => {
   const billingData = [
      {
         title: "Batch Billing",
         description: "Generate bills for multiple users at once.",
         href: "/batch_bills",
         buttonText: "Start Batch Billing",
      },
      {
         title: "Advance Billing",
         description: "Create future-dated bills ahead of time.",
         href: "/advance_bills",
         buttonText: "Set Up Advance Bill",
      },
   ];

   return (
      <AuthenticatedLayout>
         <Head title="Customer Plans" />
         <div className="flex flex-wrap justify-center items-center gap-6 mt-6 h-full">
            {billingData.map(({ title, description, href, buttonText }) => (
               <Card key={title} className="w-80 text-center">
                  <CardBody>
                     <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mb-2"
                     >
                        {title}
                     </Typography>
                     <Typography>{description}</Typography>
                  </CardBody>
                  <CardFooter className="pt-0">
                     <a
                        href={href}
                        className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                     >
                        {buttonText}
                     </a>
                  </CardFooter>
               </Card>
            ))}
         </div>
      </AuthenticatedLayout>
   );
};

export default BillCard;
