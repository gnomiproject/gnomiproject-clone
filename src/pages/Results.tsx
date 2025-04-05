
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import SectionTitle from '@/components/shared/SectionTitle';
import { RefreshCw, Check, ChevronDown } from 'lucide-react';

const Results = () => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border-t-4 border-blue-500">
          <div className="p-8">
            <SectionTitle 
              title="Assessment Results"
              subtitle="The best match for your organization is:"
              center
            />

            <div className="text-center mb-6">
              <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-4 py-1 text-sm font-medium">
                Family a: Strategists
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Savvy Healthcare Navigators <span className="inline-block bg-orange-50 text-orange-600 border border-orange-300 rounded-full px-3 py-1 text-sm font-medium align-middle ml-2">a1</span>
            </h2>

            <p className="text-gray-700 text-lg text-center mb-8">
              Effective at directing care appropriately, these are organizations that reduce emergency visits and hospital admissions by connecting members with timely specialist care, demonstrating sophisticated system knowledge despite relatively higher overall costs.
            </p>

            <div className="flex justify-center mb-8">
              <Button
                onClick={() => {}}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Retake Assessment
              </Button>
            </div>

            <div className="text-center mb-8">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-center mx-auto text-gray-600 hover:text-gray-800"
              >
                Explore the detailed sections below to see KPIs, strategic priorities, risk profiles, and cost-saving opportunities
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="border-t">
              <div className="bg-white px-8 py-6">
                <h3 className="text-2xl font-bold mb-6">Detailed Analysis</h3>
                
                <div className="border-b flex overflow-x-auto">
                  <button className="px-6 py-3 font-medium text-blue-600 border-b-2 border-blue-500">Overview</button>
                  <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-800">KPIs & Risk</button>
                  <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-800">Strategic Priorities</button>
                  <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-800">SWOT Analysis</button>
                  <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-800">Cost Savings</button>
                </div>

                <div className="py-8">
                  <div className="flex">
                    <div className="w-1/3 border-r pr-8">
                      <div className="flex flex-col h-full">
                        <div className="bg-orange-50 rounded-full h-24 w-24 flex items-center justify-center mb-6">
                          <span className="text-3xl font-bold text-orange-600">a1</span>
                        </div>
                        <h4 className="text-2xl font-bold mb-4">Savvy Healthcare Navigators</h4>
                        <h5 className="text-xl font-bold mb-4">What Makes Savvy Healthcare Navigators Unique</h5>
                        <p className="text-gray-600 mb-6">
                          Organizations in the Savvy Healthcare Navigators archetype have a distinctive approach to healthcare benefits and management strategies. Here's what sets them apart:
                        </p>
                      </div>
                    </div>
                    <div className="w-2/3 pl-8">
                      <h4 className="text-2xl font-bold mb-6">Recommended Strategies</h4>
                      <p className="mb-6 text-gray-700">
                        Based on extensive analysis of similar organizations, these are the most effective healthcare strategies for the Savvy Healthcare Navigators archetype:
                      </p>

                      <div className="space-y-6">
                        <div className="bg-white rounded-lg border p-6">
                          <div className="flex items-start gap-4">
                            <div className="bg-orange-50 rounded-full p-3">
                              <span className="text-orange-500">🧠</span>
                            </div>
                            <div>
                              <h5 className="font-bold mb-2">Specialized Mental Health Access</h5>
                              <p className="text-gray-600">
                                Implement targeted solutions for high-stress environments with executive coaching and specialized mental health platforms.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border p-6">
                          <div className="flex items-start gap-4">
                            <div className="bg-orange-50 rounded-full p-3">
                              <span className="text-orange-500">💎</span>
                            </div>
                            <div>
                              <h5 className="font-bold mb-2">High-Performance Networks</h5>
                              <p className="text-gray-600">
                                Curate high-quality specialty networks and centers of excellence to address specific population health needs.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border p-6">
                          <div className="flex items-start gap-4">
                            <div className="bg-orange-50 rounded-full p-3">
                              <span className="text-orange-500">📈</span>
                            </div>
                            <div>
                              <h5 className="font-bold mb-2">Advanced Digital Solutions</h5>
                              <p className="text-gray-600">
                                Deploy sophisticated digital health platforms with personalized recommendations and integrated benefit solutions.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 px-8 py-6 border-t">
            <h3 className="text-xl font-bold mb-4">Want a More In-Depth Analysis?</h3>
            <p className="text-gray-600 mb-6">
              Get a comprehensive report tailored specifically for your organization based on your Savvy Healthcare Navigators archetype.
            </p>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-orange-500 text-xl">📄</span>
                <h4 className="text-xl font-bold">Complete a1 Archetype Analysis</h4>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">PREMIUM</span>
              </div>

              <h5 className="font-bold mb-4">Your detailed report includes:</h5>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">→</span>
                  <span>Customized benchmarking against similar organizations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">→</span>
                  <span>Strategic implementation roadmap with priorities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">→</span>
                  <span>Cost-saving estimates specific to your business</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">→</span>
                  <span>Expert consultation with a healthcare strategist</span>
                </li>
              </ul>

              <div className="flex flex-col md:flex-row items-center justify-between">
                <p className="text-gray-600 mb-4 md:mb-0">
                  Our team will prepare a custom analysis within 24 hours.
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600 w-full md:w-auto">
                  Request My Detailed Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
