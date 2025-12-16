import React, { useEffect, useState, useMemo } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const FilterCard = () => {
  const { allJobs = [] } = useSelector((store) => store.job);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [openAccordions, setOpenAccordions] = useState({});
  const dispatch = useDispatch();

  const filterData = useMemo(() => {
    if (!allJobs.length) return [];

    const uniqueJobTypes = [
      ...new Set(allJobs.map((job) => job.jobType).filter(Boolean)),
    ];
    const uniqueLocations = [
      ...new Set(allJobs.map((job) => job.location).filter(Boolean)),
    ];
    const uniqueTitles = [
      ...new Set(allJobs.map((job) => job.title).filter(Boolean)),
    ];
    const uniqueWorkModes = [
      ...new Set(allJobs.map((job) => job.workMode).filter(Boolean)),
    ];
    const uniqueJobLevels = [
      ...new Set(allJobs.map((job) => job.jobLevel).filter(Boolean)),
    ];
    const uniqueDurations = [
      ...new Set(allJobs.map((job) => job.duration).filter(Boolean)),
    ];

    // Salary ranges based on salaryMin and salaryMax
    const salaryMins = allJobs.map((job) => job.salaryMin).filter(Boolean);
    const salaryMaxs = allJobs.map((job) => job.salaryMax).filter(Boolean);
    const salaryRanges = [];
    if (salaryMins.length && salaryMaxs.length) {
      const overallMin = Math.min(...salaryMins);
      const overallMax = Math.max(...salaryMaxs);
      if (overallMax <= 40000) {
        salaryRanges.push("0-40k");
      } else if (overallMin < 40000 && overallMax <= 100000) {
        salaryRanges.push("0-40k", "40k-1lakh");
      } else if (overallMin < 100000 && overallMax <= 500000) {
        salaryRanges.push("0-40k", "40k-1lakh", "1lakh-5lakh");
      } else {
        salaryRanges.push(
          "0-40k",
          "40k-1lakh",
          "1-10lakh",
          "10-20lakh",
          "20-30lakh",
          "30-40lakh",
          "40-50lakh",
          "50lakh+"
        );
      }
    }

    // Experience level ranges (experienceLevel is a string, so use unique values)
    const uniqueExperienceLevels = [
      ...new Set(allJobs.map((job) => job.experienceLevel).filter(Boolean)),
    ];

    return [
      {
        filterType: "Job Type",
        array: uniqueJobTypes,
      },
      {
        filterType: "Location",
        array: uniqueLocations,
      },
      {
        filterType: "Title",
        array: uniqueTitles.slice(0, 10), // Limit to 10 for UI
      },
      {
        filterType: "Work Mode",
        array: uniqueWorkModes,
      },
      {
        filterType: "Job Level",
        array: uniqueJobLevels,
      },
      {
        filterType: "Duration",
        array: uniqueDurations,
      },
      {
        filterType: "Salary",
        array: salaryRanges,
      },
      {
        filterType: "Experience Level",
        array: uniqueExperienceLevels,
      },
    ].filter((item) => item.array.length > 0);
  }, [allJobs]);

  const toggleAccordion = (filterType) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  const handleCheckboxChange = (filterType, value, checked) => {
    setSelectedFilters((prev) => {
      const current = prev[filterType] || [];
      if (checked) {
        return {
          ...prev,
          [filterType]: [...current, value],
        };
      } else {
        return {
          ...prev,
          [filterType]: current.filter((item) => item !== value),
        };
      }
    });
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedFilters));
  }, [selectedFilters, dispatch]);

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
      <div className="space-y-2">
        {filterData.map((data, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion(data.filterType)}
              className="w-full text-left py-2 px-1 font-medium text-gray-700 hover:bg-gray-50 flex justify-between items-center"
            >
              {data.filterType}
              <span className="text-sm">
                {openAccordions[data.filterType] ? "−" : "+"}
              </span>
            </button>
            {openAccordions[data.filterType] && (
              <div className="pb-2 px-1">
                {data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`;
                  return (
                    <div
                      className="flex items-center space-x-2 my-1"
                      key={itemId}
                    >
                      <Checkbox
                        id={itemId}
                        checked={
                          selectedFilters[data.filterType]?.includes(item) ||
                          false
                        }
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(data.filterType, item, checked)
                        }
                      />
                      <Label htmlFor={itemId} className="text-sm">
                        {item}
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
