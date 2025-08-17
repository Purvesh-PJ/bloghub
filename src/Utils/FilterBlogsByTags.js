import { useState } from 'react';

const FilterBlogsByTags = ({blogs}) => {

    const [filteredBlogs, setFilteredBlogs] = useState(blogs);
    const [selectedTags, setSelectedTags] = useState([]);

    const filterBlogs = (blogs , tags) => {
        if(tags.length === 0){
            setFilteredBlogs(blogs);
        }
        else {
            const filtered = blogs?.filter(blog => tags?.some(tag => blog?.tags?.includes(tag)));
            return filtered;
        }
    }

    const generateAllTags = (blogs) => {
        return [...new Set(blogs.reduce((tags , blog) => [...tags, ...blog?.tags], []))]
    }

    const handleClickTag = (tag) => {
        if(tag === 'clear'){
            setSelectedTags([]);
            setFilteredBlogs(blogs);
        }
        else {
            const updatedSelectedTags = selectedTags?.includes(tag) ? selectedTags?.filter(t => t !== tag) : [...selectedTags, tag];
            setSelectedTags(updatedSelectedTags);
            const updatedFilteredBlogs = filterBlogs(blogs, updatedSelectedTags);
            setFilteredBlogs(updatedFilteredBlogs);
        }
    };

    const allTags = generateAllTags(blogs);
    console.log(allTags);

    return {
        filteredBlogs,
        selectedTags,
        allTags,
        handleClickTag,
    };
};

export default FilterBlogsByTags;