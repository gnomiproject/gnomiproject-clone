
// Create default average data for reports
export const createDefaultAverageData = () => ({
  archetype_id: 'All_Average',
  archetype_name: 'Population Average',
  "Demo_Average Age": 40,
  "Demo_Average Family Size": 3.0,
  "Risk_Average Risk Score": 1.0,
  "Cost_Medical & RX Paid Amount PMPY": 5000
});

// Process report data into correct format
export const processReportData = (data: any) => {
  if (!data) return null;

  return {
    reportData: data,
    averageData: createDefaultAverageData()
  };
};

