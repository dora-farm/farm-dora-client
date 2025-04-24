import React from 'react'

function AlertModal({ message, onClose }) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
          <h2 className="text-red-600 text-lg font-semibold mb-3">⚠️ 알림</h2>
          <p className="text-gray-800">{message}</p>
          <button
            onClick={onClose}
            className="mt-5 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

export default AlertModal
