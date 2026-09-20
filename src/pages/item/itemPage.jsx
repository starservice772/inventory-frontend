import { useEffect, useRef, useState } from "react";
import { getItems, createItem, updateItem, getItemById, deleteItem, searchItems } from "../../api/itemApi";
import toast from "react-hot-toast";
import AddItemModal from "../../components/items/AddItemModal";
import EditItemModal from "../../components/items/EditItemModal";
import DescriptionTooltip from "../../components/items/DescriptionToolTip";

import ActionMenu from "../../components/items/ItemAction";

export default function ItemPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // add modal state
  const [showModal, setShowModal] = useState(false);

  // edit modal state
  const [showEditModal, setShowEditModal] = useState(false);

  // search state
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    itemCode: "",
    itemDescription: "",
    hsnCode: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD ITEM MODAL OPEN FUNCTION
  const handleOpenCreateModal = () => {
    setForm({
      itemCode: "",
      itemDescription: "",
      hsnCode: ""
    });

    setShowModal(true);
  };

  // ADD ITEM SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createItem(form);

      toast.success("Item created successfully ✅");

      setShowModal(false);

      // Reset form
      setForm({
        itemCode: "",
        itemDescription: "",
        hsnCode: ""
      });

      // Reload first page so new item appears
      await loadItems(0);
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to create item ❌");
    }
  };

  const handleEdit = async (item) => {
    try {
      // Call GET BY ID API using selected item id
      const itemDetails = await getItemById(item.id);

      // Populate form with latest backend data
      setForm({
        id: itemDetails.id,
        itemCode: itemDetails.itemCode || "",
        itemDescription: itemDetails.itemDescription || "",
        hsnCode: itemDetails.hsnCode || "",
        createdDate: itemDetails.createdDate || "",
        updatedDate: itemDetails.updatedDate || "",
      });

      // Open edit modal
      setShowEditModal(true);
    }
    catch (error) {
      console.error(error.message);
      toast.error("Failed to load item details ❌");
    }
  };

  // UPDATE ITEM FUNCTION
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateItem({
        id: form.id,
        itemCode: form.itemCode,
        itemDescription: form.itemDescription,
        hsnCode: form.hsnCode
      });

      toast.success("Item updated successfully ✅");

      setShowEditModal(false);

      // Reload first page
      await loadItems(0);
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to update item ❌");
    }
  };

  // FUNCTION FOR DELETE ANY ITEM
  const handleDelete = (item) => {
    toast((t) => (
      // delete alert pop up modal
      <div>
        <p className="font-medium">
          Are you sure you want to delete <b>{item.itemCode}</b>?
        </p>

        <div className="flex gap-2 mt-3">
          {/* YES */}
          <button
            onClick={async () => {
              try {
                await deleteItem(item.id);

                // Remove deleted item from UI immediately
                setItems((prev) =>
                  prev.filter((i) => i.id !== item.id)
                );

                // Update total records/pages if needed
                // Reload first page so data stays consistent
                setPage(0);
                await loadItems(0);

                toast.dismiss(t.id);
                toast.success("Item deleted successfully 🗑️");
              } catch (err) {
                toast.error("Delete failed ❌");
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Yes
          </button>

          {/* NO */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  const observerRef = useRef(null);

  // Load items
  const loadItems = async (pageNumber, searchText = search) => {
    if (loading) return;
    if (totalPages !== 0 && pageNumber >= totalPages) return;

    try {
      setLoading(true);
      let res;
      // If user typed 3 or more characters, use search API
      if (searchText.trim().length >= 3) {
        res = await searchItems(pageNumber, searchText.trim());
      } else {
        // Otherwise load normal getAll API
        res = await getItems(pageNumber, 30);
      }

      // First page replaces data; next pages append data
      if (pageNumber === 0) {
        setItems(res.items);
      } else {
        setItems((prev) => {
          const combined = [...prev, ...res.items];

          // Remove duplicates based on id
          const uniqueItems = combined.filter(
            (item, index, self) =>
              index === self.findIndex((i) => i.id === item.id)
          );

          return uniqueItems;
        });
      }

      setTotalPages(res.totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error loading items:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // SEARCH HANDLER
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearch(value);

    // Reset pagination
    setPage(0);
    setTotalPages(0);

    // Case 1: Search cleared → load all items
    if (value.trim() === "") {
      await loadItems(0, "");
      return;
    }

    // Case 2: Start searching only when length >= 3
    if (value.trim().length >= 3) {
      await loadItems(0, value);
    }
  };

  const hasLoaded = useRef(false);
  // Initial load
  useEffect(() => {
    if (hasLoaded.current) return; // Prevent second call in StrictMode
    hasLoaded.current = true;

    loadItems(0);
  }, []);

  // Infinite scroll using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (
          first.isIntersecting &&
          !loading &&
          page + 1 < totalPages
        ) {
          loadItems(page + 1);
        }
      },
      {
        threshold: 1.0,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [page, totalPages, loading, search]);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-300">

      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b">

        {/* Search */}
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />

        {/* New User Button */}
        <button
          onClick={handleOpenCreateModal}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600">
          Add Item
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="p-4 text-left">Item Code</th>
            <th className="p-4 text-left">Item Description</th>
            <th className="p-4 text-left">HSN Code</th>
            <th className="p-4 text-left">Created Date</th>
            <th className="p-4 text-left">Updated Date</th>
            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr
              key={`${item.id}-${index}`}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-3">{item.itemCode}</td>
              <td className="p-3 max-w-md">
                <DescriptionTooltip
                  text={item.itemDescription}
                  maxLength={30}
                />
              </td>
              <td className="p-3">{item.hsnCode}</td>
              <td className="p-3">{item.createdDate}</td>
              <td className="p-3">{item.updatedDate}</td>
              <td>
                <ActionMenu
                  item={item}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD ITEM MODAL */}
      <AddItemModal
        showModal={showModal}
        setShowModal={setShowModal}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      {/* EDIT ITEM MODAL */}
      <EditItemModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        form={form}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
      />


      {/* Loader Trigger */}
      <div
        ref={observerRef}
        className="py-6 text-center"
      >
        {loading && (
          <div className="flex justify-center items-center gap-2 text-gray-500">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Loading more items...
          </div>
        )}

        {!loading &&
          totalPages > 0 &&
          page + 1 >= totalPages && (
            <p className="text-gray-400 text-sm">
              All items loaded
            </p>
          )}
      </div>
    </div>
  );
}