import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Link, Tag, Type, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { validateUrl, getPlaceholderImage } from '../utils/helperFunctions';

const AddResourceModal = ({ onClose }) => {
    const { addResource, tags, addTag } = useAppContext();
    const [resource, setResource] = useState({
        title: '',
        description: '',
        url: '',
        image: '',
        tags: []
    });
    const [newTag, setNewTag] = useState('');
    const [errors, setErrors] = useState({});

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setResource(prev => ({ ...prev, image: event.target.result }));
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // In the handleSubmit function
    // Update the handleSubmit function
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!resource.title.trim()) newErrors.title = 'Title is required';
        if (!resource.url.trim()) newErrors.url = 'URL is required';
        if (!validateUrl(resource.url)) newErrors.url = 'Invalid URL format';
        if (!resource.tags.length) newErrors.tags = 'At least one tag is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Pass the resource with tags
        addResource({
            ...resource,
            tags: [...new Set(resource.tags)], // Remove duplicates
            image: resource.image || getPlaceholderImage()
        });
        onClose();
    };


    // Update the useDropzone configuration
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
            'image/svg+xml': ['.svg']
        },
        multiple: false
    });

    // Update the handleImagePaste function
    const handleImagePaste = (e) => {
        const items = e.clipboardData.items;
        for (let item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file && isValidImageType(file)) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        setResource(prev => ({ ...prev, image: event.target.result }));
                    };
                    reader.readAsDataURL(file);
                }
                break;
            }
        }
    };

    // Add validation helper function
    const isValidImageType = (file) => {
        const validTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/svg+xml'
        ];
        return validTypes.includes(file.type);
    };

    // Update the image input JSX
    <input
        {...getInputProps()}
        accept=".jpg,.jpeg,.png,.webp,.svg"
    />


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Add New Resource</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title Input */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Type size={16} />
                                <label className="text-sm font-medium">Title</label>
                            </div>
                            <input
                                type="text"
                                value={resource.title}
                                onChange={e => setResource({ ...resource, title: e.target.value })}
                                className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter resource title"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>

                        {/* URL Input */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Link size={16} />
                                <label className="text-sm font-medium">URL</label>
                            </div>
                            <input
                                type="url"
                                value={resource.url}
                                onChange={e => setResource({ ...resource, url: e.target.value })}
                                className={`w-full p-2 border rounded-md ${errors.url ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="https://example.com"
                            />
                            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
                        </div>

                        {/* Tags Input */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Tag size={16} />
                                <label className="text-sm font-medium">Tags</label>
                            </div>
                            <div className={`p-2 border rounded-md ${errors.tags ? 'border-red-500' : 'border-gray-300'}`}>
                                <div className="flex flex-wrap gap-2">
                                    {resource.tags.map(tag => (
                                        <span key={tag} className="flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => setResource(prev => ({
                                                    ...prev,
                                                    tags: prev.tags.filter(t => t !== tag)
                                                }))}
                                                className="ml-1 hover:text-blue-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (['Enter', ','].includes(e.key)) {
                                                e.preventDefault();
                                                const tag = newTag.trim();
                                                if (tag && !resource.tags.includes(tag)) {
                                                    if (!tags.includes(tag)) addTag(tag);
                                                    setResource(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                                                    setNewTag('');
                                                }
                                            }
                                        }}
                                        placeholder="Type and press enter to add tags"
                                        className="flex-1 min-w-[120px] p-1 outline-none bg-transparent"
                                    />
                                </div>
                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Available tags: {tags.filter(t => !resource.tags.includes(t)).join(', ')}
                                </div>
                            </div>
                            {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                        </div>

                        {/* Description Input */}
                        <div>
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                value={resource.description}
                                onChange={e => setResource({ ...resource, description: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                                rows="3"
                                placeholder="Enter resource description"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="text-sm font-medium">Image</label>
                            <div
                                {...getRootProps()}
                                className={`mt-1 border-2 border-dashed rounded-md p-4 text-center cursor-pointer
                                    ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
                                onPaste={handleImagePaste}
                            >
                                <input {...getInputProps()} />
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Drag & drop an image here, or click to select one
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    You can also paste an image                                     from clipboard
                                </p>
                            </div>
                            {resource.image && (
                                <div className="mt-4 relative group">
                                    <img
                                        src={resource.image}
                                        alt="Preview"
                                        className="w-full h-32 object-cover rounded-md border dark:border-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setResource(prev => ({ ...prev, image: '' }))}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Resource
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddResourceModal;