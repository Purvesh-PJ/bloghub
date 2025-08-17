const columns = [
  { 
    Header: 'ID', 
    accessor: 'id',
    // Cell : ({ value }) => <FixedHeaderSizeId>{value}</FixedHeaderSizeId>,// Add width property to give specific width
  },
  { 
    Header: 'Title', 
    accessor: 'title',
    //Cell : ({ value }) => <FixedHeaderSizeTitle>{value}</FixedHeaderSizeTitle>,// Add width property to give specific width
  },
  { 
    Header: 'Author', 
    accessor: 'author',
    //Cell : ({ value }) => <FixedHeaderSizeAuthor>{value}</FixedHeaderSizeAuthor>,// Add width property to give specific width
  },
  
  { 
    Header: 'Status', 
    accessor: 'status',
    //Cell : ({ value }) => <FixedHeaderSizeStatus>{value}</FixedHeaderSizeStatus>,// Add width property to give specific width
  },

  { 
    Header: 'Role', 
    accessor: 'role',
    //Cell : ({ value }) => <FixedHeaderSizeRole>{value}</FixedHeaderSizeRole>,// Add width property to give specific width
  },
];

const data = [
  {
    id: 1,
    title: 'The Future of Artificial Intelligence Trends and Innovations',
    author: 'GeekyQuantum',
    status: 'Public',
    role: 'Admin',
  },
  {
    id: 2,
    title: 'Blockchain Technology Revolutionizing Industries Beyond Cryptocurrency',
    author: 'Quantominia',
    status: 'Public',
    role: 'User',
  },
  {
    id: 3,
    title: 'Cybersecurity in the Age of IoT Protecting Your Connected World',
    author: 'WorldExplores',
    status: 'Private',
    role: 'User',
  },
  {
    id: 4,
    title: '5G Technology: Unleashing the Potential of Ultra-Fast Connectivity',
    author: 'OutsidersTech',
    status: 'Private',
    role: 'User',
  },
  {
    id: 5,
    title: 'The Impact of Quantum Computing A Paradigm Shift in Computing Power',
    author: 'TechNewsQuantum',
    status: 'Public',
    role: 'User',
  },
  {
    id: 6,
    title: 'The Future of Artificial Intelligence Trends and Innovations',
    author: 'GeekyQuantum',
    status: 'Public',
    role: 'Admin',
  },
  {
    id: 7,
    title: 'Blockchain Technology Revolutionizing Industries Beyond Cryptocurrency',
    author: 'Quantominia',
    status: 'Public',
    role: 'User',
  },
  {
    id: 8,
    title: 'Cybersecurity in the Age of IoT Protecting Your Connected World',
    author: 'WorldExplores',
    status: 'Private',
    role: 'User',
  },
  {
    id: 9,
    title: '5G Technology: Unleashing the Potential of Ultra-Fast Connectivity',
    author: 'OutsidersTech',
    status: 'Private',
    role: 'User',
  },
  {
    id: 10,
    title: 'The Impact of Quantum Computing A Paradigm Shift in Computing Power',
    author: 'TechNewsQuantum',
    status: 'Public',
    role: 'User',
  },
];

export { data , columns };

