"use client";

import api from "@/api";
import Title from "@/components/Title";
import { ShopContext } from "@/context/ShopContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const { currency } = useContext(ShopContext);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [totalTransactions,setTotalTransactions] = useState(0)
  const [isChangeWallet,setIsChangeWallet] = useState(false)

  const handleAddMoney = async() => {
    console.log(amount);
    
    try {
      const res = await api.post('/add_money_to_wallet/',{amount:amount})
      console.log(res.data);
      setIsChangeWallet(!isChangeWallet)
      
    } catch (error) {
      
    }
  };

  useEffect(() => {
    const getWalletData = async () => {
      try {
        const res = await api.get("/get_wallet_data/");
        setWalletBalance(res.data.balance);
        setWalletTransactions(res.data.transactions_data);
        setTotalTransactions(res.data.total_transactions);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getWalletData();
  }, [isChangeWallet]);

  return (
    <>
    <div className="text-3xl">
    <Title text1={'WALLET'} text2={'DETAILS'}/>
    </div>
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Available Balance */}
      <div className="bg-gray-800 text-white p-6 rounded-lg mb-6">
        <h2 className="text-xl text-center font-medium mb-2">
          Available Balance
        </h2>
        <p className="text-3xl text-center font-bold">
          {currency} {walletBalance}
        </p>
      </div>

      {/* Add Money Section */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="number"
          placeholder="Enter amount to add"
          className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="bg-gray-800 text-white px-4 py-3 rounded-md hover:bg-gray-700 transition-colors"
          onClick={handleAddMoney}
        >
          Add Money
        </button>
      </div>

      {/* Transaction History Button */}
      <div className="mb-6">
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
          Transaction History
        </button>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-3">
          {walletTransactions?.map((item) => {
            return (
              <div className="text-gray-600" key={item.id}>
                {item.created_at} - {item.transaction_type === 'credit'?'Deposit':'Purchase'}:{" "}
                <span className="font-medium text-gray-800">{currency} {item.amount}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};

export default Wallet;
