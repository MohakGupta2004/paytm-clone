import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Send = () => {
  const [searchParams] = useSearchParams();
  const nameParam = searchParams.get('name');
  const transferId = searchParams.get('id');
  const [transferUser, setTransferUser] = useState(nameParam);
  const [transferSuccessful, setTransferSuccessful] = useState('');
  const [amount, setAmount] = useState(0);

  const handleClick = async () => {
    const token = localStorage.getItem('token');
    const body = {
      amount: amount,
      transferTo: transferId,
    };
    const result = await axios.post('http://localhost:5000/api/v1/account/transfer', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTransferSuccessful(result.data.message);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 max-w-md w-full">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Send Money
        </h1>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <img
            src="https://via.placeholder.com/100"
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
          />
        </div>

        {/* Transfer User */}
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center mb-6">
          Sending to: <span className="text-blue-500">{transferUser}</span>
        </h2>

        {/* Amount Input */}
        <div className="mb-6">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
          >
            Enter Amount
          </label>
          <input
            type="text"
            id="amount"
            placeholder="Enter amount"
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleClick}
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
        >
          Initiate Transfer
        </button>

        {/* Success Message */}
        {transferSuccessful && (
          <p className="text-green-500 font-medium text-center mt-4">
            {transferSuccessful}
          </p>
        )}
      </div>
    </div>
  );
};

export default Send;
