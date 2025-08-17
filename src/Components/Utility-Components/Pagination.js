import React, { useState } from 'react';

function Pagination({ data, itemsPerPage }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Determine the start and end index of the items to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items to display on the current page
  const currentItems = data.slice(startIndex, endIndex);

  // Function to handle page navigation
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <ul>
        {currentItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <div>
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
