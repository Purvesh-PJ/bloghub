import { useState, useEffect } from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { FaList } from 'react-icons/fa';

const TOCContainer = styled.div`
  font-size: 0.875rem;
  
  .no-headings {
    color: #94a3b8;
    font-style: italic;
    padding: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const TOCList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TOCItem = styled.li`
  margin-bottom: 8px;
  padding-left: ${props => props.level * 12}px;
  
  a {
    display: block;
    text-decoration: none;
    color: #475569;
    padding: 6px 10px;
    border-radius: 4px;
    transition: all 0.2s;
    border-left: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
    background-color: ${props => props.active ? '#f0f9ff' : 'transparent'};
    
    &:hover {
      background-color: #f1f5f9;
      color: #3b82f6;
    }
  }
`;

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  // This function processes the content and adds IDs to headings if they don't have them
  const addIdsToHeadings = () => {
    if (!content) return;
    
    // Wait for the content to be rendered to the DOM
    setTimeout(() => {
      // Find all heading elements in the post content
      const article = document.querySelector('.Content');
      if (!article) return;
      
      const headingElements = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      // Extract all headings and generate IDs if needed
      const extractedHeadings = Array.from(headingElements).map((heading, index) => {
        // Generate a unique ID if the heading doesn't have one
        if (!heading.id) {
          const headingId = `heading-${index}`;
          heading.id = headingId;
        }
        
        return {
          id: heading.id,
          text: heading.textContent,
          level: parseInt(heading.tagName.substring(1)) // Get the heading level (1-6)
        };
      });
      
      setHeadings(extractedHeadings);
      
      // Set up intersection observer after IDs are added
      setupIntersectionObserver(extractedHeadings);
    }, 500); // Give time for content to render
  };
  
  // Set up intersection observer to highlight active section
  const setupIntersectionObserver = (headingsArray) => {
    if (headingsArray.length === 0) return;
    
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );
    
    // Observe all headings
    headingsArray.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });
    
    return () => {
      headingsArray.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  };
  
  useEffect(() => {
    addIdsToHeadings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);
  
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Scroll to the heading with some offset from the top
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <TOCContainer>
      {headings.length > 0 ? (
        <TOCList>
          {headings.map((heading) => (
            <TOCItem 
              key={heading.id} 
              level={heading.level - 1}
              active={heading.id === activeId}
            >
              <a 
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(heading.id);
                }}
              >
                {heading.text}
              </a>
            </TOCItem>
          ))}
        </TOCList>
      ) : (
        <div className="no-headings">
          <FaList />
          <span>No headings found in this article</span>
        </div>
      )}
    </TOCContainer>
  );
};

export default TableOfContents; 