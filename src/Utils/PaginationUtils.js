
export const Paginate = (array, itemsPerPage, currentPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = (array ?? []).slice(indexOfFirstItem, indexOfLastItem);
    return currentItems;
};

