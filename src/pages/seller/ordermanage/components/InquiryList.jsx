import React from 'react'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const InquiryList = ({loading = false, error = null, questions = [],}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">데이터를 불러오는 중입니다...</div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">오류가 발생했습니다: {error}</div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">주문 내역이 없습니다.</div>
      </div>
    );
  }
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatProcess = (process) => {
    if (process) {
      return <CheckIcon color="success" fontSize="small" />;
    } return <CloseIcon color="warning" fontSize="small" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-b border-gray-300 select-none">
        <thead className="bg-brown text-white">
          <tr>
            <th className="border px-4 py-2 min-w-[80px] text-center">문의번호</th>
            <th className="border px-4 py-2 min-w-[200px] text-center">상품명</th>
            <th className="border px-4 py-2 min-w-[240px] text-center">문의명</th>
            <th className="border px-4 py-2 min-w-[70px] text-center">작성자</th>
            <th className="border px-4 py-2 min-w-[100px] text-center">작성시간</th>
            <th className="border px-4 py-2 min-w-[58px] text-center">답변</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr 
              key={question.questionId} 
              className="hover:bg-gray-100 transition-colors cursor-default"
            >
              <td className="border-b border-gray-300 px-5 py-4 text-center text-sm font-medium">
                {question.questionId}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm">
              {question.saleTitle}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm">
              {question.questionTitle}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm">
              {question.userName}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm font-medium">
              {formatDate(question.createdDate)}
              </td>
              <td className={"border-b border-gray-300 px-4 py-4 text-center text-sm font-medium"}>
              {formatProcess(question.process)}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm font-medium">
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InquiryList;