import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Users } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export const MemberList = ({ members, onAddMember, onRemoveMember }) => {
  const [newMemberName, setNewMemberName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const toastRef = useRef(false);

  const showToastOnce = (type, message, id) => {
    if (toastRef.current) return;
    toast[type](message, { id });
    toastRef.current = true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMemberName.trim()) {
      showToastOnce("error", "Member name cannot be empty", "member-empty");
      return;
    }

    setIsAdding(true);

    try {
      await onAddMember(newMemberName.trim());
      showToastOnce("success", "Member added", "member-added");
      setNewMemberName("");
    } catch {
      showToastOnce("error", "Failed to add member", "member-failed");
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
        <div className="space-y-3">
          <p className="font-semibold text-slate-900">
            Remove <span>{name}</span> from this trip?
          </p>

          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              onClick={() => {
                toast.dismiss(t.id);
                toastRef.current = false;
              }}
            >
              Cancel
            </button>

            <button
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
              onClick={async () => {
                toast.dismiss(t.id);
                await onRemoveMember(id);
                toast.success("Member removed", { id: "member-removed" });
                toastRef.current = false;
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ),
      { duration: 6000, id: "member-confirm" },
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Group Members</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Add the people sharing this trip.
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Users className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Input
            placeholder="Member name"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
          />
          <Button
            type="submit"
            disabled={isAdding}
            className="bg-slate-950 text-white hover:bg-slate-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </form>

        <div className="mt-5 space-y-2">
          {members.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No members yet. Add at least 2 members to record expenses.
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
              >
                <span className="min-w-0 truncate font-semibold text-slate-800">
                  {member.name}
                </span>

                <Button
                  type="button"
                  onClick={() => handleRemove(member._id, member.name)}
                  className="h-12 min-h-12 w-12 shrink-0 bg-red-50 p-0 text-red-600 hover:bg-red-100"
                  aria-label={`Remove ${member.name}`}
                >
                  <Trash2 className="h-6 w-6" />
                </Button>
              </div>
            ))
          )}
        </div>

        {members.length > 0 && members.length < 2 && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-center text-sm font-medium text-amber-700">
            Add one more member to start recording expenses.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
