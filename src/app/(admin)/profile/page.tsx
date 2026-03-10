"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";

export default function ProfilePage() {
  // Sample frontend-only profile state
  const [profile, setProfile] = useState({
    avatar:
      "https://i.pravatar.cc/150?img=12", // placeholder avatar
    name: "John Doe",
    age: 28,
    email: "johndoe@example.com",
    description: "Frontend developer and avid hiker.",
    hobbies: ["Hiking", "Photography", "Gaming"],
  });

  // Editable states for each field
  const [editField, setEditField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState<any>("");

  // Generic save function for each field
  const handleEdit = (field: string) => {
    setEditField(field);
    setFieldValue(profile[field as keyof typeof profile]);
  };

  const handleSave = (field: string) => {
    setProfile((prev) => ({ ...prev, [field]: fieldValue }));
    setEditField(null);
    console.log(`Saved ${field}:`, fieldValue);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>

      <ComponentCard title="Profile Info">
        {/* Profile Picture */}
        <div className="flex items-center gap-6">
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-400">
              Avatar URL
            </label>
            {editField === "avatar" ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
                <button
                  onClick={() => handleSave("avatar")}
                  className="bg-brand-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEdit("avatar")}
                className="mt-1 text-sm text-brand-500 hover:text-brand-600"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Name */}
        <FieldEditor
          label="Name"
          field="name"
          value={profile.name}
          editField={editField}
          fieldValue={fieldValue}
          setFieldValue={setFieldValue}
          handleEdit={handleEdit}
          handleSave={handleSave}
        />

        {/* Age */}
        <FieldEditor
          label="Age"
          field="age"
          value={profile.age}
          editField={editField}
          fieldValue={fieldValue}
          setFieldValue={setFieldValue}
          handleEdit={handleEdit}
          handleSave={handleSave}
        />

        {/* Email */}
        <FieldEditor
          label="Email"
          field="email"
          value={profile.email}
          editField={editField}
          fieldValue={fieldValue}
          setFieldValue={setFieldValue}
          handleEdit={handleEdit}
          handleSave={handleSave}
        />

        {/* Description */}
        <FieldEditor
          label="Description"
          field="description"
          value={profile.description}
          editField={editField}
          fieldValue={fieldValue}
          setFieldValue={setFieldValue}
          handleEdit={handleEdit}
          handleSave={handleSave}
        />

        {/* Hobbies */}
        <div>
          <label className="block mb-1 text-gray-600 dark:text-gray-400">
            Hobbies
          </label>
          <ul className="list-disc ml-5 mb-2">
            {profile.hobbies.map((hobby, i) => (
              <li key={i}>{hobby}</li>
            ))}
          </ul>
          {editField === "hobbies" ? (
  <div className="flex gap-2">
    <input
      type="text"
      value={fieldValue}
      onChange={(e) => setFieldValue(e.target.value)}
      placeholder="Comma-separated hobbies"
      className="border rounded px-2 py-1 w-full"
    />
    <button
      onClick={() => {
        // Save hobbies properly
        setProfile((prev) => ({
          ...prev,
          hobbies: fieldValue.split(",").map((h: string) => h.trim()),
        }));
        setEditField(null);
        console.log("Saved hobbies:", fieldValue.split(",").map((h: string) => h.trim()));
      }}
      className="bg-brand-500 text-white px-3 py-1 rounded"
    >
      Save
    </button>
  </div>
) : (
  <button
    onClick={() => {
      setEditField("hobbies");
      setFieldValue(profile.hobbies.join(", "));
    }}
    className="text-sm text-brand-500 hover:text-brand-600"
  >
    Edit
  </button>
)}
        </div>
      </ComponentCard>
    </div>
  );
}

/** Field editor reusable component */
interface FieldEditorProps {
  label: string;
  field: string;
  value: string | number;
  editField: string | null;
  fieldValue: any;
  setFieldValue: React.Dispatch<React.SetStateAction<any>>;
  handleEdit: (field: string) => void;
  handleSave: (field: string) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  label,
  field,
  value,
  editField,
  fieldValue,
  setFieldValue,
  handleEdit,
  handleSave,
}) => (
  <div>
    <label className="block mb-1 text-gray-600 dark:text-gray-400">{label}</label>
    {editField === field ? (
      <div className="flex gap-2 mb-3">
        <input
          type={typeof value === "number" ? "number" : "text"}
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
        <button
          onClick={() => handleSave(field)}
          className="bg-brand-500 text-white px-3 py-1 rounded"
        >
          Save
        </button>
      </div>
    ) : (
      <div className="flex justify-between items-center mb-3">
        <span>{value}</span>
        <button
          onClick={() => handleEdit(field)}
          className="text-sm text-brand-500 hover:text-brand-600"
        >
          Edit
        </button>
      </div>
    )}
  </div>
);