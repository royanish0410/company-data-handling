"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaBuilding, FaMapMarkerAlt, FaIndustry, FaUsers, FaSearch, FaStar, FaSpinner, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

interface Company {
  _id: string;
  name: string;
  industry: string;
  location: string;
  size?: number;
  foundedYear?: number;
  domain?: string;
  isHiring: boolean;
  rating?: number;
}

function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    industry: "",
    location: "",
    size: "",
    domain: "",
    minRating: "",
    isHiring: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [industries, setIndustries] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);

  const [industrySearch, setIndustrySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [domainSearch, setDomainSearch] = useState("");

  const fetchCompanies = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/companies");
      const data = await res.json();

      if (Array.isArray(data)) {
        setCompanies(data);
        setFilteredCompanies(data);

        setIndustries(Array.from(new Set(data.map(c => c.industry).filter(Boolean))));
        setLocations(Array.from(new Set(data.map(c => c.location).filter(Boolean))));
        setDomains(Array.from(new Set(data.map(c => c.domain).filter(Boolean))));
      } else {
        setCompanies([]);
        setFilteredCompanies([]);
        if (data.error) setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch companies.");
      setCompanies([]);
      setFilteredCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const applyFilters = () => {
    let filtered = [...companies];

    if (filters.name)
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    if (filters.industry) filtered = filtered.filter(c => c.industry === filters.industry);
    if (filters.location) filtered = filtered.filter(c => c.location === filters.location);
    if (filters.domain) filtered = filtered.filter(c => c.domain === filters.domain);
    if (filters.size) filtered = filtered.filter(c => c.size && c.size >= Number(filters.size));
    if (filters.minRating)
      filtered = filtered.filter(c => c.rating !== undefined && c.rating >= Number(filters.minRating));
    if (filters.isHiring)
      filtered = filtered.filter(c => c.isHiring === (filters.isHiring === "true"));

    setFilteredCompanies(filtered);
  };

  const renderSearchableSelect = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    options: string[],
    search: string,
    setSearch: (val: string) => void
  ) => (
    <div className="flex flex-col w-full">
      <label className="mb-1 font-medium text-gray-700">{label}</label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="p-2 space-y-1 w-full">
          <Input
            placeholder={`Search ${label}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 p-2 w-full"
          />
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto w-full">
            {options
              .filter((opt) => opt.toLowerCase().includes(search.toLowerCase()))
              .map((opt) => (
                <SelectItem key={opt} value={opt} className="p-2 w-full">
                  {opt}
                </SelectItem>
              ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="container p-4 md:p-8 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10">
          <div className="w-full text-center md:text-left">
            <h1 className="font-bold text-4xl md:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 text-center">
              Company Finder
            </h1>
          </div>
          <Link href="/addcompany" passHref>
            <Button className="flex items-center gap-2 mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <FaPlus /> Add Company
            </Button>
          </Link>
        </div>

        {/* Global Search */}
        <div className="flex flex-col mb-6 w-full max-w-2xl mx-auto">
          <label className="mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaSearch /> Company Name
          </label>
          <Input
            placeholder="Search by company name..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm mb-8 md:mb-10 border border-gray-100"
        >
          {renderSearchableSelect(
            "Industry",
            filters.industry,
            (val) => setFilters({ ...filters, industry: val }),
            industries,
            industrySearch,
            setIndustrySearch
          )}

          {renderSearchableSelect(
            "Location",
            filters.location,
            (val) => setFilters({ ...filters, location: val }),
            locations,
            locationSearch,
            setLocationSearch
          )}

          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-gray-700 flex items-center gap-2">
              <FaUsers /> Size
            </label>
            <Input
              type="number"
              placeholder="Minimum size..."
              value={filters.size}
              onChange={(e) => setFilters({ ...filters, size: e.target.value })}
              className="w-full"
            />
          </div>

          {renderSearchableSelect(
            "Domain",
            filters.domain,
            (val) => setFilters({ ...filters, domain: val }),
            domains,
            domainSearch,
            setDomainSearch
          )}

          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-gray-700 flex items-center gap-2">
              <FaStar /> Minimum Rating
            </label>
            <Input
              type="number"
              min={0}
              max={5}
              placeholder="0 - 5"
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium text-gray-700">Hiring?</label>
            <Select
              value={filters.isHiring}
              onValueChange={(val) => setFilters({ ...filters, isHiring: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Hiring Status" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="col-span-full mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-600 mb-6"
          >
            {error}
          </motion.p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Card className="shadow-md h-[200px] bg-gray-100 animate-pulse" />
              </motion.div>
            ))
          ) : filteredCompanies.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              No companies found.
            </p>
          ) : (
            filteredCompanies.map((company, i) => (
              <motion.div
                key={company._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card
                  className="shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 hover:border-purple-200 h-full flex flex-col"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FaBuilding className="text-purple-500" /> {company.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-gray-700 flex-grow">
                    <p className="flex items-center gap-2">
                      <FaIndustry className="text-pink-500" /> {company.industry}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-green-500" /> {company.location}
                    </p>
                    {company.size && (
                      <p className="flex items-center gap-2">
                        <FaUsers className="text-purple-500" /> Size: {company.size}
                      </p>
                    )}
                    {company.foundedYear && <p className="text-sm font-semi-bold">Founded: {company.foundedYear}</p>}
                    {company.domain && <p className="text-sm">Domain: {company.domain}</p>}
                    {company.rating !== undefined &&  (
                      <p className="flex items-center gap-1 text-yellow-500">
                        <FaStar /> {company.rating}
                      </p>
                    )}
                    <p className={`text-sm font-medium flex items-center gap-1 ${company.isHiring ? "text-green-600" : "text-red-600"}`}>
                      {company.isHiring ? (
                        <>
                          <FaSpinner className="animate-spin" /> Hiring Now
                        </>
                      ) : (
                        "Not Hiring"
                      )}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Optional: Floating Add Button for Mobile */}
        <Link href="/addcompany" passHref>
          <Button className="fixed bottom-6 right-6 z-50 w-12 h-12 p-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white md:hidden">
            <FaPlus size={20} />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default Home;
