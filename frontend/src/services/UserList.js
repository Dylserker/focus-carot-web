import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../services/api';

function UsersList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            const data = await fetchUsers();
            setUsers(data.users);
        };
        loadUsers();
    }, []);

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}

export default UsersList;