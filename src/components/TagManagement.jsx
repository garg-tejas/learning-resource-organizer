import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, Plus, Tag, AlertTriangle, GripVertical } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const SortableTag = ({ tag, handleDeleteTag }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tag });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-2 mb-2 bg-gray-100 dark:bg-gray-700 rounded-md group"
        >
            <div className="flex items-center gap-2 flex-1">
                <button
                    className="touch-none p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical size={16} />
                </button>
                <span className="truncate">{tag}</span>
            </div>
            <button
                onClick={() => handleDeleteTag(tag)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete tag"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

const TagManagement = ({ onClose }) => {
    const { tags, addTag, deleteTag, setTags } = useAppContext();
    const [newTag, setNewTag] = useState('');
    const [error, setError] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setTags((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                const newItems = [...items];
                newItems.splice(newIndex, 0, newItems.splice(oldIndex, 1)[0]);
                return newItems;
            });
        }
    };

    const handleAddTag = async (e) => {
        e.preventDefault();
        const trimmedTag = newTag.trim();

        if (!trimmedTag) {
            setError('Tag name cannot be empty');
            return;
        }

        if (tags.includes(trimmedTag)) {
            setError('Tag already exists');
            return;
        }

        try {
            await addTag(trimmedTag);
            setNewTag('');
            setError('');
        } catch (error) {
            setError('Failed to add tag. Please try again.');
        }
    };

    const handleDeleteTag = async (tag) => {
        if (window.confirm(`Delete "${tag}" from all resources?`)) {
            try {
                await deleteTag(tag);
            } catch (error) {
                toast.error('Failed to delete tag');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full animate-fade-in">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            <h2 className="text-xl font-bold">Manage Tags</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleAddTag} className="mb-6">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => {
                                    setNewTag(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter new tag name"
                                className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add
                            </button>
                        </div>
                        {error && (
                            <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                    </form>

                    <div className="space-y-2">
                        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Existing Tags ({tags.length})
                        </h3>
                        <div className="max-h-60 overflow-y-auto">
                            {tags.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No tags created yet</p>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext items={tags} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-2">
                                            {tags.map((tag) => (
                                                <SortableTag
                                                    key={tag}
                                                    tag={tag}
                                                    handleDeleteTag={handleDeleteTag}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagManagement;