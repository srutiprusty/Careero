import React, { useEffect, useState, useMemo, useRef } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const FilterCard = () => {
  const { allJobs = [] } = useSelector((store) => store.job);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [openAccordions, setOpenAccordions] = useState({});
  const [activeFilterType, setActiveFilterType] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});
  const dropdownRef = useRef(null);
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
    setOpenAccordions((prev) => {
      // If clicking on an already open accordion, close it
      if (prev[filterType]) {
        return {
          ...prev,
          [filterType]: false,
        };
      }
      // Otherwise, close all and open only the clicked one
      return {
        [filterType]: true,
      };
    });
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

  const clearFilters = () => {
    setSelectedFilters({});
    setOpenAccordions({});
    setActiveFilterType(null);
  };

  const toggleMobileFilter = (filterType, event) => {
    if (activeFilterType === filterType) {
      setActiveFilterType(null);
    } else {
      const button = buttonRefs.current[filterType];
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 5,
          left: rect.left + window.scrollX,
        });
      }
      setActiveFilterType(filterType);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !Object.values(buttonRefs.current).some((ref) =>
          ref?.contains(event.target)
        )
      ) {
        setActiveFilterType(null);
      }
    };

    if (activeFilterType) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeFilterType]);

  useEffect(() => {
    dispatch(setSearchedQuery(selectedFilters));
  }, [selectedFilters, dispatch]);

  // Desktop version - vertical accordion
  const DesktopFilters = () => (
    <div className="w-full bg-white p-3 rounded-md sticky top-5">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-lg">Filter Jobs</h1>
        {Object.keys(selectedFilters).length > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            Clear All
          </button>
        )}
      </div>
      <hr className="mb-3" />
      <div className="space-y-2">
        {filterData.map((data, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion(data.filterType)}
              className="w-full text-left py-2 px-1 font-medium text-gray-700 hover:bg-gray-50 flex justify-between items-center"
            >
              {data.filterType}
              <div className="flex items-center">
                {selectedFilters[data.filterType]?.length > 0 && (
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full mr-2">
                    {selectedFilters[data.filterType].length}
                  </span>
                )}
                <span className="text-sm border rounded-full w-5 h-5 flex justify-center items-center bg-gray-200">
                  {openAccordions[data.filterType] ? "−" : "+"}
                </span>
              </div>
            </button>
            {openAccordions[data.filterType] && (
              <div className="pb-2 px-1 max-h-48 overflow-y-auto">
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
                      <Label
                        htmlFor={itemId}
                        className="text-sm cursor-pointer"
                      >
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

  // Mobile version - horizontal scrollable chips with dropdown
  const MobileFilters = () => (
    <div className="w-full bg-white rounded-md relative">
      {/* Horizontal scrollable filter type buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 px-3 pt-3 scrollbar-hide">
        {filterData.map((data, index) => {
          const isActive = activeFilterType === data.filterType;
          const selectedCount = selectedFilters[data.filterType]?.length || 0;
          return (
            <button
              key={index}
              ref={(el) => (buttonRefs.current[data.filterType] = el)}
              onClick={(e) => toggleMobileFilter(data.filterType, e)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                isActive
                  ? "bg-purple-600 text-white"
                  : selectedCount > 0
                  ? "bg-purple-100 text-purple-600 border-2 border-purple-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {data.filterType}
              {selectedCount > 0 && (
                <span className="text-xs">({selectedCount})</span>
              )}
              <svg
                className={`w-3 h-3 transition-transform ${
                  isActive ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          );
        })}
        {Object.keys(selectedFilters).length > 0 && (
          <button
            onClick={clearFilters}
            className="flex-shrink-0 px-3 py-1.5 bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Dropdown menu for selected filter type */}
      {activeFilterType && (
        <div
          ref={dropdownRef}
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-h-64 overflow-y-auto z-50"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            minWidth: "200px",
            maxWidth: "90vw",
          }}
        >
          <div className="space-y-2">
            {filterData
              .find((data) => data.filterType === activeFilterType)
              ?.array.map((item, idx) => {
                const isSelected =
                  selectedFilters[activeFilterType]?.includes(item) || false;
                const itemId = `mobile-${activeFilterType}-${idx}`;
                return (
                  <div
                    key={itemId}
                    className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                    onClick={() =>
                      handleCheckboxChange(activeFilterType, item, !isSelected)
                    }
                  >
                    <Checkbox
                      id={itemId}
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(activeFilterType, item, checked)
                      }
                    />
                    <Label
                      htmlFor={itemId}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {item}
                    </Label>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop - hidden on mobile */}
      <div className="hidden lg:block">
        <DesktopFilters />
      </div>

      {/* Mobile - hidden on desktop */}
      <div className="block lg:hidden">
        <MobileFilters />
      </div>
    </>
  );
};

export default FilterCard;

/* Add this to your global CSS file to hide scrollbar while keeping scroll functionality */
/* 
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/
