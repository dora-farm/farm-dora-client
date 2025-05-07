import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../common/utils/axiosInstance';
import Pagination from '../../common/components/Pagination';
import DateFilter from './components/DateFilter';
import ReviewEditModal from './components/ReviewEditModal';
import ImageViewer from './components/ImageViewer';
import ReviewList from './components/ReviewList';
import AlertModal2 from '../../common/components/modal/AlertModal2';

function MyReviews() {
    const navigate = useNavigate();
    const location = useLocation();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
        pageSize: 5
    });

    // 알림 모달 상태
    const [modal, setModal] = useState({
        show: false,
        title: '',
        message: ''
    });

    // 이미지 뷰어 상태
    const [imageViewer, setImageViewer] = useState({
        isOpen: false,
        images: [],
        currentIndex: 0
    });

    // 리뷰 수정 모달 상태
    const [editModal, setEditModal] = useState({
        isOpen: false,
        reviewId: null,
        reviewData: null
    });

    // URL에서 쿼리 파라미터 가져오기
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        const startDate = params.get('startDate') || getFirstDayOfMonth();
        const endDate = params.get('endDate') || getLastDayOfMonth();
        const page = params.get('page') || 0;

        return { startDate, endDate, page: parseInt(page) };
    };

    // 현재 달의 첫날 구하기
    const getFirstDayOfMonth = () => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return firstDayOfMonth.toISOString().split('T')[0];
    };

    // 현재 달의 마지막 날 구하기
    const getLastDayOfMonth = () => {
        const now = new Date();
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return lastDayOfMonth.toISOString().split('T')[0];
    };

    // URL 쿼리 파라미터에서 날짜 정보 가져오기
    const queryParams = getQueryParams();
    const [dateRange, setDateRange] = useState({ 
        startDate: queryParams.startDate, 
        endDate: queryParams.endDate 
    });

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setModal(prev => ({ ...prev, show: false }));
    };

    // 리뷰 목록 불러오기
    const getReviewsWithAxios = async () => {
        try {
            setLoading(true);
            const { startDate, endDate, page } = getQueryParams();
            const response = await axios.get(`${import.meta.env.VITE_BUYER_REST_API_URL}/my/user/order/myreviews`, {
                params: { startDate, endDate, page }
            });      
            if (response.data.status === 200) {
                setReviews(response.data.data.contents);
                setPagination({
                    currentPage: response.data.data.currentPage,
                    totalElements: response.data.data.totalElements,
                    totalPages: response.data.data.totalPages,
                    hasNext: response.data.data.hasNext,
                    hasPrev: response.data.data.hasPrev,
                    pageSize: response.data.data.pageSize
                });
            } else {
                setError('리뷰 데이터를 불러오는데 실패했습니다.');
                setModal({
                    show: true,
                    title: '데이터 로드 실패',
                    message: '리뷰 데이터를 불러오는데 실패했습니다.'
                });
            }
        } catch (err) {
            setError('서버 연결에 문제가 발생했습니다: ' + err.message);
            setModal({
                show: true,
                title: '서버 연결 오류',
                message: '서버 연결에 문제가 발생했습니다: ' + err.message
            });
        } finally {
            setLoading(false);
        }
    };

    // 현재 선택된 날짜 범위 타입
    const [selectedRange, setSelectedRange] = useState('');

    // 날짜 범위 업데이트 핸들러
    const handleDateRangeUpdate = (newDateRange, rangeType) => {
        setDateRange(newDateRange);
        setSelectedRange(rangeType);
    
        // 페이지는 항상 0으로 리셋
        navigate(`/my/user/review?startDate=${newDateRange.startDate}&endDate=${newDateRange.endDate}&page=0`);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        navigate(`/my/user/review?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&page=${newPage}`);
    };

    // 이미지 뷰어 열기
    const openImageViewer = (images, index = 0) => {
        setImageViewer({
            isOpen: true,
            images,
            currentIndex: index
        });
    };

    // 이미지 뷰어 닫기
    const closeImageViewer = () => {
        setImageViewer({
            isOpen: false,
            images: [],
            currentIndex: 0
        });
    };
    
    // 리뷰 수정 모달 열기
    const openEditModal = (reviewId, reviewData) => {
        setEditModal({
            isOpen: true,
            reviewId,
            reviewData
        });
    };
    
    // 리뷰 수정 모달 닫기
    const closeEditModal = () => {
        setEditModal({
            isOpen: false,
            reviewId: null,
            reviewData: null
        });
    };

    // 리뷰 수정 처리
    const handleReviewUpdate = async (reviewId, updatedData) => {
        try {
            // API 호출로 리뷰 업데이트
            const response = await axios.put(`${import.meta.env.VITE_BUYER_REST_API_URL}/my/user/order/myreviews/${reviewId}`, updatedData);

            if (response.data.status === 200) {
                getReviewsWithAxios();
                setModal({
                    show: true,
                    title: '수정 성공',
                    message: '리뷰가 성공적으로 수정되었습니다.'
                });
                closeEditModal();
            } else {
                setModal({
                    show: true,
                    title: '수정 실패',
                    message: '리뷰 수정에 실패했습니다.'
                });
            }
        } catch (error) {
            setModal({
                show: true,
                title: '수정 오류',
                message: '리뷰 수정 중 오류가 발생했습니다: ' + error.message
            });
        }
    };

    // 리뷰 삭제 처리
    const handleReviewDelete = async (reviewId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BUYER_REST_API_URL}/my/user/order/myreviews/${reviewId}/delete`);

            if (response.data.status === 200) {
                // 성공적으로 삭제되면 목록에서도 제거
                setReviews(reviews.filter(review => review.reviewId !== reviewId));
                getReviewsWithAxios();
                setModal({
                    show: true,
                    title: '삭제 성공',
                    message: '리뷰가 성공적으로 삭제되었습니다.'
                });
            } else {
                setModal({
                    show: true,
                    title: '삭제 실패',
                    message: '리뷰 삭제에 실패했습니다.'
                });
            }
        } catch (error) {
            setModal({
                show: true,
                title: '삭제 오류',
                message: '리뷰 삭제 중 오류가 발생했습니다: ' + error.message
            });
        }
    };

    // URL 변경 감지하여 데이터 다시 불러오기
    useEffect(() => {
        getReviewsWithAxios();
    }, [location.search]);

    // 초기 렌더링 시 URL 설정
    useEffect(() => {
        // URL이 없거나 쿼리 파라미터가 누락된 경우 기본값으로 리다이렉트
        if (!location.search || !getQueryParams().startDate || !getQueryParams().endDate) {
            navigate(`/my/user/review?startDate=${getFirstDayOfMonth()}&endDate=${getLastDayOfMonth()}&page=0`);
            setSelectedRange('all');
        }
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
        </div>
    );

    if (error) return (
        <div className="text-red-500 text-center p-6">{error}</div>
    );

    return (
        <div className="w-full m-7">
            {/* 날짜 필터 컴포넌트 */}
            <DateFilter 
                dateRange={dateRange} 
                selectedRange={selectedRange}
                onRangeUpdate={handleDateRangeUpdate}
            />

            {/* 리뷰 목록 컴포넌트 */}
            <ReviewList 
                reviews={reviews} 
                onOpenImageViewer={openImageViewer}
                onEditReview={openEditModal}
                onDeleteReview={handleReviewDelete}
            />

            {/* 이미지 뷰어 모달 */}
            {imageViewer.isOpen && (
                <ImageViewer 
                    images={imageViewer.images}
                    currentIndex={imageViewer.currentIndex}
                    onClose={closeImageViewer}
                    onChangeIndex={(newIndex) => setImageViewer(prev => ({
                    ...prev,
                    currentIndex: newIndex
                    }))}
                />
            )}

            {/* 리뷰 수정 모달 */}
            {editModal.isOpen && (
                <ReviewEditModal
                    reviewData={editModal.reviewData}
                    onClose={closeEditModal}
                    onUpdate={(updatedData) => handleReviewUpdate(editModal.reviewId, updatedData)}
                />
            )}

            {/* 알림 모달 */}
            {modal.show && (
                <AlertModal2
                    title={modal.title}
                    message={modal.message}
                    onClose={handleCloseModal}
                />
            )}

            {/* 페이지네이션 */}
            {reviews.length > 0 && pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    hasNext={pagination.hasNext}
                    hasPrev={pagination.hasPrev}
                    onPageChange={handlePageChange}
                    activeColor="bg-green"
                    hoverColor="hover:bg-gray"
                />
            )}
        </div>
    );
}

export default MyReviews;