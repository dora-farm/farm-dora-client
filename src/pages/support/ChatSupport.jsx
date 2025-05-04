import React, { useState } from 'react';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function ChatSupport() {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // FAQ 데이터
  const faqData = [
    {
      id: 1,
      question: '배송은 얼마나 걸리나요?',
      answer: '일반 배송은 결제 완료 후 1-3일 내에 이루어집니다. 산간 지역이나 도서 지역은 1-2일 추가될 수 있습니다. 당일 배송 상품은 오전 11시 이전 주문 시 당일 발송됩니다.'
    },
    {
      id: 2,
      question: '주문 취소는 어떻게 하나요?',
      answer: '배송 준비 전 상태에서는 마이페이지의 주문 내역에서 직접 취소가 가능합니다. 배송 준비 중이거나 배송 중인 상품은 고객센터로 문의 부탁드립니다.'
    },
    {
      id: 3,
      question: '교환/반품 절차는 어떻게 되나요?',
      answer: '상품 수령 후 7일 이내에 마이페이지 주문 내역에서 교환/반품 신청이 가능합니다. 상품 불량이나 오배송의 경우 배송비는 판매자가 부담합니다. 단순 변심의 경우 왕복 배송비는 고객 부담입니다.'
    },
    {
      id: 4,
      question: '회원 정보 수정은 어디서 하나요?',
      answer: '로그인 후 마이페이지 > 회원정보 수정에서 가능합니다. 아이디는 변경이 불가능하니 가입 시 신중하게 선택해 주세요.'
    },
    {
      id: 5,
      question: '적립금은 언제 사용할 수 있나요?',
      answer: '적립금은 구매 확정 후 다음 날부터 사용 가능합니다. 유효기간은 적립일로부터 1년이며, 1,000원 이상부터 사용 가능합니다.'
    }
  ];

  // 공지사항 데이터
  const noticeData = [
    {
      id: 1,
      date: '2025-04-28',
      title: '5월 연휴 배송 안내',
      content: '5월 1일부터 5일까지 연휴로 인해 배송이 지연될 수 있습니다. 양해 부탁드립니다.'
    },
    {
      id: 2,
      date: '2025-04-15',
      title: '시스템 점검 안내',
      content: '4월 20일 새벽 2시부터 4시까지 시스템 점검이 예정되어 있습니다. 해당 시간에는 서비스 이용이 제한될 수 있습니다.'
    },
    {
      id: 3,
      date: '2025-04-01',
      title: '신규 회원 혜택 안내',
      content: '신규 회원 가입 시 3,000원 적립금과 첫 구매 10% 할인 쿠폰을 드립니다. (5월 31일까지)'
    }
  ];

  const handleFaqClick = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 문의 제출 로직 추가
    alert('문의가 성공적으로 제출되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">고객센터</h1>

      {/* 탭 메뉴 */}
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 ${activeTab === 'faq' ? 'border-b-2 border-green font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('faq')}
        >
          자주 묻는 질문
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'contact' ? 'border-b-2 border-green font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('contact')}
        >
          문의하기
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'notice' ? 'border-b-2 border-green font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('notice')}
        >
          공지사항
        </button>
      </div>

      {/* FAQ 섹션 */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">자주 묻는 질문 (FAQ)</h2>
          {faqData.map((faq) => (
            <div key={faq.id} className="border rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                onClick={() => handleFaqClick(faq.id)}
              >
                <span className="font-medium">{faq.question}</span>
                {expandedFaq === faq.id ? 
                  <ExpandLessIcon fontSize="small" /> : 
                  <ExpandMoreIcon fontSize="small" />
                }
              </button>
              {expandedFaq === faq.id && (
                <div className="px-6 py-4 bg-white">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 문의하기 섹션 */}
      {activeTab === 'contact' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">문의하기</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="bg-green text-white p-3 rounded-full mr-4">
                  <PhoneIcon />
                </div>
                <div>
                  <h3 className="font-medium">전화 문의</h3>
                  <p>1588-1234</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-green text-white p-3 rounded-full mr-4">
                  <EmailIcon />
                </div>
                <div>
                  <h3 className="font-medium">이메일 문의</h3>
                  <p>support@farmdora.com</p>
                </div>
              </div>
              <p className="mt-4">고객센터 운영시간: 평일 09:00 - 18:00 (주말 및 공휴일 휴무)</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">이름</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">이메일</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block mb-1 font-medium">제목</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 font-medium">문의 내용</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                문의 제출
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 공지사항 섹션 */}
      {activeTab === 'notice' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">공지사항</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {noticeData.map((notice) => (
                  <tr key={notice.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{notice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notice.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{notice.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatSupport;