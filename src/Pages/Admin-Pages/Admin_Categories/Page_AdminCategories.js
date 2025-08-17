import React, { useState } from 'react';
import {
    Container,
    PageHeader,
    Title,
    HeaderActions,
    Button,
    TabsContainer,
    Tab,
    ContentContainer,
    LeftPanel,
    RightPanel,
    PanelHeader,
    PanelTitle,
    PanelContent,
    CategoryList,
    CategoryItem,
    CategoryName,
    CategoryCount,
    CategoryActions,
    ActionButton,
    FormGroup,
    Label,
    Input,
    TagsContainer,
    Tag,
    TagText,
    TagRemove,
    ColorPicker,
    ColorOption,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateText
} from './Page_AdminCategories-Style';

import { 
    Plus, 
    Pencil, 
    Trash2, 
    Tags, 
    Tag as TagIcon, 
    X,
    FolderPlus
} from 'lucide-react';

const Page_AdminCategories = () => {
    const [activeTab, setActiveTab] = useState('categories');
    const [categories, setCategories] = useState([
        { id: 1, name: 'Technology', count: 24, color: '#3b82f6' },
        { id: 2, name: 'Programming', count: 18, color: '#10b981' },
        { id: 3, name: 'Web Development', count: 12, color: '#f59e0b' },
        { id: 4, name: 'Artificial Intelligence', count: 8, color: '#8b5cf6' },
        { id: 5, name: 'Data Science', count: 6, color: '#ec4899' }
    ]);
    
    const [tags, setTags] = useState([
        { id: 1, name: 'JavaScript', count: 32 },
        { id: 2, name: 'React', count: 28 },
        { id: 3, name: 'Node.js', count: 21 },
        { id: 4, name: 'Python', count: 19 },
        { id: 5, name: 'Machine Learning', count: 14 },
        { id: 6, name: 'CSS', count: 12 },
        { id: 7, name: 'HTML', count: 10 },
        { id: 8, name: 'TypeScript', count: 9 }
    ]);
    
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        color: '#3b82f6'
    });
    
    const colorOptions = [
        '#3b82f6', // Blue
        '#10b981', // Green
        '#f59e0b', // Yellow
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#ec4899', // Pink
        '#6366f1', // Indigo
        '#14b8a6', // Teal
        '#f97316', // Orange
        '#64748b'  // Slate
    ];
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedItem(null);
        resetForm();
    };
    
    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setFormData({
            name: item.name,
            color: item.color || '#3b82f6'
        });
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleColorSelect = (color) => {
        setFormData(prev => ({ ...prev, color }));
    };
    
    const resetForm = () => {
        setFormData({
            name: '',
            color: '#3b82f6'
        });
        setSelectedItem(null);
    };
    
    const handleAddItem = () => {
        if (!formData.name.trim()) return;
        
        const newItem = {
            id: Date.now(),
            name: formData.name,
            count: 0,
            color: formData.color
        };
        
        if (activeTab === 'categories') {
            setCategories(prev => [...prev, newItem]);
        } else {
            setTags(prev => [...prev, newItem]);
        }
        
        resetForm();
    };
    
    const handleUpdateItem = () => {
        if (!selectedItem || !formData.name.trim()) return;
        
        if (activeTab === 'categories') {
            setCategories(prev => 
                prev.map(item => 
                    item.id === selectedItem.id 
                        ? { ...item, name: formData.name, color: formData.color } 
                        : item
                )
            );
        } else {
            setTags(prev => 
                prev.map(item => 
                    item.id === selectedItem.id 
                        ? { ...item, name: formData.name } 
                        : item
                )
            );
        }
        
        resetForm();
    };
    
    const handleDeleteItem = (id) => {
        if (activeTab === 'categories') {
            setCategories(prev => prev.filter(item => item.id !== id));
        } else {
            setTags(prev => prev.filter(item => item.id !== id));
        }
        
        if (selectedItem && selectedItem.id === id) {
            resetForm();
        }
    };
    
    return (
        <Container>
            <PageHeader>
                <Title>Manage Categories</Title>
                <HeaderActions>
                    <Button className="primary" onClick={() => resetForm()}>
                        <Plus size={16} />
                        Add New
                    </Button>
                </HeaderActions>
            </PageHeader>
            
            <TabsContainer>
                <Tab 
                    className={activeTab === 'categories' ? 'active' : ''} 
                    onClick={() => handleTabChange('categories')}
                >
                    Categories
                </Tab>
                <Tab 
                    className={activeTab === 'tags' ? 'active' : ''} 
                    onClick={() => handleTabChange('tags')}
                >
                    Tags
                </Tab>
            </TabsContainer>
            
            <ContentContainer>
                <LeftPanel>
                    <PanelHeader>
                        <PanelTitle>
                            {activeTab === 'categories' ? 'All Categories' : 'All Tags'}
                        </PanelTitle>
                    </PanelHeader>
                    <PanelContent>
                        <CategoryList>
                            {(activeTab === 'categories' ? categories : tags).map(item => (
                                <CategoryItem key={item.id} onClick={() => handleSelectItem(item)}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {activeTab === 'categories' && (
                                            <div 
                                                style={{ 
                                                    width: '0.75rem', 
                                                    height: '0.75rem', 
                                                    borderRadius: '0.25rem', 
                                                    backgroundColor: item.color 
                                                }} 
                                            />
                                        )}
                                        <CategoryName>{item.name}</CategoryName>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <CategoryCount>{item.count} posts</CategoryCount>
                                        <CategoryActions>
                                            <ActionButton onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectItem(item);
                                            }}>
                                                <Pencil size={14} />
                                            </ActionButton>
                                            <ActionButton className="delete" onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteItem(item.id);
                                            }}>
                                                <Trash2 size={14} />
                                            </ActionButton>
                                        </CategoryActions>
                                    </div>
                                </CategoryItem>
                            ))}
                            
                            {(activeTab === 'categories' ? categories.length === 0 : tags.length === 0) && (
                                <EmptyState>
                                    <EmptyStateIcon>
                                        {activeTab === 'categories' ? <FolderPlus size={24} /> : <Tags size={24} />}
                                    </EmptyStateIcon>
                                    <EmptyStateTitle>
                                        No {activeTab === 'categories' ? 'categories' : 'tags'} found
                                    </EmptyStateTitle>
                                    <EmptyStateText>
                                        Create your first {activeTab === 'categories' ? 'category' : 'tag'} to organize your content
                                    </EmptyStateText>
                                    <Button className="primary" onClick={() => resetForm()}>
                                        <Plus size={16} />
                                        Add {activeTab === 'categories' ? 'Category' : 'Tag'}
                                    </Button>
                                </EmptyState>
                            )}
                        </CategoryList>
                    </PanelContent>
                </LeftPanel>
                
                <RightPanel>
                    <PanelHeader>
                        <PanelTitle>
                            {selectedItem ? `Edit ${activeTab === 'categories' ? 'Category' : 'Tag'}` : `Add New ${activeTab === 'categories' ? 'Category' : 'Tag'}`}
                        </PanelTitle>
                    </PanelHeader>
                    <PanelContent>
                        <FormGroup>
                            <Label htmlFor="name">Name</Label>
                            <Input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleInputChange} 
                                placeholder={`Enter ${activeTab === 'categories' ? 'category' : 'tag'} name`} 
                            />
                        </FormGroup>
                        
                        {activeTab === 'categories' && (
                            <FormGroup>
                                <Label>Color</Label>
                                <ColorPicker>
                                    {colorOptions.map(color => (
                                        <ColorOption 
                                            key={color} 
                                            style={{ backgroundColor: color }} 
                                            className={formData.color === color ? 'selected' : ''}
                                            onClick={() => handleColorSelect(color)}
                                        />
                                    ))}
                                </ColorPicker>
                            </FormGroup>
                        )}
                        
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            {selectedItem ? (
                                <>
                                    <Button className="primary" onClick={handleUpdateItem}>
                                        Update
                                    </Button>
                                    <Button className="secondary" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button className="primary" onClick={handleAddItem}>
                                    <Plus size={16} />
                                    Add {activeTab === 'categories' ? 'Category' : 'Tag'}
                                </Button>
                            )}
                        </div>
                    </PanelContent>
                </RightPanel>
            </ContentContainer>
        </Container>
    );
};

export default Page_AdminCategories;
