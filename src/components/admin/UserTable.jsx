import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserForm from "../UserForm"; // adjust path if needed
import EditUserForm from "../EditUserForm";

import { getUsers, searchUsers, changeUserStatus, updateUser, getUserById } from "../../api/userService";

import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import UserRowActions from "./UserRowActions";

export default function UserTable() {
  const [mode, setMode] = useState("edit"); // or "edit"
  const [showForm, setShowForm] = useState(false);
  // const [users, setUsers] = useState([]);

  // const [allUsers, setAllUsers] = useState([]); // full data
  // const [filtered, setFiltered] = useState([]); // search result
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const pageSize = 10;

  // const paginatedUsers = filtered.slice(page * pageSize, (page + 1) * pageSize);

  // 🔄 Normal load & refresh — calls getUsers (no search param)
  const fetchAllUsers = async () => {
    try {
      const data = await getUsers(page, 10);
      setUsers(data.response || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error("Failed to fetch users");
      setUsers([]);
    }
  };

  // 🔍 Search — calls searchUsers (only when search is active)
  const fetchSearchResults = async () => {
    try {
      const data = await searchUsers(page, search);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to search users");
      setUsers([]);
    }
  };

  // Branch: use search API only when search is active, otherwise normal fetch
  useEffect(() => {
    if (search.trim().length >= 3) {
      fetchSearchResults(); // 🔍 search API fires
    } else {
      fetchAllUsers();      // 🔄 normal load fires
    }
  }, [page, search]);

  // Reset to page 0 whenever search changes
  useEffect(() => {
    setPage(0);
  }, [search]);

  const handleSearchChange = (value) => {
    setInputValue(value); // always update input

    if (value.length >= 3) {
      setSearch(value); // trigger search
    } else if (value.length === 0) {
      setSearch(""); // reset when cleared
    }
  };
  // const fetchUsers = async () => {
  //   try {
  //     const data = await getUsers(page, 10);

  //     setUsers(data.response);
  //     setFiltered(data.response);
  //     setTotalPages(data.totalPages);
  //   } catch {
  //     toast.error("Failed to fetch users");
  //   }
  // };

  // useEffect(() => {
  //   fetchUsers();
  // }, [page]);

  // useEffect(() => {
  //   const q = search.toLowerCase();

  //   setFiltered(
  //     users.filter(
  //       (u) =>
  //         u.name.toLowerCase().includes(q) ||
  //         u.email.toLowerCase().includes(q) ||
  //         u.username.toLowerCase().includes(q),
  //     ),
  //   );
  // }, [search, users]);

  // const fetchAllUsers = async () => {
  //   try {
  //     const data = await getUsers();
  //     const usersArray = data?.response || [];

  //     setAllUsers(usersArray);
  //     setFiltered(usersArray); // initial view
  //   } catch {
  //     toast.error("Failed to fetch users");
  //     setAllUsers([]);
  //     setFiltered([]);
  //   }
  // };

  // useEffect(() => {
  //   fetchAllUsers();
  // }, []);

  // useEffect(() => {
  //   const q = search.toLowerCase();

  //   // 👉 If less than 3 chars → show all data
  //   if (q.length < 3) {
  //     setFiltered(allUsers);
  //     return;
  //   }

  //   const result = allUsers.filter(
  //     (u) =>
  //       u.name?.toLowerCase().includes(q) ||
  //       u.email?.toLowerCase().includes(q) ||
  //       u.username?.toLowerCase().includes(q),
  //   );

  //   setFiltered(result);
  // }, [search, allUsers]);

  // useEffect(() => {
  //   setPage(0);
  // }, [search]);

  // useEffect(() => {
  //   setTotalPages(Math.ceil(filtered.length / pageSize) || 1);
  // }, [filtered]);

  const handleToggleStatus = async (user) => {
    try {
      await changeUserStatus(user.uuid);

      toast.success(
        user.status === "ACTIVE" ? "User deactivated ✅" : "User activated ✅",
      );

      fetchAllUsers();
    } catch (err) {
      toast.error(err.message || "Failed ❌");
    }
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm mt-6">
      {/* Header */}
      <div className="p-5 flex justify-between items-center border-b">
        <SearchBar value={inputValue} onChange={handleSearchChange} />

        <button
          onClick={() => {
            setMode("create"); // 🔥 switch mode
            setSelectedUser(null); // 🔥 clear old data
            setShowForm(true);
          }}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg"
        >
          New User
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="p-4 text-left">UserID</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Username</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left"></th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.uuid} className="border-t hover:bg-slate-50">
              <td className="p-4 font-medium">{user.userId}</td>
              <td className="p-4 font-medium">{user.name}</td>
              <td className="p-4 font-medium">
                {(user.role || "").replace("ROLE_", "")}
              </td>
              <td className="p-4 font-medium">{user.username}</td>
              <td className="p-4 font-medium">{user.email}</td>
              <td className="p-4 font-medium">{user.phone}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              <td>
                <UserRowActions
                  user={user}
                  onEdit={async (u) => {
                    try {
                      const fullUser = await getUserById(u.uuid);
                      setMode("edit");
                      setSelectedUser(fullUser);
                      setShowForm(true);
                    } catch {
                      toast.error("Failed to load user details ❌");
                    }
                  }}
                  onToggleStatus={handleToggleStatus}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {/* ✅ FIXED: MODAL INSIDE RETURN */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[600px] relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-gray-500"
            >
              ✕
            </button>

            {mode === "edit" ? (
              <EditUserForm
                user={selectedUser}
                onSuccess={() => {
                  setShowForm(false);
                  setSelectedUser(null);
                  fetchAllUsers();
                }}
              />
            ) : (
              <UserForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchAllUsers();
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
//   {
//     showForm && (
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-2xl w-[600px] relative">
//           {/* Close Button */}
//           <button
//             onClick={() => setShowForm(false)}
//             className="absolute top-2 right-3 text-gray-500"
//           >
//             ✕
//           </button>

//           <UserForm
//             onSuccess={() => {
//               setShowForm(false);
//               fetchUsers(); // 🔥 refresh table
//             }}
//           />
//         </div>
//       </div>
//     );
//   }
// }
