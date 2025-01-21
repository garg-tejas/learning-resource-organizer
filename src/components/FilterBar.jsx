import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const FilterBar = () => {
    const {
        tags,
        selectedTags,
        setSelectedTags,
        searchTerm,
        setSearchTerm
    } = useAppContext();

    const handleTagToggle = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const clearFilters = () => {
        setSelectedTags([]);
        setSearchTerm('');
    };

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-lg">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search resources..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                            </button>
                        )}
                    </div>

                    {/* Filter Section */}
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                            <Filter className="h-4 w-4" />
                            <span>Filters:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${selectedTags.includes(tag)
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {tag}
                                    {selectedTags.includes(tag) && (
                                        <X className="ml-2 h-3 w-3" />
                                    )}
                                </button>
                            ))}
                        </div>
                        {(selectedTags.length > 0 || searchTerm) && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;