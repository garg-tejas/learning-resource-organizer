import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { doc, setDoc, getDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { user } = useAuth();
    const [localResources, setLocalResources] = useLocalStorage('resources', []);
    const [localTags, setLocalTags] = useLocalStorage('tags', ['DSA', 'CP', 'ML']);
    const [selectedTags, setSelectedTags] = useLocalStorage('selectedTags', []);
    const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
    const [isDarkMode, setIsDarkMode] = useLocalStorage(
        'darkMode',
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    // State for cloud-synced data
    const [resources, setResources] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modify the getFilteredResources function
    const getFilteredResources = useCallback((field = null) => {
        return resources.filter(resource => {
            const matchesSearch = searchTerm === '' ||
                resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesSelectedTags = selectedTags.length === 0 ||
                selectedTags.every(tag => resource.tags.includes(tag));

            // Critical fix: Only show resources that have this specific rack's tag
            const matchesRackTag = field ?
                resource.tags.includes(field) :
                true;

            return matchesSearch && matchesSelectedTags && matchesRackTag;
        });
    }, [resources, searchTerm, selectedTags]);


    // Handle dark mode
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    // Handle local data merge
    const mergeLocalData = useCallback(async (userRef) => {
        if (localResources.length > 0) {
            const resourcesRef = collection(userRef, 'resources');
            try {
                await Promise.all(localResources.map(resource =>
                    setDoc(doc(resourcesRef, resource.id.toString()), resource)
                ));
                setLocalResources([]);
            } catch (error) {
                console.error('Error merging local data:', error);
                toast.error('Failed to merge local data 😞');
            }
        }
    }, [localResources, setLocalResources]);

    // Sync data between cloud and local storage
    useEffect(() => {
        let unsubscribeResources;
        let unsubscribeTags;

        const initializeData = async () => {
            try {
                setLoading(true);

                if (user) {
                    // User is logged in - use cloud storage
                    const userRef = doc(db, 'users', user.uid);

                    // Sync resources
                    const resourcesRef = collection(userRef, 'resources');
                    unsubscribeResources = onSnapshot(resourcesRef, (snapshot) => {
                        const cloudResources = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        setResources(cloudResources);
                    });

                    // Sync tags
                    const tagsDoc = await getDoc(doc(userRef, 'metadata', 'tags'));
                    if (tagsDoc.exists()) {
                        setTags(tagsDoc.data().tags);
                    } else {
                        // Initialize cloud tags with local tags
                        await setDoc(doc(userRef, 'metadata', 'tags'), { tags: localTags });
                        setTags(localTags);
                    }

                    // Merge local data with cloud data
                    await mergeLocalData(userRef);
                } else {
                    // User is logged out - use local storage
                    setResources(localResources);
                    setTags(localTags);
                }
            } catch (error) {
                console.error('Error initializing data:', error);
                toast.error('Failed to initialize data 😞');
            } finally {
                setLoading(false);
            }
        };

        initializeData();

        return () => {
            unsubscribeResources?.();
            unsubscribeTags?.();
        };
    }, [user, localTags, localResources, mergeLocalData]); // Removed resources and added mergeLocalData

    const addResource = async (newResource) => {
        try {
            const resourceWithId = {
                ...newResource,
                id: Date.now().toString(),
                tags: newResource.tags.filter(tag => tags.includes(tag))
            };

            // Add tags to both local and cloud
            newResource.tags.forEach(tag => {
                if (!tags.includes(tag)) {
                    addTag(tag);
                }
            });

            if (user) {
                // Cloud storage
                const userRef = doc(db, 'users', user.uid);
                const resourceRef = doc(collection(userRef, 'resources'), resourceWithId.id);
                await setDoc(resourceRef, resourceWithId);
            } else {
                // Local storage
                setLocalResources(prev => [...prev, resourceWithId]);
                setResources(prev => [...prev, resourceWithId]);
            }

            toast.success('Resource added successfully 🎉');
        } catch (error) {
            console.error('Error adding resource:', error);
            toast.error('Failed to add resource 😞');
        }
    };

    const deleteResource = async (id) => {
        try {
            if (user) {
                // Cloud storage
                const userRef = doc(db, 'users', user.uid);
                await deleteDoc(doc(collection(userRef, 'resources'), id.toString()));
            } else {
                // Local storage
                setLocalResources(prev => prev.filter(resource => resource.id !== id));
                setResources(prev => prev.filter(resource => resource.id !== id));
            }

            toast.success('Resource deleted successfully 🗑️');
        } catch (error) {
            console.error('Error deleting resource:', error);
            toast.error('Failed to delete resource 😞');
        }
    };

    const addTag = async (newTag) => {
        try {
            if (tags.includes(newTag)) return;

            const updatedTags = [...tags, newTag];

            if (user) {
                // Cloud storage
                const userRef = doc(db, 'users', user.uid);
                await setDoc(doc(userRef, 'metadata', 'tags'), { tags: updatedTags });
            } else {
                // Local storage
                setLocalTags(updatedTags);
            }

            setTags(updatedTags);
            toast.success(`Tag "${newTag}" added 🏷️`);
        } catch (error) {
            console.error('Error adding tag:', error);
            toast.error('Failed to add tag 😞');
        }
    };

    const deleteTag = async (tagToDelete) => {
        try {
            const updatedTags = tags.filter(tag => tag !== tagToDelete);
            const updatedResources = resources.map(resource => ({
                ...resource,
                tags: resource.tags.filter(tag => tag !== tagToDelete)
            }));

            if (user) {
                // Cloud storage
                const userRef = doc(db, 'users', user.uid);
                await Promise.all([
                    setDoc(doc(userRef, 'metadata', 'tags'), { tags: updatedTags }),
                    ...updatedResources.map(resource =>
                        setDoc(doc(collection(userRef, 'resources'), resource.id.toString()), resource)
                    )
                ]);
            } else {
                // Local storage
                setLocalTags(updatedTags);
                setLocalResources(updatedResources);
            }

            setTags(updatedTags);
            setResources(updatedResources);
            toast.success(`Tag "${tagToDelete}" deleted 🗑️`);
        } catch (error) {
            console.error('Error deleting tag:', error);
            toast.error('Failed to delete tag 😞');
        }
    };

    return (
        <AppContext.Provider value={{
            resources,
            tags,
            selectedTags,
            searchTerm,
            isDarkMode,
            loading,
            getFilteredResources,
            setResources: user ? setResources : setLocalResources,
            setTags: user ? setTags : setLocalTags,
            setSelectedTags,
            setSearchTerm,
            setIsDarkMode,
            addResource,
            deleteResource,
            addTag,
            deleteTag
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export default AppContext;