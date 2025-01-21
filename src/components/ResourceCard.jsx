import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, ExternalLink } from 'lucide-react';
import { getPlaceholderImage } from '../utils/helperFunctions';

const ResourceCard = ({ resource }) => {
    const { deleteResource } = useAppContext();
    const [imageError, setImageError] = useState(false);

    const handleDelete = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this resource?')) {
            deleteResource(resource.id);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="group relative w-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={imageError ? getPlaceholderImage() : (resource.image || getPlaceholderImage())}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={handleImageError}
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <p className="text-white text-sm line-clamp-4">{resource.description}</p>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{resource.title}</h3>

                <div className="flex flex-wrap gap-2 mb-3">
                    {resource.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        <ExternalLink size={16} />
                        <span>Open</span>
                    </a>

                    <button
                        onClick={handleDelete}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;