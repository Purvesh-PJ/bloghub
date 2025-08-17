import React, { useState } from 'react';
import {
    Container,
    PageHeader,
    Title,
    HeaderActions,
    SearchContainer,
    SearchInput,
    SearchIcon,
    FilterContainer,
    FilterSelect,
    DateRangeContainer,
    DateInput,
    CardContainer,
    LogList,
    LogItem,
    LogHeader,
    LogInfo,
    LogTitle,
    LogMeta,
    LogMetaItem,
    ActionBadge,
    LogContent,
    LogDescription,
    LogDetails,
    LogNote,
    Pagination,
    PaginationInfo,
    PaginationButtons,
    PaginationButton,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateText,
    Button
} from './Page_AdminModerationLog-Style';

import { 
    Search, 
    Calendar, 
    Clock, 
    User, 
    FileText, 
    MessageSquare, 
    Check, 
    X, 
    Trash2, 
    UserX, 
    UserCheck, 
    AlertTriangle, 
    ChevronLeft, 
    ChevronRight, 
    ChevronsLeft, 
    ChevronsRight,
    Shield,
    Download
} from 'lucide-react';

const Page_AdminModerationLog = () => {
    const [actionType, setActionType] = useState('all');
    const [moderator, setModerator] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Sample data for moderation logs
    const moderationLogs = [
        {
            id: 1,
            title: 'Post Removed',
            action: 'delete',
            moderator: 'Admin User',
            moderatorId: 1,
            timestamp: '2025-04-06T00:30:00',
            time: '15 minutes ago',
            description: 'Removed post due to violation of community guidelines',
            details: 'Post contained misleading information about AI technology that could be harmful.',
            note: 'User was warned about posting misleading content.',
            contentType: 'post',
            contentId: 101,
            contentTitle: 'The Dark Side of Artificial Intelligence',
            userId: 201,
            userName: 'John Doe'
        },
        {
            id: 2,
            title: 'Comment Removed',
            action: 'delete',
            moderator: 'Moderator User',
            moderatorId: 2,
            timestamp: '2025-04-06T00:15:00',
            time: '30 minutes ago',
            description: 'Removed comment due to harassment',
            details: 'Comment contained personal attacks against another user.',
            note: 'Second offense for this user.',
            contentType: 'comment',
            contentId: 201,
            contentTitle: 'Comment on "React Best Practices for 2025"',
            userId: 202,
            userName: 'Jane Smith'
        },
        {
            id: 3,
            title: 'User Banned',
            action: 'ban',
            moderator: 'Admin User',
            moderatorId: 1,
            timestamp: '2025-04-05T23:45:00',
            time: '1 hour ago',
            description: 'Banned user for repeated violations',
            details: 'User has violated community guidelines multiple times despite warnings.',
            note: 'Permanent ban applied after 3 warnings.',
            userId: 203,
            userName: 'Michael Johnson'
        },
        {
            id: 4,
            title: 'Report Approved',
            action: 'approve',
            moderator: 'Moderator User',
            moderatorId: 2,
            timestamp: '2025-04-05T23:30:00',
            time: '1 hour 15 minutes ago',
            description: 'Approved report for plagiarized content',
            details: 'Post was confirmed to contain content copied from another website without attribution.',
            note: 'Post was removed and user was warned.',
            contentType: 'post',
            contentId: 102,
            contentTitle: 'React Best Practices for 2025',
            userId: 204,
            userName: 'Sarah Williams',
            reportId: 301
        },
        {
            id: 5,
            title: 'Report Rejected',
            action: 'reject',
            moderator: 'Admin User',
            moderatorId: 1,
            timestamp: '2025-04-05T23:00:00',
            time: '1 hour 45 minutes ago',
            description: 'Rejected report for offensive content',
            details: 'Review found that the reported content did not violate community guidelines.',
            note: 'Content was opinionated but not offensive.',
            contentType: 'post',
            contentId: 103,
            contentTitle: 'Why Python is Better Than JavaScript',
            userId: 205,
            userName: 'David Brown',
            reportId: 302
        },
        {
            id: 6,
            title: 'User Warned',
            action: 'warn',
            moderator: 'Moderator User',
            moderatorId: 2,
            timestamp: '2025-04-05T22:30:00',
            time: '2 hours 15 minutes ago',
            description: 'Issued warning for spam comments',
            details: 'User has been posting promotional content in comments.',
            note: 'First warning issued.',
            userId: 206,
            userName: 'Emily Davis'
        },
        {
            id: 7,
            title: 'User Unbanned',
            action: 'unban',
            moderator: 'Admin User',
            moderatorId: 1,
            timestamp: '2025-04-05T22:00:00',
            time: '2 hours 45 minutes ago',
            description: 'Unbanned user after appeal',
            details: 'User appealed ban and promised to adhere to community guidelines.',
            note: 'User will be permanently banned if further violations occur.',
            userId: 207,
            userName: 'Robert Wilson'
        }
    ];
    
    // List of moderators for filter dropdown
    const moderators = [
        { id: 1, name: 'Admin User' },
        { id: 2, name: 'Moderator User' }
    ];
    
    // Filter logs based on action type, moderator, and search term
    const getFilteredLogs = () => {
        let filtered = moderationLogs;
        
        if (actionType !== 'all') {
            filtered = filtered.filter(log => log.action === actionType);
        }
        
        if (moderator !== 'all') {
            filtered = filtered.filter(log => log.moderator === moderator);
        }
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(log => 
                log.title.toLowerCase().includes(term) || 
                log.description.toLowerCase().includes(term) ||
                (log.contentTitle && log.contentTitle.toLowerCase().includes(term)) ||
                log.userName.toLowerCase().includes(term)
            );
        }
        
        if (startDate && endDate) {
            // In a real application, this would filter by date range
            // For this example, we're just returning the filtered logs
        }
        
        return filtered;
    };
    
    const filteredLogs = getFilteredLogs();
    
    // Handle action type filter change
    const handleActionTypeChange = (e) => {
        setActionType(e.target.value);
        setCurrentPage(1);
    };
    
    // Handle moderator filter change
    const handleModeratorChange = (e) => {
        setModerator(e.target.value);
        setCurrentPage(1);
    };
    
    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    
    // Handle date range changes
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };
    
    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };
    
    // Get action badge class based on action type
    const getActionBadgeClass = (action) => {
        switch (action) {
            case 'approve':
                return 'approve';
            case 'reject':
                return 'reject';
            case 'delete':
                return 'delete';
            case 'ban':
                return 'ban';
            case 'unban':
                return 'unban';
            case 'warn':
                return 'warn';
            default:
                return '';
        }
    };
    
    // Get action icon based on action type
    const getActionIcon = (action) => {
        switch (action) {
            case 'approve':
                return <Check size={14} />;
            case 'reject':
                return <X size={14} />;
            case 'delete':
                return <Trash2 size={14} />;
            case 'ban':
                return <UserX size={14} />;
            case 'unban':
                return <UserCheck size={14} />;
            case 'warn':
                return <AlertTriangle size={14} />;
            default:
                return null;
        }
    };
    
    // Get content type icon
    const getContentTypeIcon = (contentType) => {
        switch (contentType) {
            case 'post':
                return <FileText size={14} />;
            case 'comment':
                return <MessageSquare size={14} />;
            default:
                return null;
        }
    };
    
    return (
        <Container>
            <PageHeader>
                <Title>Moderation Log</Title>
                <HeaderActions>
                    <SearchContainer>
                        <SearchIcon>
                            <Search size={16} />
                        </SearchIcon>
                        <SearchInput 
                            type="text" 
                            placeholder="Search moderation logs..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </SearchContainer>
                    <Button className="secondary">
                        <Download size={16} />
                        Export Log
                    </Button>
                </HeaderActions>
            </PageHeader>
            
            <FilterContainer>
                <FilterSelect 
                    value={actionType} 
                    onChange={handleActionTypeChange}
                >
                    <option value="all">All Actions</option>
                    <option value="approve">Approvals</option>
                    <option value="reject">Rejections</option>
                    <option value="delete">Deletions</option>
                    <option value="ban">Bans</option>
                    <option value="unban">Unbans</option>
                    <option value="warn">Warnings</option>
                </FilterSelect>
                
                <FilterSelect 
                    value={moderator} 
                    onChange={handleModeratorChange}
                >
                    <option value="all">All Moderators</option>
                    {moderators.map(mod => (
                        <option key={mod.id} value={mod.name}>{mod.name}</option>
                    ))}
                </FilterSelect>
                
                <DateRangeContainer>
                    <DateInput 
                        type="date" 
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                    <span>to</span>
                    <DateInput 
                        type="date" 
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </DateRangeContainer>
            </FilterContainer>
            
            <CardContainer>
                <LogList>
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map(log => (
                            <LogItem key={log.id}>
                                <LogHeader>
                                    <LogInfo>
                                        <LogTitle>{log.title}</LogTitle>
                                        <LogMeta>
                                            <LogMetaItem>
                                                <User size={14} />
                                                By {log.moderator}
                                            </LogMetaItem>
                                            <LogMetaItem>
                                                <Clock size={14} />
                                                {log.time}
                                            </LogMetaItem>
                                            <LogMetaItem>
                                                <Calendar size={14} />
                                                {log.timestamp}
                                            </LogMetaItem>
                                            {log.contentType && (
                                                <LogMetaItem>
                                                    {getContentTypeIcon(log.contentType)}
                                                    {log.contentType.charAt(0).toUpperCase() + log.contentType.slice(1)} #{log.contentId}
                                                </LogMetaItem>
                                            )}
                                        </LogMeta>
                                    </LogInfo>
                                    <ActionBadge className={getActionBadgeClass(log.action)}>
                                        {getActionIcon(log.action)}
                                        <span style={{ marginLeft: '0.25rem' }}>
                                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                                        </span>
                                    </ActionBadge>
                                </LogHeader>
                                
                                <LogContent>
                                    <LogDescription>
                                        {log.description}
                                    </LogDescription>
                                    <LogDetails>
                                        {log.details}
                                    </LogDetails>
                                    {log.note && (
                                        <LogNote>
                                            <strong>Note:</strong> {log.note}
                                        </LogNote>
                                    )}
                                </LogContent>
                            </LogItem>
                        ))
                    ) : (
                        <EmptyState>
                            <EmptyStateIcon>
                                <Shield size={24} />
                            </EmptyStateIcon>
                            <EmptyStateTitle>
                                No moderation logs found
                            </EmptyStateTitle>
                            <EmptyStateText>
                                There are no moderation logs matching your filter criteria.
                            </EmptyStateText>
                        </EmptyState>
                    )}
                </LogList>
                
                {filteredLogs.length > 0 && (
                    <Pagination>
                        <PaginationInfo>
                            Showing {filteredLogs.length} logs
                        </PaginationInfo>
                        <PaginationButtons>
                            <PaginationButton disabled={currentPage === 1}>
                                <ChevronsLeft size={16} />
                            </PaginationButton>
                            <PaginationButton disabled={currentPage === 1}>
                                <ChevronLeft size={16} />
                            </PaginationButton>
                            <PaginationButton className="active">
                                {currentPage}
                            </PaginationButton>
                            <PaginationButton disabled={true}>
                                <ChevronRight size={16} />
                            </PaginationButton>
                            <PaginationButton disabled={true}>
                                <ChevronsRight size={16} />
                            </PaginationButton>
                        </PaginationButtons>
                    </Pagination>
                )}
            </CardContainer>
        </Container>
    );
};

export default Page_AdminModerationLog;
