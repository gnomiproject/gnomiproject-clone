
import React from 'react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/shared/Section';
import SectionTitle from '@/components/shared/SectionTitle';

interface DeepDiveReportContentProps {
  archetype: any; // We'll define a more specific type later
  userData?: any;
  averageData?: any;
}

const DeepDiveReportContent: React.FC<DeepDiveReportContentProps> = ({ 
  archetype, 
  userData, 
  averageData 
}) => {
  // Debug logs
  console.log('DeepDiveReportContent: Data received:', { archetype, userData, averageData });

  // Safely extract name
  const name = archetype?.name || archetype?.archetype_name || 'Untitled Archetype';
  
  return (
    <div className="max-w-7xl mx-auto py-8 space-y-12">
      {/* 1. Introduction */}
      <Section id="introduction">
        <SectionTitle 
          title={`${name} Deep Dive Report`}
          subtitle="Comprehensive analysis and detailed insights"
        />
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
          <p className="text-gray-700">{archetype?.executive_summary || 'No executive summary available'}</p>
          
          {userData && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Report Information</h3>
              <p className="text-sm text-gray-500">
                Prepared for: {userData?.name || 'Anonymous'} {userData?.organization ? `(${userData.organization})` : ''}
                <br />
                Generated on: {new Date().toLocaleDateString()}
              </p>
            </div>
          )}
        </Card>
      </Section>

      {/* 2. Archetype Profile */}
      <Section id="archetype-profile">
        <SectionTitle 
          title="Archetype Profile" 
          subtitle="Key characteristics and overview"
        />
        <Card className="p-6">
          <p className="text-gray-700">{archetype?.short_description || 'No profile information available'}</p>
          
          {archetype?.key_characteristics && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Key Characteristics</h3>
              {Array.isArray(archetype.key_characteristics) ? (
                <ul className="list-disc pl-5 space-y-1">
                  {archetype.key_characteristics.map((item: string, index: number) => (
                    <li key={`char-${index}`} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">{archetype.key_characteristics}</p>
              )}
            </div>
          )}
        </Card>
      </Section>

      {/* 3. Demographics */}
      <Section id="demographics">
        <SectionTitle 
          title="Demographics" 
          subtitle="Population demographic analysis"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Age distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Age</h3>
            <p className="text-3xl font-bold">{archetype?.["Demo_Average Age"] || 'N/A'}</p>
            <p className="text-sm text-gray-500 mt-1">Average Age</p>
            
            {averageData && (
              <div className="mt-2 text-xs">
                <p className="text-gray-500">
                  Population average: {averageData["Demo_Average Age"] || 'N/A'}
                </p>
              </div>
            )}
          </Card>
          
          {/* Gender distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Gender</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span>Female</span>
                <span className="font-semibold">{archetype?.["Demo_Female %"] || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Male</span>
                <span className="font-semibold">{archetype?.["Demo_Male %"] || 'N/A'}</span>
              </div>
            </div>
          </Card>
          
          {/* Family size */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Family Size</h3>
            <p className="text-3xl font-bold">{archetype?.["Demo_Average Family Size"] || 'N/A'}</p>
            <p className="text-sm text-gray-500 mt-1">Average Family Size</p>
          </Card>
        </div>
      </Section>

      {/* 4. Cost Analysis */}
      <Section id="cost-analysis">
        <SectionTitle 
          title="Cost Analysis" 
          subtitle="Healthcare spending patterns and analysis"
        />
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Total Cost</h3>
                <p className="text-3xl font-bold">
                  ${archetype?.["Cost_Medical & RX Paid Amount PMPY"] || 'N/A'}
                </p>
                <p className="text-sm text-gray-500 mt-1">Per Member Per Year</p>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Cost Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Medical</span>
                    <span className="font-medium">
                      ${archetype?.["Cost_Medical Paid Amount PMPY"] || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pharmacy</span>
                    <span className="font-medium">
                      ${archetype?.["Cost_RX Paid Amount PMPY"] || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* 5. Utilization Patterns */}
      <Section id="utilization-patterns">
        <SectionTitle 
          title="Utilization Patterns" 
          subtitle="Healthcare service usage patterns"
        />
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Inpatient Services</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Admissions per 1,000</span>
                  <span className="font-medium">{archetype?.["Util_IP Admits per 1000"] || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Length of Stay</span>
                  <span className="font-medium">{archetype?.["Util_IP Average LOS"] || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Outpatient Services</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>ER Visits per 1,000</span>
                  <span className="font-medium">{archetype?.["Util_ER Visits per 1000"] || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Office Visits per 1,000</span>
                  <span className="font-medium">{archetype?.["Util_Office Visits per 1000"] || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* 6. Disease Prevalence */}
      <Section id="disease-prevalence">
        <SectionTitle 
          title="Disease Prevalence" 
          subtitle="Common health conditions in this population"
        />
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Top Conditions</h3>
            {archetype?.disease_prevalence ? (
              <p className="text-gray-700">{archetype.disease_prevalence}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-700">Common conditions in this population include:</p>
                <ul className="list-disc pl-5">
                  <li>Hypertension</li>
                  <li>Hyperlipidemia</li>
                  <li>Type 2 Diabetes</li>
                  <li>Depression</li>
                  <li>Anxiety</li>
                </ul>
                <p className="text-gray-500 italic">Note: This is placeholder data</p>
              </div>
            )}
          </div>
        </Card>
      </Section>

      {/* 7. Care Gaps */}
      <Section id="care-gaps">
        <SectionTitle 
          title="Care Gaps" 
          subtitle="Identified gaps in care and prevention"
        />
        <Card className="p-6">
          {archetype?.care_gaps ? (
            <div>
              <p className="text-gray-700">{archetype.care_gaps}</p>
              {Array.isArray(archetype.care_gap_metrics) && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {archetype.care_gap_metrics.map((gap: any, index: number) => (
                    <div key={`gap-${index}`} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{gap.name}</p>
                      <p className="text-sm text-gray-600">{gap.description}</p>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${gap.completion_rate || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-right mt-1">{gap.completion_rate || 0}% completion</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">No care gap data available</p>
          )}
        </Card>
      </Section>

      {/* 8. Risk Factors */}
      <Section id="risk-factors">
        <SectionTitle 
          title="Risk Factors" 
          subtitle="Key risk indicators and analysis"
        />
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3">Risk Score</h3>
              <p className="text-3xl font-bold">{archetype?.["Risk_Average Risk Score"] || 'N/A'}</p>
              <p className="text-sm text-gray-500 mt-1">Average Risk Score</p>
              
              {averageData && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {(archetype?.["Risk_Average Risk Score"] || 0) > (averageData["Risk_Average Risk Score"] || 0) 
                      ? 'Higher than average risk'
                      : 'Lower than average risk'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3">Risk Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>High Risk</span>
                  <span className="font-medium">{archetype?.["Risk_High Risk %"] || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Risk</span>
                  <span className="font-medium">{archetype?.["Risk_Medium Risk %"] || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Low Risk</span>
                  <span className="font-medium">{archetype?.["Risk_Low Risk %"] || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* 9. Strategic Recommendations */}
      <Section id="recommendations">
        <SectionTitle 
          title="Strategic Recommendations" 
          subtitle="Data-driven recommendations for population health management"
        />
        <div className="space-y-4">
          {archetype?.strategic_recommendations && Array.isArray(archetype.strategic_recommendations) && 
           archetype.strategic_recommendations.length > 0 ? (
            archetype.strategic_recommendations.map((rec: any, index: number) => (
              <Card key={`rec-${index}`} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 text-blue-800 font-bold h-8 w-8 flex items-center justify-center flex-shrink-0">
                    {rec.recommendation_number || index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{rec.title || `Recommendation ${index + 1}`}</h3>
                    <p className="text-gray-700">{rec.description || "No description available"}</p>
                    
                    {rec.action_items && Array.isArray(rec.action_items) && (
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-700 mb-1">Action Items:</h4>
                        <ul className="list-disc pl-5">
                          {rec.action_items.map((item: string, i: number) => (
                            <li key={`action-${index}-${i}`} className="text-gray-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500 italic">No strategic recommendations available</p>
            </Card>
          )}
        </div>
      </Section>

      {/* 10. Methodologies */}
      <Section id="methodologies">
        <SectionTitle 
          title="Methodologies" 
          subtitle="Analysis approaches and data sources"
        />
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Data Sources</h3>
          <p className="text-gray-700">
            {archetype?.methodologies?.data_sources || 
              "This report utilizes claims data, electronic health records, and population health datasets to generate insights."}
          </p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Analysis Methods</h3>
          <p className="text-gray-700">
            {archetype?.methodologies?.analysis_methods || 
              "Our analysis combines statistical modeling, machine learning algorithms, and expert clinical review to identify patterns and opportunities."}
          </p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Limitations</h3>
          <p className="text-gray-700">
            {archetype?.methodologies?.limitations || 
              "Findings are based on available data and may not represent all population characteristics. Recommendations should be evaluated in the context of specific organizational capabilities and resources."}
          </p>
        </Card>
      </Section>
    </div>
  );
};

export default DeepDiveReportContent;
