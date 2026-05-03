import { useState } from "react";
import UserTable from "../../components/admin/UserTable"; // we will create this

export default function AdminPage() {
  // const [activeSection, setActiveSection] = useState("");

  return (
  //   <div className="space-y-6">
  //     <div>
  //       <h2 className="text-2xl font-bold">Admin Panel</h2>
  //       <p className="text-slate-500">
  //         Manage items, engineers, employees and users
  //       </p>
  //     </div>

  //     {/* ACTION CARDS */}
  //     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
  //       <div
  //         onClick={() => setActiveSection("items")}
  //         className="border rounded-2xl p-5 bg-slate-50 cursor-pointer hover:bg-slate-100"
  //       >
  //         Add / Edit / Delete Item Codes
  //       </div>

  //       <div
  //         onClick={() => setActiveSection("engineers")}
  //         className="border rounded-2xl p-5 bg-slate-50 cursor-pointer hover:bg-slate-100"
  //       >
  //         Add / Delete Engineers
  //       </div>

  //       <div
  //         onClick={() => setActiveSection("users")}
  //         className="border rounded-2xl p-5 bg-slate-50 cursor-pointer hover:bg-slate-100"
  //       >
  //         Create Company-wise User ID
  //       </div>

  //       <div
  //         onClick={() => setActiveSection("password")}
  //         className="border rounded-2xl p-5 bg-slate-50 cursor-pointer hover:bg-slate-100"
  //       >
  //         Change / Block Password
  //       </div>
  //     </div>

  //     {/* DYNAMIC SECTION */}
  //     <div className="mt-6">
  //       {activeSection === "users" && <UserForm />}
  //       {activeSection === "items" && <p>Item Module Coming Soon</p>}
  //       {activeSection === "engineers" && <p>Engineer Module Coming Soon</p>}
  //       {activeSection === "password" && <p>Password Module Coming Soon</p>}
  //     </div>
  //   </div>
    <UserTable />
  );
  
}