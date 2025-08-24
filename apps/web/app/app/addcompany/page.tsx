"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { FaBuilding, FaIndustry, FaMapMarkerAlt, FaGlobe, FaUsers, FaStar, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

interface CompanyForm {
  name: string;
  industry: string;
  location: string;
  size?: number;
  foundedYear?: number;
  domain?: string;
  isHiring: boolean;
  rating?: number;
}

export default function Page() {
  const [form, setForm] = useState<CompanyForm>({
    name: "",
    industry: "",
    location: "",
    size: undefined,
    foundedYear: undefined,
    domain: "",
    isHiring: false,
    rating: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field: keyof CompanyForm, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { error: res.statusText || "Unknown error" };
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to add company");
      }

      setForm({
        name: "",
        industry: "",
        location: "",
        size: undefined,
        foundedYear: undefined,
        domain: "",
        isHiring: false,
        rating: undefined,
      });

      setSuccess("Company added successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-purple-600 mb-8">
            Add New Company
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <FaBuilding className="text-emerald-500" /> Name
              </label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Company Name"
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <FaIndustry className="text-purple-500" /> Industry
              </label>
              <Input
                value={form.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                placeholder="Industry"
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <FaMapMarkerAlt className="text-teal-500" /> Location
              </label>
              <Input
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Location"
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {/* Size & Founded Year (Side by Side on Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700">
                  <FaUsers className="text-indigo-500" /> Size
                </label>
                <Input
                  type="number"
                  value={form.size ?? ""}
                  onChange={(e) => handleChange("size", Number(e.target.value))}
                  placeholder="Number of employees"
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700">
                  Founded Year
                </label>
                <Input
                  type="number"
                  value={form.foundedYear ?? ""}
                  onChange={(e) => handleChange("foundedYear", Number(e.target.value))}
                  placeholder="Year"
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Domain */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium text-gray-700">
                <FaGlobe className="text-blue-500" /> Domain
              </label>
              <Input
                value={form.domain}
                onChange={(e) => handleChange("domain", e.target.value)}
                placeholder="Domain / website"
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {/* Rating & Hiring (Side by Side on Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700">
                  <FaStar className="text-yellow-500" /> Rating
                </label>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  value={form.rating ?? ""}
                  onChange={(e) => handleChange("rating", Number(e.target.value))}
                  placeholder="0-5"
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700">Hiring?</label>
                <Select
                  value={form.isHiring ? "true" : "false"}
                  onValueChange={(val) => handleChange("isHiring", val === "true")}
                >
                  <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue placeholder="Select Hiring Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error / Success Messages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {error && <p className="text-red-600 text-center">{error}</p>}
              {success && <p className="text-green-600 text-center font-medium">{success}</p>}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="pt-4"
            >
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white py-2 text-lg"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Adding...
                  </>
                ) : (
                  "Add Company"
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
