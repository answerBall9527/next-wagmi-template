'use client'

import { FC } from 'react'

const DashboardPage: FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Pebbles</h1>
        <div className="flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-sm font-semibold text-gray-600">@Charles</div>
        </div>
      </div>

      {/* Main Section */}
      <div className="p-4 flex-1 bg-gray-50">
        {/* Card */}
        <div className="bg-purple-500 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div className="text-sm">Balance</div>
            <div className="bg-purple-700 px-2 py-1 rounded-full text-xs flex items-center">
              <span>24H: </span>
              <span className="ml-1 text-green-300">+0.34</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mt-2">566.99 ETH</h2>
          <p className="text-lg">$58848.99</p>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <span className="block text-sm">10.73%</span>
              <span className="text-xs">APY</span>
            </div>
            <div>
              <span className="block text-sm">More Rewards with</span>
              <div className="flex space-x-2 mt-1">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="bg-purple-500 text-white py-2 rounded-lg shadow-lg font-semibold">
            Deposit
          </button>
          <button className="bg-white text-purple-500 border border-purple-500 py-2 rounded-lg shadow-lg font-semibold">
            Withdraw
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white shadow-lg py-4 flex justify-around items-center">
        <div className="flex flex-col items-center">
          <span className="w-6 h-6 bg-purple-500 rounded-full"></span>
          <span className="text-xs mt-1 text-purple-500 font-semibold">Home</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="w-6 h-6 bg-gray-400 rounded-full"></span>
          <span className="text-xs mt-1 text-gray-500">Activity</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="w-6 h-6 bg-gray-400 rounded-full"></span>
          <span className="text-xs mt-1 text-gray-500">Rewards</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="w-6 h-6 bg-gray-400 rounded-full"></span>
          <span className="text-xs mt-1 text-gray-500">Me</span>
        </div>
      </div>
    </div>
  )
}


export default DashboardPage
  