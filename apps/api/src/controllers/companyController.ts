import { Request, Response } from "express";
import Company from "../models/CompanyModel";

// ✅ Create new company
export const createCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = new Company(req.body);
    const saved = await company.save();
    res.status(201).json(saved);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
};

// ✅ Get All Companies + Filters
export const getCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: Record<string, unknown> = {};

    if (req.query.industry) filters.industry = req.query.industry;
    if (req.query.location) filters.location = req.query.location;
    if (req.query.size) filters.size = req.query.size;
    if (req.query.domain) filters.domain = req.query.domain;
    if (req.query.isHiring) filters.isHiring = req.query.isHiring === "true";
    if (req.query.minRating) filters.rating = { $gte: Number(req.query.minRating) };

    const companies = await Company.find(filters);
    res.json(companies);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

// ✅ Get any one company
export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json(company);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

// ✅ Update company details
export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json(updated);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
};

// ✅ Delete a company
export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Company.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json({ message: "Company deleted" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};
