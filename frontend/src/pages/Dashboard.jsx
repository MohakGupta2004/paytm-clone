import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Redirect to login if token is not present
    if (!token) {
      navigate('/signup'); // Redirect to login page
    }
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const result = await axios.get("http://localhost:5000/api/v1/user/bulk", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(result.data.user);
    };
    fetchUser();
  }, []);
  useEffect(()=>{
    const fetchAPI = async ()=>{
      const token = localStorage.getItem('token')
      const result = await axios.get('http://localhost:5000/api/v1/account/balance',{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
      setBalance(result.data.balance)
    }
    fetchAPI()
  },[])
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Payments App
        </h1>
        <div className="flex items-center space-x-4">
          <p className="text-gray-600 dark:text-gray-400">Hello, User</p>
          <img
            src="https://via.placeholder.com/40"
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
          />
        </div>
      </nav>

      {/* Main content */}
      <main className="p-8">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
          Your balance:{" "}
          <span className="text-green-500">
            ${balance}
          </span>
        </h2>

        {/* Users list */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
            Users
          </h3>
          <input
            type="text"
            placeholder="Search users"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ul className="space-y-4">
          {filteredUsers.map((user, index) => {
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center"
              >
                <li className="text-gray-800 dark:text-white">
                  {user.username}
                </li>
                <button
                  onClick={(e) => {
                    navigate(`/send?id=${user.id}&name=${user.firstName}`);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Send Money
                </button>
              </div>
            );
          })}
        </ul>
      </main>
    </div>
  );
};

export default Dashboard;
