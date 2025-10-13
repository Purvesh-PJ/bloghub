import React from 'react';
import styled from 'styled-components';
// import { LuSettings2 } from 'react-icons/lu';

const Image = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
`;

const columns = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Profile Image',
    accessor: 'profileImage',
  },
  {
    Header: 'User Name',
    accessor: 'userName',
  },
  {
    Header: 'User Email',
    accessor: 'userEmail',
  },
  {
    Header: 'Registration Date',
    accessor: 'registrationDate',
  },
  {
    Header: 'User Role',
    accessor: 'userRole',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
];

const data = [
  {
    id: 1,
    profileImage: (
      <Image
        src={
          'https://images.unsplash.com/photo-1526779259212-939e64788e3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
        }
        alt="user"
      />
    ),
    userName: 'john_doe',
    userEmail: 'john@example.com',
    registrationDate: '2023-01-15',
    userRole: 'Member',
    status: 'Active',
  },
  {
    id: 2,
    profileImage: (
      <Image
        src={
          'https://images.unsplash.com/photo-1530076886461-ce58ea8abe24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
        }
        alt="user"
      />
    ),
    userName: 'jane_smith',
    userEmail: 'jane@example.com',
    registrationDate: '2023-02-20',
    userRole: 'Administrator',
    status: 'Active',
  },
  {
    id: 3,
    profileImage: (
      <Image
        src={
          'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
        }
        alt="user"
      />
    ),
    userName: 'user123',
    userEmail: 'user123@example.com',
    registrationDate: '2023-03-10',
    userRole: 'Member',
    status: 'Inactive',
  },
  {
    id: 4,
    profileImage: (
      <Image
        src={
          'https://images.unsplash.com/photo-1570051008600-b34baa49e751?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        }
        alt="user"
      />
    ),
    userName: 'jennifer34',
    userEmail: 'jennifer@example.com',
    registrationDate: '2023-04-05',
    userRole: 'Member',
    status: 'Active',
  },
  {
    id: 5,
    profileImage: (
      <Image
        src={
          'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
        }
        alt="user"
      />
    ),
    userName: 'admin007',
    userEmail: 'admin@example.com',
    registrationDate: '2023-05-12',
    userRole: 'Administrator',
    status: 'Active',
  },
  {
    id: 6,
    profileImage: (
      <Image
        src={
          'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        }
        alt="user"
      />
    ),
    userName: 'testuser',
    userEmail: 'test@example.com',
    registrationDate: '2023-06-08',
    userRole: 'Member',
    status: 'Active',
  },

  {
    id: 7,
    profileImage: (
      <Image
        src={
          'https://images.unsplash.com/photo-1502236876560-243e78f715f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        }
        alt="user"
      />
    ),
    userName: 'jackson22',
    userEmail: 'jackson@example.com',
    registrationDate: '2023-07-17',
    userRole: 'Member',
    status: 'Active',
  },

  {
    id: 8,
    profileImage: (
      <Image
        src={
          'https://images.unsplash.com/photo-1583364493238-248032147fbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        }
        alt="user"
      />
    ),
    userName: 'susan_89',
    userEmail: 'susan@example.com',
    registrationDate: '2023-08-25',
    userRole: 'Administrator',
    status: 'Active',
  },
  {
    id: 9,
    profileImage: (
      <Image
        src={
          'https://images.unsplash.com/photo-1574774191469-3d7732e5fc8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        }
        alt="user"
      />
    ),
    userName: 'peter_m',
    userEmail: 'peter@example.com',
    registrationDate: '2023-09-01',
    userRole: 'Member',
    status: 'Active',
  },
  {
    id: 10,
    profileImage: (
      <Image
        src={
          'https://images.unsplash.com/photo-1591280063444-d3c514eb6e13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        }
        alt="user"
      />
    ),
    userName: 'alice34',
    userEmail: 'alice@example.com',
    registrationDate: '2023-10-03',
    userRole: 'Member',
    status: 'Inactive',
  },
];

export { data, columns };
