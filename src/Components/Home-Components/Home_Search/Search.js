import { useEffect, useState, useRef } from 'react';
import { 
    Container, 
    SearchInput, 
    InputField, 
    Searchicon, 
    Closeicon, 
    SearchResultContainer, 
    PostContainer, 
    PostHeading, 
    PostContent, 
    NavLink, 
    Loading,
    EmptyState,
    SearchEmptyIcon,
    ResultsHeader,
    ResultStats,
    ResultActions,
    ClearButton,
    ResultCategory,
    PostDate,
    HighlightedText,
    SearchLoadingSpinner,
    FilterDropdown,
    FilterButton,
    FilterIcon,
    FilterItem,
    SearchHint,
    RecentSearches,
    RecentSearchItem,
    RecentSearchTitle,
    ClearHistoryButton
} from './Search-Style';
import { getSearchResults } from '../../../services/searchApi';
import { FiSearch, FiX, FiFilter, FiFileText, FiClock, FiTrash2 } from 'react-icons/fi';

const Search = ({ close, darkMode }) => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const inputRef = useRef(null);
    const searchTimeout = useRef(null);
    
    // Load recent searches from localStorage
    useEffect(() => {
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
        
        // Focus input on load
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    
    // Handle search input changes with debounce
    const handleSearchInput = (event) => {
        const query = event.target.value;
        setSearch(query);
        setIsTyping(true);
        
        // Clear any existing timeout
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        
        // Set new timeout for search
        searchTimeout.current = setTimeout(() => {
            setIsTyping(false);
            if (query.trim() !== '') {
                performSearch(query);
            } else {
                setSearchResults([]);
            }
        }, 500);
    };
    
    // Clear search
    const clearSearch = () => {
        setSearch('');
        setSearchResults([]);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    
    // Perform search and store recent searches
    const performSearch = async (query) => {
        try {
            setLoading(true);
            const response = await getSearchResults(query);
            setSearchResults(response.data.data);
            
            // Save to recent searches if not already present
            if (query.trim() !== '') {
                saveToRecentSearches(query);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };
    
    // Save search to recent searches
    const saveToRecentSearches = (query) => {
        const updatedSearches = [
            ...recentSearches.filter(item => item.term !== query),
            { term: query, date: new Date().toISOString() }
        ].slice(-5); // Keep only 5 most recent
        
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };
    
    // Clear all recent searches
    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };
    
    // Handle click on a recent search item
    const handleRecentSearchClick = (term) => {
        setSearch(term);
        performSearch(term);
    };
    
    // Filter results
    const filteredResults = () => {
        if (activeFilter === 'all') return searchResults;
        
        // Filter by category (example implementation)
        return searchResults.filter(post => {
            // Assuming posts have categories, this would need to be adjusted based on your actual data structure
            return post.category?.toLowerCase() === activeFilter;
        });
    };
    
    // Highlight matching text
    const highlightMatch = (text, query) => {
        if (!text || !query) return text;
        
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) => 
            part.toLowerCase() === query.toLowerCase() 
                ? <HighlightedText key={i} darkMode={darkMode}>{part}</HighlightedText> 
                : part
        );
    };
    
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }).format(date);
    };

    return ( 
        <Container darkMode={darkMode}>
            <SearchInput darkMode={darkMode}>
                    <Searchicon />
                <InputField 
                    ref={inputRef}
                    name='search' 
                    placeholder='Search for posts, topics, or keywords...' 
                    value={search}
                    onChange={handleSearchInput}
                    darkMode={darkMode}
                />
                {search && (
                    <ClearButton onClick={clearSearch} darkMode={darkMode}>
                        <FiX />
                    </ClearButton>
                )}
                    <Closeicon onClick={close} />
                </SearchInput>
            
            <SearchResultContainer darkMode={darkMode}>
                {isTyping && (
                    <SearchHint darkMode={darkMode}>
                        <FiClock />
                        <span>Typing to search...</span>
                    </SearchHint>
                )}
                
                {loading && (
                    <Loading darkMode={darkMode}>
                        <SearchLoadingSpinner />
                        <span>Searching for results...</span>
                        </Loading> 
                )}
                
                {!loading && !isTyping && search.trim() === '' && recentSearches.length > 0 && (
                    <RecentSearches darkMode={darkMode}>
                        <RecentSearchTitle>
                            <span>Recent Searches</span>
                            <ClearHistoryButton onClick={clearRecentSearches} darkMode={darkMode}>
                                <FiTrash2 />
                                <span>Clear</span>
                            </ClearHistoryButton>
                        </RecentSearchTitle>
                        
                        {recentSearches.map((item, index) => (
                            <RecentSearchItem 
                                key={index} 
                                onClick={() => handleRecentSearchClick(item.term)}
                                darkMode={darkMode}
                            >
                                <FiClock />
                                <span>{item.term}</span>
                            </RecentSearchItem>
                        ))}
                    </RecentSearches>
                )}
                
                {!loading && !isTyping && search.trim() !== '' && (
                    <>
                        {searchResults.length > 0 ? (
                            <>
                                <ResultsHeader darkMode={darkMode}>
                                    <ResultStats>
                                        {filteredResults().length} results for "{search}"
                                    </ResultStats>
                                    
                                    <ResultActions>
                                        <FilterButton 
                                            onClick={() => setShowFilters(!showFilters)}
                                            darkMode={darkMode}
                                        >
                                            <FilterIcon />
                                            <span>Filter</span>
                                        </FilterButton>
                                        
                                        {showFilters && (
                                            <FilterDropdown darkMode={darkMode}>
                                                <FilterItem 
                                                    active={activeFilter === 'all'}
                                                    onClick={() => setActiveFilter('all')}
                                                    darkMode={darkMode}
                                                >
                                                    All Results
                                                </FilterItem>
                                                <FilterItem 
                                                    active={activeFilter === 'technology'}
                                                    onClick={() => setActiveFilter('technology')}
                                                    darkMode={darkMode}
                                                >
                                                    Technology
                                                </FilterItem>
                                                <FilterItem 
                                                    active={activeFilter === 'lifestyle'}
                                                    onClick={() => setActiveFilter('lifestyle')}
                                                    darkMode={darkMode}
                                                >
                                                    Lifestyle
                                                </FilterItem>
                                                {/* Add more filter options as needed */}
                                            </FilterDropdown>
                                        )}
                                    </ResultActions>
                                </ResultsHeader>
                                
                                {filteredResults().map(post => (
                                    <NavLink to={`/Fullpost/${post._id}`} key={post._id} darkMode={darkMode}>
                                        <PostContainer darkMode={darkMode}>
                                            <div className="post-header">
                                                <PostHeading darkMode={darkMode}>
                                                    {highlightMatch(post.title, search)}
                                                </PostHeading>
                                                <ResultCategory darkMode={darkMode}>
                                                    <FiFileText />
                                                    <span>{post.category || 'General'}</span>
                                                </ResultCategory>
                                            </div>
                                            
                                            <PostContent darkMode={darkMode}>
                                                {highlightMatch(post.truncatedContent, search)}
                                            </PostContent>
                                            
                                            <PostDate darkMode={darkMode}>
                                                <FiClock />
                                                <span>{formatDate(post.createdAt)}</span>
                                            </PostDate>
                                        </PostContainer>
                                    </NavLink>
                                ))}
                            </>
                        ) : (
                            <EmptyState darkMode={darkMode}>
                                <SearchEmptyIcon />
                                <h3>No results found for "{search}"</h3>
                                <p>Try using different keywords or check your spelling</p>
                            </EmptyState>
                        )}
                    </>
                )}
                
                {!loading && !isTyping && search.trim() === '' && recentSearches.length === 0 && (
                    <EmptyState darkMode={darkMode}>
                        <FiSearch size={40} />
                        <h3>Search for content</h3>
                        <p>Enter keywords to find posts, topics, and more</p>
                    </EmptyState>
                )}
                </SearchResultContainer>
            </Container>    
    );
};
 
export default Search;