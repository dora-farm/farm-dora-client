import React, { useState, useEffect, useRef } from 'react';
import UserSearchSection from './components/UserSearchSection.jsx';
import UserListSection from './components/UserListSection.jsx';
import AlertModal from '../../common/components/modal/AlertModal.jsx';
import Loading from '../../common/components/Loading.jsx';
import { fetchWithAuth } from '../../common/utils/fetchWithAuth.js';

const AdminUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ USER: true, SELLER: true });
  const [processedFilters, setProcessedFilters] = useState([]);
  const [sortFilter, setSortFilter] = useState('LATEST');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrev: false
  });


  const inputRef = useRef(null);

  useEffect(() => {
    const selectedTypes = Object.entries(filters)
        .filter((pair) => pair[1])
        .map((pair) => pair[0]);

    if (selectedTypes.length === 0) {
      setProcessedFilters(['USER', 'SELLER']);
    } else {
      setProcessedFilters(selectedTypes);
    }
  }, [filters]);

  const fetchUsers = async (page = 0) => {
    setLoading(true);
    const typeParams = processedFilters.map(type => `types=${type}`).join('&');
    const url = `${import.meta.env.VITE_SEARCH_REST_API_URL}/admin/user?keyword=${searchTerm}&${typeParams}&sort=${sortFilter}&page=${page}`;
    console.log(url);
    try {
      const res = await fetchWithAuth(url,{
        method: 'GET',
      });
      const json = await res.json();
      const data = json.data;
      setUsers(data.contents);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        hasNext: data.hasNext,
        hasPrev: data.hasPrevious,
      });
    } catch (e) {
      console.error(e);
      setModalMessage("사용자 불러오기 오류");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 0 }));
    fetchUsers(0);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({ USER: true, SELLER: true });
    setSortFilter('LATEST');
    setPagination(prev => ({ ...prev, currentPage: 0 }));
    fetchUsers(0);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchUsers(page);
  };

  const handleStatusChange = async (userId) => {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/admin/user/blind`, {
        method: 'PATCH',
        body: JSON.stringify({ userId: userId})
      });
      const json = await res.json();
      if (res.ok) {
        fetchUsers(pagination.currentPage);
      }
      setModalMessage(json.message);
      setShowModal(true);

    } catch (e) {
      console.error("상태 변경 실패", e);
      setModalMessage("상태 변경 중 오류 발생");
      setShowModal(true);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, []);

  return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-semibold ml-4 mb-6 pb-2 border-b">사용자 관리</h1>

        <UserSearchSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            inputRef={inputRef}
            filters={filters}
            setFilters={setFilters}
            handleSearch={handleSearch}
            handleReset={handleReset}
            setSortFilter={setSortFilter}
            sortFilter={sortFilter}
        />

        {loading ? (
            <Loading />
        ) : (

            <UserListSection
                users={users}
                sortFilter={sortFilter}
                setSortFilter={setSortFilter}
                pagination={pagination}
                onPageChange={handlePageChange}
                onStatusChange={handleStatusChange}
            />
        )}

        {showModal && (
            <AlertModal message={modalMessage} onClose={() => setShowModal(false)} />
        )}
      </div>
  );
};

export default AdminUser;