import { Container } from './Page_AdminDataManagement-Style';
import { MainContainer } from '../Admin_Add_Posts/Page_AdminAddPosts-Style';
import Table from '../../../Components/UI-Components/Table/Table';
import { data, columns } from '../../../data/AdminManageData';
import { useState } from 'react';
import { Search, Filter, RefreshCw, Download, Plus, Trash2 } from 'lucide-react';
import { 
  Header, 
  Title, 
  SearchContainer, 
  SearchInput, 
  ActionButtons, 
  Button, 
  FilterContainer, 
  FilterButton,
  RefreshButton,
  ActionBar,
  ButtonText
} from './Page_AdminDataManagement-Style';


const Page_AdminManageData = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);

    // Filter data based on search query
    const filteredData = data.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRowSelect = (rows) => {
        setSelectedRows(rows);
    };

    const handleRefresh = () => {
        setSearchQuery('');
        setSelectedRows([]);
    };

    const handleExport = () => {
        // Implementation for exporting data
        console.log('Exporting data...');
    };

    const handleDelete = () => {
        // Implementation for deleting selected rows
        console.log('Deleting selected rows:', selectedRows);
    };

    const handleAddNew = () => {
        // Implementation for adding new content
        console.log('Adding new content...');
    };

    return (
        <Container>
            <Header>
                <Title>Manage Content</Title>
                <ActionBar>
                    <SearchContainer>
                        <Search size={18} />
                        <SearchInput 
                            type="text" 
                            placeholder="Search content..." 
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </SearchContainer>
                    
                    <ActionButtons>
                        <FilterButton onClick={() => setFilterOpen(!filterOpen)}>
                            <Filter size={18} />
                            <ButtonText>Filter</ButtonText>
                        </FilterButton>
                        
                        <RefreshButton onClick={handleRefresh}>
                            <RefreshCw size={18} />
                            <ButtonText>Refresh</ButtonText>
                        </RefreshButton>
                        
                        <Button onClick={handleExport}>
                            <Download size={18} />
                            <ButtonText>Export</ButtonText>
                        </Button>
                        
                        <Button onClick={handleAddNew} primary>
                            <Plus size={18} />
                            <ButtonText>Add New</ButtonText>
                        </Button>
                        
                        {selectedRows.length > 0 && (
                            <Button onClick={handleDelete} danger>
                                <Trash2 size={18} />
                                <ButtonText>Delete</ButtonText>
                            </Button>
                        )}
                    </ActionButtons>
                </ActionBar>
                
                {filterOpen && (
                    <FilterContainer>
                        {/* Filter options will go here */}
                        <Button small onClick={() => setFilterOpen(false)}>Apply Filters</Button>
                    </FilterContainer>
                )}
            </Header>
            
            <MainContainer>
                <Table 
                    data={filteredData} 
                    columns={columns} 
                    onRowSelect={handleRowSelect}
                />
            </MainContainer>     
        </Container>
    )
}

export default Page_AdminManageData;