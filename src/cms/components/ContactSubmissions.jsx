import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineX,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineRefresh,
} from "react-icons/hi";
import { contactAPI } from "../../services/apiService";

const ContactSubmissions = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  useEffect(() => {
    fetchContacts();
  }, [pagination.page]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getContacts(pagination.page, pagination.limit);
      setContacts(response.data.contacts || []);
      setPagination((prev) => ({ ...prev, total: response.data.total }));
    //   toast.success(`Loaded ${response.data.contacts.length} contacts`);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await contactAPI.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success("Contact deleted");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="flex flex-col gap-6 font-manrope">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-cyan-400 uppercase tracking-wider">
            Contact Submissions
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {pagination.total} total submissions
          </p>
        </div>
        <button
          onClick={fetchContacts}
          disabled={loading}
          className="flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 px-6 py-2 rounded-lg hover:bg-cyan-500/30 transition disabled:opacity-50 font-semibold"
        >
          <HiOutlineRefresh /> Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && !selectedContact ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4 mx-auto" />
            <p className="text-gray-400">Loading contacts...</p>
          </div>
        </div>
      ) : selectedContact ? (
        /* Detail View */
        <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-8">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-cyan-400">Contact Details</h3>
            <button
              onClick={() => setSelectedContact(null)}
              className="text-gray-400 hover:text-white transition"
            >
              <HiOutlineX size={28} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <div>
                <label className="text-gray-500 text-sm font-semibold">Name</label>
                <p className="text-white text-lg">{selectedContact.firstName}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm font-semibold">Email</label>
                <p className="text-cyan-400 text-lg">{selectedContact.contactEmail}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm font-semibold">Contact Number</label>
                <p className="text-white text-lg">{selectedContact.contactNumber}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm font-semibold">Attorney Name</label>
                <p className="text-white text-lg">{selectedContact.attorneyName || "N/A"}</p>
              </div>
            </div>

            {/* Deposition Info */}
            <div className="space-y-4">
              <div>
                <label className="text-gray-500 text-sm font-semibold">Preferred Date</label>
                <p className="text-white text-lg">{selectedContact.preferredDate || "N/A"}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm font-semibold">Preferred Time</label>
                <p className="text-white text-lg">{selectedContact.preferredTime || "N/A"}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm font-semibold">Location</label>
                <p className="text-white text-lg">
                  {selectedContact.city}, {selectedContact.state}
                </p>
              </div>
              <div>
                <label className="text-gray-500 text-sm font-semibold">Submitted</label>
                <p className="text-gray-400 text-sm">{formatDate(selectedContact.createdAt)}</p>
              </div>
            </div>

            {/* Services */}
            {selectedContact.servicesNeeded && selectedContact.servicesNeeded.length > 0 && (
              <div className="md:col-span-2">
                <label className="text-gray-500 text-sm font-semibold block mb-3">
                  Services Needed
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedContact.servicesNeeded.map((service, idx) => (
                    <span
                      key={idx}
                      className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg text-sm font-semibold border border-cyan-500/40"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedContact.notes && (
              <div className="md:col-span-2">
                <label className="text-gray-500 text-sm font-semibold block mb-2">Notes</label>
                <p className="text-gray-300 bg-black/60 p-4 rounded-lg">{selectedContact.notes}</p>
              </div>
            )}

            {/* File */}
            {selectedContact.file && (
              <div className="md:col-span-2">
                <label className="text-gray-500 text-sm font-semibold block mb-2">Attachment</label>
                <a
                  href={selectedContact.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition underline"
                >
                  {selectedContact.file.originalName}
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setSelectedContact(null)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleDeleteContact(selectedContact._id);
                setSelectedContact(null);
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <HiOutlineTrash /> Delete
            </button>
          </div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-xl">No contact submissions yet</p>
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700 bg-black/40">
                <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm uppercase">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm uppercase">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact._id}
                  className="border-b border-gray-800 hover:bg-black/60 transition"
                >
                  <td className="px-6 py-4 text-white font-semibold">
                    {contact.firstName}
                  </td>
                  <td className="px-6 py-4 text-cyan-400 text-sm">
                    {contact.contactEmail}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {contact.contactNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="bg-cyan-500/20 text-cyan-400 p-2 rounded-lg hover:bg-cyan-500/30 transition"
                      title="View"
                    >
                      <HiOutlineEye size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact._id)}
                      className="bg-red-600/20 text-red-400 p-2 rounded-lg hover:bg-red-600/30 transition"
                      title="Delete"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!selectedContact && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 border-t border-gray-800 pt-6">
          <span className="text-gray-400 text-sm">
            Page {pagination.page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page === 1}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(totalPages, prev.page + 1),
                }))
              }
              disabled={pagination.page === totalPages}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;
