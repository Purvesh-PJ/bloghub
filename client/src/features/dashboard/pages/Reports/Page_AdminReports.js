import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  PageHeader,
  Title,
  HeaderActions,
  FilterContainer,
  FilterSelect,
  CardContainer,
  TabsContainer,
  Tab,
  ReportList,
  ReportItem,
  ReportHeader,
  ReportInfo,
  ReportTitle,
  ReportMeta,
  ReportMetaItem,
  ReportStatus,
  StatusBadge,
  ReportContent,
  ReportReason,
  ReportedContent,
  ReportActions,
  ActionButton,
  Pagination,
  PaginationInfo,
  PaginationButtons,
  PaginationButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  LoadingOverlay,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
} from './Page_AdminReports.styles';
import {
  Flag,
  User,
  Calendar,
  Check,
  X,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldAlert,
  MessageSquare,
  FileText,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Alert } from '../../../../components/ui/primitives';
import styled from 'styled-components';

const AlertTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: inherit;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: transparent;
  color: currentColor;
  border: 1px solid currentColor;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const Page_AdminReports = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postReports, setPostReports] = useState([]);
  const [commentReports, setCommentReports] = useState([]);

  const samplePostReports = useMemo(
    () => [
      {
        id: 1,
        title: 'Inappropriate content in AI article',
        reportedBy: 'John Doe',
        reportedDate: 'Apr 5, 2025',
        status: 'pending',
        reason:
          'This post contains misleading information about AI technology that could be harmful.',
        content:
          'The future of AI is not about replacing humans, but rather augmenting human capabilities to solve complex problems that were previously unsolvable...',
        postId: 101,
        postTitle: 'The Dark Side of Artificial Intelligence',
      },
      {
        id: 2,
        title: 'Plagiarized content',
        reportedBy: 'Jane Smith',
        reportedDate: 'Apr 4, 2025',
        status: 'reviewing',
        reason:
          'This article appears to be copied from another website without proper attribution.',
        content:
          'React has become the most popular frontend framework for building modern web applications. Its component-based architecture allows developers to create reusable UI elements...',
        postId: 102,
        postTitle: 'React Best Practices for 2025',
      },
      {
        id: 3,
        title: 'Offensive language',
        reportedBy: 'Michael Johnson',
        reportedDate: 'Apr 3, 2025',
        status: 'resolved',
        reason: 'The post contains offensive language that violates community guidelines.',
        content:
          "The debate around programming languages can get heated, but it's important to remember that each language has its strengths and weaknesses...",
        postId: 103,
        postTitle: 'Why Python is Better Than JavaScript',
      },
      {
        id: 4,
        title: 'Spam content',
        reportedBy: 'Sarah Williams',
        reportedDate: 'Apr 2, 2025',
        status: 'rejected',
        reason: 'This post appears to be promotional content disguised as an article.',
        content:
          'Looking for the best web hosting service? Look no further than HostPro! Our blazing fast servers and 24/7 customer support make us the top choice for developers...',
        postId: 104,
        postTitle: 'Top 10 Web Hosting Services',
      },
    ],
    [],
  );

  const sampleCommentReports = useMemo(
    () => [
      {
        id: 1,
        title: 'Harassment in comment',
        reportedBy: 'David Brown',
        reportedDate: 'Apr 5, 2025',
        status: 'pending',
        reason: 'This comment is targeting another user with personal attacks.',
        content:
          "You clearly don't understand how programming works. Maybe you should stick to something simpler.",
        postId: 101,
        postTitle: 'The Dark Side of Artificial Intelligence',
        commentId: 201,
      },
      {
        id: 2,
        title: 'Spam comment',
        reportedBy: 'Emily Davis',
        reportedDate: 'Apr 4, 2025',
        status: 'reviewing',
        reason: 'This comment is promoting an unrelated product.',
        content:
          'Great article! By the way, check out my new e-book on making money online at www.example.com',
        postId: 102,
        postTitle: 'React Best Practices for 2025',
        commentId: 202,
      },
      {
        id: 3,
        title: 'Offensive language in comment',
        reportedBy: 'Robert Wilson',
        reportedDate: 'Apr 3, 2025',
        status: 'resolved',
        reason: 'This comment contains offensive language.',
        content: 'This article is [offensive content removed]',
        postId: 103,
        postTitle: 'Why Python is Better Than JavaScript',
        commentId: 203,
      },
    ],
    [],
  );

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setPostReports(samplePostReports);
        setCommentReports(sampleCommentReports);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to load reports. Please try again.');
        console.error('Error fetching reports:', err);
      }
    };

    fetchReports();
  }, [samplePostReports, sampleCommentReports]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setPostReports(samplePostReports);
      setCommentReports(sampleCommentReports);
      setLoading(false);
    }, 1000);
  };

  const getFilteredReports = () => {
    const reports = activeTab === 'posts' ? postReports : commentReports;
    if (statusFilter === 'all') return reports;
    return reports.filter((report) => report.status === statusFilter);
  };

  const filteredReports = getFilteredReports();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleReviewReport = async (id) => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(`Reviewing report ${id}`);

      if (activeTab === 'posts') {
        setPostReports((prevReports) =>
          prevReports.map((report) =>
            report.id === id ? { ...report, status: 'reviewing' } : report,
          ),
        );
      } else {
        setCommentReports((prevReports) =>
          prevReports.map((report) =>
            report.id === id ? { ...report, status: 'reviewing' } : report,
          ),
        );
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(`Failed to review report ${id}. Please try again.`);
      console.error('Error reviewing report:', err);
    }
  };

  const handleApproveReport = async (id) => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(`Approving report ${id}`);

      if (activeTab === 'posts') {
        setPostReports((prevReports) =>
          prevReports.map((report) =>
            report.id === id ? { ...report, status: 'resolved' } : report,
          ),
        );
      } else {
        setCommentReports((prevReports) =>
          prevReports.map((report) =>
            report.id === id ? { ...report, status: 'resolved' } : report,
          ),
        );
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(`Failed to approve report ${id}. Please try again.`);
      console.error('Error approving report:', err);
    }
  };

  const handleRejectReport = async (id) => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(`Rejecting report ${id}`);

      if (activeTab === 'posts') {
        setPostReports((prevReports) =>
          prevReports.map((report) =>
            report.id === id ? { ...report, status: 'rejected' } : report,
          ),
        );
      } else {
        setCommentReports((prevReports) =>
          prevReports.map((report) =>
            report.id === id ? { ...report, status: 'rejected' } : report,
          ),
        );
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(`Failed to reject report ${id}. Please try again.`);
      console.error('Error rejecting report:', err);
    }
  };

  const handleDeleteContent = async (id) => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(`Deleting content for report ${id}`);

      if (activeTab === 'posts') {
        setPostReports((prevReports) =>
          prevReports.map((report) =>
            report.id === id ? { ...report, status: 'resolved' } : report,
          ),
        );
      } else {
        setCommentReports((prevReports) =>
          prevReports.map((report) =>
            report.id === id ? { ...report, status: 'resolved' } : report,
          ),
        );
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(`Failed to delete content for report ${id}. Please try again.`);
      console.error('Error deleting content:', err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'reviewing':
        return 'reviewing';
      case 'resolved':
        return 'resolved';
      case 'rejected':
        return 'rejected';
      default:
        return '';
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <ErrorContainer>
          <Alert $variant="error">
            <Alert.Icon>
              <AlertCircle size={24} />
            </Alert.Icon>
            <Alert.Content>
              <AlertTitle>Error Loading Reports</AlertTitle>
              <div>{error}</div>
              <RetryButton onClick={handleRetry}>
                <RefreshCw size={16} />
                Retry
              </RetryButton>
            </Alert.Content>
          </Alert>
        </ErrorContainer>
      );
    }

    return (
      <>
        <TabsContainer>
          <Tab
            className={activeTab === 'posts' ? 'active' : ''}
            onClick={() => handleTabChange('posts')}
          >
            <FileText size={16} style={{ marginRight: '0.5rem' }} />
            Post Reports
          </Tab>
          <Tab
            className={activeTab === 'comments' ? 'active' : ''}
            onClick={() => handleTabChange('comments')}
          >
            <MessageSquare size={16} style={{ marginRight: '0.5rem' }} />
            Comment Reports
          </Tab>
        </TabsContainer>

        <ReportList>
          {loading && (
            <LoadingOverlay>
              <LoadingSpinner />
              <LoadingText>Loading reports...</LoadingText>
            </LoadingOverlay>
          )}

          {!loading && filteredReports.length > 0
            ? filteredReports.map((report) => (
                <ReportItem key={report.id}>
                  <ReportHeader>
                    <ReportInfo>
                      <ReportTitle>{report.title}</ReportTitle>
                      <ReportMeta>
                        <ReportMetaItem>
                          <User size={14} />
                          Reported by {report.reportedBy}
                        </ReportMetaItem>
                        <ReportMetaItem>
                          <Calendar size={14} />
                          {report.reportedDate}
                        </ReportMetaItem>
                        <ReportMetaItem>
                          <Flag size={14} />
                          {activeTab === 'posts' ? 'Post' : 'Comment'} #
                          {activeTab === 'posts' ? report.postId : report.commentId}
                        </ReportMetaItem>
                      </ReportMeta>
                    </ReportInfo>
                    <ReportStatus>
                      <StatusBadge className={getStatusBadgeClass(report.status)}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </StatusBadge>
                    </ReportStatus>
                  </ReportHeader>

                  <ReportContent>
                    <ReportReason>
                      <strong>Reason:</strong> {report.reason}
                    </ReportReason>
                    <ReportedContent>{report.content}</ReportedContent>
                  </ReportContent>

                  <ReportActions>
                    {report.status === 'pending' && (
                      <ActionButton
                        className="primary"
                        onClick={() => handleReviewReport(report.id)}
                        disabled={loading}
                      >
                        <Eye size={14} />
                        Review
                      </ActionButton>
                    )}

                    {(report.status === 'pending' || report.status === 'reviewing') && (
                      <>
                        <ActionButton
                          className="success"
                          onClick={() => handleApproveReport(report.id)}
                          disabled={loading}
                        >
                          <Check size={14} />
                          Approve
                        </ActionButton>

                        <ActionButton
                          className="secondary"
                          onClick={() => handleRejectReport(report.id)}
                          disabled={loading}
                        >
                          <X size={14} />
                          Reject
                        </ActionButton>

                        <ActionButton
                          className="danger"
                          onClick={() => handleDeleteContent(report.id)}
                          disabled={loading}
                        >
                          <Trash2 size={14} />
                          Delete Content
                        </ActionButton>
                      </>
                    )}

                    {(report.status === 'resolved' || report.status === 'rejected') && (
                      <ActionButton className="secondary" disabled={loading}>
                        <Eye size={14} />
                        View Details
                      </ActionButton>
                    )}
                  </ReportActions>
                </ReportItem>
              ))
            : !loading && (
                <EmptyState>
                  <EmptyStateIcon>
                    <ShieldAlert size={24} />
                  </EmptyStateIcon>
                  <EmptyStateTitle>No reports found</EmptyStateTitle>
                  <EmptyStateText>
                    There are no {activeTab} reports matching your filter criteria.
                  </EmptyStateText>
                </EmptyState>
              )}
        </ReportList>

        {!loading && filteredReports.length > 0 && (
          <Pagination>
            <PaginationInfo>Showing {filteredReports.length} reports</PaginationInfo>
            <PaginationButtons>
              <PaginationButton disabled={currentPage === 1 || loading}>
                <ChevronsLeft size={16} />
              </PaginationButton>
              <PaginationButton disabled={currentPage === 1 || loading}>
                <ChevronLeft size={16} />
              </PaginationButton>
              <PaginationButton className="active">{currentPage}</PaginationButton>
              <PaginationButton disabled={true || loading}>
                <ChevronRight size={16} />
              </PaginationButton>
              <PaginationButton disabled={true || loading}>
                <ChevronsRight size={16} />
              </PaginationButton>
            </PaginationButtons>
          </Pagination>
        )}
      </>
    );
  };

  return (
    <Container>
      <PageHeader>
        <Title>Reports & Moderation</Title>
        <HeaderActions>
          <FilterContainer>
            <FilterSelect
              value={statusFilter}
              onChange={handleStatusFilterChange}
              disabled={loading}
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </FilterSelect>
          </FilterContainer>
        </HeaderActions>
      </PageHeader>

      <CardContainer>{renderContent()}</CardContainer>
    </Container>
  );
};

export default Page_AdminReports;
