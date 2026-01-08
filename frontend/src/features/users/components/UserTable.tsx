// // src/features/users/components/UserTable.tsx
// import { useUsers, useDeleteUser } from '../hooks';
// import { useState } from 'react';
// import UserModal from './UserModal';

// const UserTable = () => {
//   const { data: users, isLoading } = useUsers();
//   const deleteUser = useDeleteUser();
//   const [selectedUser, setSelectedUser] = useState(null);

//   if (isLoading) return <p>Loading users...</p>;

//   return (
//     <div>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.name}</td>
//               <td>{user.email}</td>
//               <td>
//                 <button onClick={() => setSelectedUser(user)}>Edit</button>
//                 <button onClick={() => deleteUser.mutate(user.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
//     </div>
//   );
// };

// export default UserTable;