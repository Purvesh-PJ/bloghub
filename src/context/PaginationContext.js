import React, { createContext, useContext, useState, useEffect } from 'react';
import { Paginate } from '../Utils/PaginationUtils';

const PaginationContext = createContext();

export const PaginationProvider = ({children, data, postsPerPage}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPosts, setCurrentPosts] = useState([]);

    const totalPages = Math.ceil(data.length / postsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Debugging
    // console.log("Data :", data);
    // console.log("Data Length :",data.length);
    // console.log("Posts Per Page :",postsPerPage);
    // console.log("Total Pages :",totalPages);
    // console.log("Page Numbers :",pageNumbers);
    // console.log("currentPage :",currentPage);

    const gotoNext = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
    };
    
    const gotoPrev = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
    };

    const contextValue = {
        currentPage,
        totalPages,
        setCurrentPage,
        currentPosts,
        pageNumbers,
        generatePaginationButtons : () => {
            return pageNumbers.map((pageNumber) => ({
                pageNumber,
                onClick : () => setCurrentPage(pageNumber), 
            }));
        },
        gotoNext, 
        gotoPrev,
    };

    useEffect(() => {
        const currentPagePost = Paginate(data, postsPerPage, currentPage);
        setCurrentPosts(currentPagePost);  
    }, [currentPage, data, postsPerPage]);

    return (
        <PaginationContext.Provider value={contextValue}>
            {children}
        </PaginationContext.Provider>
    );
};

export const usePagination = () => {
    const context = useContext(PaginationContext);
    if (!context) {
        throw new Error('usePagination must be used within a PaginationProvider');
    }
    return context;
};