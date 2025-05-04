import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../common/utils/Cookies.jsx";
import AlertModal from "../../common/components/modal/AlertModal.jsx";
import Loading from "../../common/components/Loading.jsx";
import SellerShowFileModal from "./modal/SellerShowFileModal.jsx";

const SellerApproval = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");

    const fetchSellers = async () => {
        setLoading(true);
        const token = getCookie("jwt_token");
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/admin/user/approval/request`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSellers(response.data.data);
        } catch (error) {
            console.error(error);
            setModalMessage("판매자 목록 불러오기 실패");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (sellerId) => {
        const token = getCookie("jwt_token");
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/admin/user/approval/${sellerId}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setModalMessage("승인 되었습니다.");
                setShowModal(true);
                fetchSellers();
            }
        } catch (error) {
            console.error(error);
            setModalMessage("승인 처리 중 오류 발생");
            setShowModal(true);
        }
    };

    const handleFileClick = (saveFile) => {
        const imageUrl = `https://yhqtxq7210079.edge.naverncp.com/W6V55b9lyf/seller/${saveFile}?type=m&w=595&h=842`;
        setSelectedImageUrl(imageUrl);
        setIsImageModalOpen(true);
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-2xl ml-4 font-semibold mb-6 pb-2 border-b">
                판매자 승인 요청
            </h1>

            {loading ? (
                <Loading />
            ) : (
                <div className="flex flex-wrap items-center  justify-center pb-12  px-5 ml-3">
                <table className="w-full border bg-white text-sm">
                    <thead className="bg-brown text-white text-center">
                    <tr>
                        <th className="py-3 px-3">유저 ID</th>
                        <th className="py-2 px-3">이름</th>
                        <th className="py-2 px-3">상호명</th>
                        <th className="py-2 px-3">전화번호</th>
                        <th className="py-2 px-3">주소</th>
                        <th className="py-2 px-3">등록증</th>
                        <th className="py-2 px-3">승인</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sellers.map((seller) => (
                        <tr key={seller.sellerId} className="text-center border-t">
                            <td>{seller.userId}</td>
                            <td>{seller.username}</td>
                            <td>{seller.name}</td>
                            <td>{seller.phoneNum}</td>
                            <td>
                                {seller.address.addr} {seller.address.detailAddr} (
                                {seller.address.postNum})
                            </td>
                            <td className={`py-2 px-3`}>
                                <button
                                    type="button"
                                    onClick={() => handleFileClick(seller.saveFile)}
                                    className="text-blue-500 py-1"
                                >
                                    파일보기
                                </button>
                            </td>
                            <td>
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                    onClick={() => handleApprove(seller.sellerId)}
                                >
                                    승인
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                    )}

            {showModal && (
                <AlertModal
                    message={modalMessage}
                    onClose={() => setShowModal(false)}
                />
            )}

            <SellerShowFileModal
                isOpen={isImageModalOpen}
                imageUrl={selectedImageUrl}
                onClose={() => setIsImageModalOpen(false)}
            />
        </div>
    );
};

export default SellerApproval;
