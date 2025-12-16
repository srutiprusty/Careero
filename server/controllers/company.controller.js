import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
export const registerCompany = async (req, res) => {
  try {
    //  console.log("Register company request:", req.body, "userId:", req.id);
    const { companyName, description, website, location, employeeCount } =
      req.body;
    const file = req.file;
    if (!companyName) {
      //  console.log("Company companyName missing");
      return res.status(400).json({
        message: "CompanyName is required.",
        success: false,
      });
    }
    // Check for duplicate company by companyName (schema field is `companyName`)
    let company = await Company.findOne({ companyName: companyName });
    if (company) {
      //  console.log("Company companyName already exists:", companyName);
      return res.status(400).json({
        message: "you can't register in the same company.",
        success: false,
      });
    }
    // Check if user already has a company
    const existingCompany = await Company.findOne({ userId: req.id });
    if (existingCompany) {
      //  console.log("User already has a company:", existingCompany.companyName);
      return res.status(400).json({
        message: "You can only create one company.",
        success: false,
      });
    }
    // Cloudinary / payload
    const updateData = {
      companyName: companyName,
      description,
      website,
      location,
      employeeCount,
    };
    if (file) {
      try {
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        updateData.logo = cloudResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        // Continue without logo if upload fails
      }
    }
    company = await Company.create({
      ...updateData,
      userId: req.id,
    });
    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    // console.error("registerCompany error:", error);
    return res.status(500).json({
      message: "Server error while registering company",
      success: false,
      error: error.message,
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; //logged in user id
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    //  console.error("getCompany error:", error);
    return res.status(500).json({
      message: "Server error retrieving companies",
      success: false,
      error: error.message,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id; //params used when in server we try /jobs/:id
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.error("getCompanyById error:", error);
    return res.status(500).json({
      message: "Server error retrieving company",
      success: false,
      error: error.message,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    // keep API using `companyName` to match schema
    const { companyName, description, website, location, employeeCount } =
      req.body;
    const file = req.file;
    //cloudinary
    const updateData = {
      companyName,
      description,
      website,
      location,
      employeeCount,
    };
    if (file) {
      try {
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        updateData.logo = cloudResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        // Continue without logo if upload fails
      }
    }
    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Company Details updated.",
      company,
      success: true,
    });
  } catch (error) {
    console.error("updateCompany error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};
