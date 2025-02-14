// src/features/users/components/UserModal.tsx
import { useCreateUser, useUpdateUser } from '../hooks';

const UserModal = ({ user, onClose }) => {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    if (user) updateUser.mutate({ id: user.id, user: userData });
    else createUser.mutate(userData);
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input name="name" defaultValue={user?.name} required />
        <input name="email" type="email" defaultValue={user?.email} required />
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default UserModal;