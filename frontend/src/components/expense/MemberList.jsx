import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { X } from "lucide-react";

export const MemberList = ({ members, onAddMember, onRemoveMember }) => {
  const [newMemberName, setNewMemberName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const toastRef = useRef(false);

  const showToastOnce = (type, message, id) => {
    if (toastRef.current) return;

    toast[type](
      (t) => (
        <div className="relative pl-6">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toastRef.current = false;
            }}
            className="absolute left-0 top-0 text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
          {message}
        </div>
      ),
      { id }
    );

    toastRef.current = true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMemberName.trim()) {
      showToastOnce("error", "Member name cannot be empty ⚠️", "member-empty");
      return;
    }

    setIsAdding(true);

    try {
      await onAddMember(newMemberName.trim());
      showToastOnce("success", "Member added successfully ✅", "member-added");
      setNewMemberName("");
    } catch {
      showToastOnce("error", "Failed to add member ❌", "member-failed");
    } finally {
      setIsAdding(false);
      toastRef.current = false;
    }
  };

  const handleRemove = (id, name) => {
    if (toastRef.current) return;
    toastRef.current = true;

    toast(
      (t) => (
        <div className="relative space-y-3 pl-6">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toastRef.current = false;
            }}
            className="absolute left-0 top-0 text-gray-500 hover:text-red-500"
          >
            ✕
          </button>

          <p className="font-medium">
            Remove <span className="font-bold">{name}</span> from group?
          </p>

          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => {
                toast.dismiss(t.id);
                toastRef.current = false;
              }}
            >
              Cancel
            </button>

            <button
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              onClick={async () => {
                toast.dismiss(t.id);
                await onRemoveMember(id);

                toast.success(
                  (t2) => (
                    <div className="relative pl-6">
                      <button
                        onClick={() => toast.dismiss(t2.id)}
                        className="absolute left-0 top-0 text-gray-500 hover:text-red-500"
                      >
                        ✕
                      </button>
                      Member removed 🗑️
                    </div>
                  ),
                  { id: "member-removed" }
                );

                toastRef.current = false;
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ),
      { duration: 6000, id: "member-confirm" }
    );
  };

  return (
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-linear-to-br from-white to-indigo-50">

      {/* 🌈 HEADER */}
      <CardHeader className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <CardTitle className="text-xl font-bold tracking-wide">
          👥 Group Members
        </CardTitle>
        <p className="text-sm opacity-90">
          Add or remove people from your group
        </p>
      </CardHeader>

      <CardContent className="p-6">

        {/* ➕ ADD MEMBER */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <Input
            placeholder="New member name (e.g., Jane)"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            className="focus:ring-2 focus:ring-indigo-400"
          />
          <Button
            type="submit"
            disabled={isAdding}
            className="
              bg-linear-to-r from-indigo-500 to-green-500
              hover:from-green-600 hover:to-green-600
              text-white font-semibold
              px-4
              shadow-md hover:shadow-lg
              transition-all
            "
          >
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </form>

        {/* 📋 MEMBER LIST */}
        <div className="space-y-3 border-t pt-4">
          {members.length === 0 ? (
            <p className="text-gray-500 italic text-sm text-center py-6">
              No members yet. Add at least 2 members to start 💡
            </p>
          ) : (
            members.map((member) => (
              <div
                key={member._id}
                className="
                  flex justify-between items-center
                  p-3 rounded-xl
                  bg-white shadow-md
                  hover:shadow-lg transition-all
                  border-l-4 border-indigo-400
                "
              >
                <span className="font-semibold text-gray-800">
                  {member.name}
                </span>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemove(member._id, member.name)}
                  className="
                    text-red-500 hover:text-red-600
                    hover:bg-red-100
                    rounded-full
                  "
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* ⚠️ WARNING */}
        {members.length > 0 && members.length < 2 && (
          <p className="text-sm text-red-500 mt-4 text-center animate-pulse">
            ⚠️ You need at least 2 members to record expenses
          </p>
        )}
      </CardContent>
    </Card>
  );
};
