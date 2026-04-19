export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-slate-500">Manage items, engineers, employees and users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="border rounded-2xl p-5 bg-slate-50">Add / Edit / Delete Item Codes</div>
        <div className="border rounded-2xl p-5 bg-slate-50">Add / Delete Engineers</div>
        <div className="border rounded-2xl p-5 bg-slate-50">Create Company-wise User ID</div>
        <div className="border rounded-2xl p-5 bg-slate-50">Change / Block Password</div>
      </div>
    </div>
  );
}