import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../common/components/Pagination';
import Loading from '../../common/components/Loading';
import BasicBtn from '../../common/components/search/BasicBtn';

const AdminPopup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [popupList, setPopupList] = useState([]);
  
  // 페이지네이션 상태
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
    pageSize: 10
  });
  
  // 검색 조건 상태 관리
  const [searchParams, setSearchParams] = useState({
    startDate: '',
    endDate: '',
    sortType: '' // typeId 대신 sortType 사용
  });
  
  // 페이지 로드 시 이벤트/배너 목록 조회
  useEffect(() => {
    fetchPopupList();
  }, [pagination.currentPage]);
  
  // 이벤트/배너 목록 조회 함수
  const fetchPopupList = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: pagination.currentPage
      };
      
      // sortType 파라미터 추가 (EVENT 또는 BANNER)
      if (searchParams.sortType) {
        params.sortType = searchParams.sortType;
      }
      
      if (searchParams.startDate) {
        params.startDate = `${searchParams.startDate}T00:00:00`;
      }
      
      if (searchParams.endDate) {
        params.endDate = `${searchParams.endDate}T23:59:59`;
      }
      
      const response = await axios.get('http://localhost:8080/api/popup', { params });
      
      if (response.data && response.data.data) {
        const pageData = response.data.data;
        setPopupList(pageData.contents || []);
        
        setPagination({
          currentPage: pageData.currentPage || 0,
          totalElements: pageData.totalElements || 0,
          totalPages: pageData.totalPages || 0,
          hasNext: pageData.hasNext || false,
          hasPrev: pageData.hasPrevious || false,
          pageSize: pageData.pageSize || 10
        });
      } else {
        console.error('이벤트/배너 목록 데이터 형식이 예상과 다릅니다:', response.data);
        setPopupList([]);
      }
    } catch (error) {
      console.error('이벤트/배너 목록을 불러오는 중 오류가 발생했습니다:', error);
      setPopupList([]);
    } finally {
      setLoading(false);
    }
  };
  
  // 입력 필드 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };
  
  // 검색 버튼 클릭 처리
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setPagination(prevState => ({
      ...prevState,
      currentPage: 0
    }));
    fetchPopupList();
  };
  
  // 초기화 버튼 클릭 처리
  const handleReset = () => {
    setSearchParams({
      sortType: '',
      startDate: '',
      endDate: ''
    });
    
    // 초기 페이지로 리셋 후 데이터 다시 로드
    setPagination(prevState => ({
      ...prevState,
      currentPage: 0
    }));
    
    // 다음 렌더링 사이클에서 fetchPopupList가 자동으로 호출됨
  };
  
  // 등록 버튼 클릭 처리
  const handleAddPopup = () => {
    navigate('/admin/popup/register');
  };
  
  // 이벤트 상세 페이지 이동
  const handlePopupDetail = (id) => {
    navigate(`/admin/popup/${id}`);
  };
  
  // 페이지 변경 처리
  const handlePageChange = (page) => {
    setPagination(prevState => ({
      ...prevState,
      currentPage: page
    }));
  };
  
  // 로딩 상태 렌더링
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6 pb-2 border-b">이벤트/배너 관리</h1>
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">타입</label>
            <select
              name="sortType"
              value={searchParams.sortType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green focus:border-green"
            >
              <option value="">전체</option>
              <option value="EVENT">이벤트</option>
              <option value="BANNER">배너</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">조회 기간</label>
            <div className="flex items-center">
              <input
                type="date"
                name="startDate"
                value={searchParams.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green focus:border-green"
              />
              <span className="mx-2">-</span>
              <input
                type="date"
                name="endDate"
                value={searchParams.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green focus:border-green"
              />
            </div>
          </div>
        </div>
        <BasicBtn 
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      </div>
      
      {/* 이벤트/배너 목록 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            이벤트/배너 목록 (총 <span className="text-green">{pagination.totalElements}</span>개)
          </div>
          <button
            onClick={handleAddPopup}
            className="px-4 py-2 bg-green text-white rounded-md hover:bg-green-dark transition-colors focus:outline-none"
          >
            등록하기
          </button>
        </div>
        
        {/* 이벤트/배너 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-center border-b">제목</th>
                <th className="py-3 px-4 text-center border-b">기간</th>
                <th className="py-3 px-4 text-center border-b">타입</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {popupList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-10 text-center text-gray-500">
                    등록된 이벤트/배너가 없습니다.
                  </td>
                </tr>
              ) : (
                popupList.map((popup) => {
                  const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    return date.toLocaleDateString('ko-KR');
                  };
                  
                  const period = `${formatDate(popup.startDate)} ~ ${formatDate(popup.endDate)}`;
                  
                  return (
                    <tr 
                      key={popup.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePopupDetail(popup.id)}
                    >
                      <td className="py-3 px-4">{popup.title}</td>
                      <td className="py-3 px-4 text-center">{period}</td>
                      <td className="py-3 px-4 text-center">{popup.type.name}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* 페이지네이션 */}
        {pagination.totalPages > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={handlePageChange}
            pageButtonCount={5}
            activeColor="bg-green"
            hoverColor="hover:bg-gray-100"
          />
        )}
      </div>
    </div>
  );
};

export default AdminPopup;