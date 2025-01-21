import React, { useState } from 'react';
import ResourceCard from './ResourceCard';
import { useAppContext } from '../context/AppContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Rack = ({ field }) => {
    const { getFilteredResources } = useAppContext();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const filteredResources = getFilteredResources(field);

    // Add debug logging
    console.log(`Rack ${field} resources:`, filteredResources);

    if (filteredResources.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-between text-left"
                >
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {field}
                        </h2>
                        <span className="px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md">
                            {filteredResources.length} resources
                        </span>
                    </div>
                    {isCollapsed ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                    )}
                </button>
            </div>

            {!isCollapsed && (
                <div className="p-4">
                    <div className="flex overflow-x-auto pb-4 space-x-4">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="flex-shrink-0 w-64">
                                <ResourceCard resource={resource} />
                            </div>
                        ))}
                    </div>
                    {filteredResources.length === 0 && (
                        <div className="p-4 text-gray-500 text-center">
                            No resources found in this category
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Rack;