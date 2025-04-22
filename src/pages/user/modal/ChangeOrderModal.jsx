import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import RefundItem from '../components/RefundItem';

const ChangeOrderModal = ({ isOpen, onClose, orderId, onOrderChanged }) => {
	const [statusId, setStatusId] = useState(5); // 기본값은 반품(5)
	const [typeId, setTypeId] = useState(''); // 환불 사유 (1: 단순 변심, 2: 상품 파손, 등)
	const [content, setContent] = useState('');
	const [selectedImages, setSelectedImages] = useState([]);
	const [imagePreview, setImagePreview] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const [sales, setSales] = useState([]);
	const [paymentDetail, setPaymentDetail] = useState({
		amount: 0,
		bankName: '',
		accountNum: '',
		accountHolder: ''
	});
	
	// 환불 사유 유형 목록
	const [refundTypes, setRefundTypes] = useState([]);

	// 유형 목록 가져오기
	useEffect(() => {
		const fetchRefundTypes = async () => {
			try {
				const response = await axios.get('http://localhost:8080/api/my/user/order/refundTypes');
				if (response.data.status === 200) {
					setRefundTypes(response.data.data);
					if (response.data.data.length > 0) {
						setTypeId(response.data.data[0].typeId);
					}
				}
			} catch (error) {
				console.error('환불 유형 목록 조회 실패:', error);
			}
		};

		const fetchOrderOptions = async () => {
			try {
				const response = await axios.get(`http://localhost:8080/api/my/user/order/pay?orderId=${orderId}`);
				if (response.status === 200) {
					setSales(response.data.data.sales || []);
					// 모든 필드에 기본값 설정하여 undefined 방지
					const payDetail = {
						amount: 0,
						bankName: '',
						accountNum: '',
						accountHolder: '',
						...(response.data.data.payDetail || {})
					};
					setPaymentDetail(payDetail);
				}
			} catch (error) {
				console.error('주문 정보 조회 실패:', error);
			}
		};
		
		if (isOpen) {
			fetchRefundTypes();
			fetchOrderOptions();
		}
	}, [isOpen, orderId]);
	
	// 모달이 닫힐 때 상태 초기화
	useEffect(() => {
		if (!isOpen) {
			setStatusId(5);
			setTypeId('');
			setContent('');
			setSelectedImages([]);
			setImagePreview([]);
			setPaymentDetail({
				amount: 0,
				bankName: '',
				accountNum: '',
				accountHolder: ''
			});
			
			// 이미지 URL 해제
			imagePreview.forEach(url => {
				if (url.startsWith('blob:')) {
					URL.revokeObjectURL(url);
				}
			});
		}
	}, [isOpen]);
	
	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		if (files.length === 0) return;
		
		// 최대 5개 이미지로 제한
		const totalImages = imagePreview.length + files.length;
		if (totalImages > 5) {
			alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
			return;
		}
		
		// 선택한 파일을 imagePreview에 추가
		const newPreviews = files.map(file => URL.createObjectURL(file));
		setImagePreview([...imagePreview, ...newPreviews]);
		setSelectedImages([...selectedImages, ...files]);
	};
	
	const handleRemoveImage = (index) => {
		// URL 객체 해제
		if (imagePreview[index].startsWith('blob:')) {
			URL.revokeObjectURL(imagePreview[index]);
		}
		
		const newPreviews = [...imagePreview];
		newPreviews.splice(index, 1);
		setImagePreview(newPreviews);
		
		const newSelectedImages = [...selectedImages];
		newSelectedImages.splice(index, 1);
		setSelectedImages(newSelectedImages);
	};
	
	const handleContentChange = (e) => {
		const text = e.target.value;
		if (text.length <= 500) {
			setContent(text);
		}
	};
	
	const handleSubmit = async () => {
		if (!typeId) {
			alert('환불 사유를 선택해주세요.');
			return;
		}
		
		if (content.trim() === '') {
			alert('상세 내용을 입력해주세요.');
			return;
		}
		
		if (statusId === 5 && !paymentDetail.accountHolder) {
			alert('예금주 정보를 입력해주세요.');
			return;
		}
		
		setSubmitting(true);
		try {
			// FormData를 사용하여 이미지와 함께 전송
			const formData = new FormData();
			formData.append('orderId', orderId);
			formData.append('typeId', typeId);
			formData.append('statusId', statusId); // 5: 반품, 6: 교환
			formData.append('content', content);
			
			// 반품일 경우 계좌 정보 추가
			if (statusId === 5) {
				formData.append('bankName', paymentDetail.bankName);
				formData.append('accountNumber', paymentDetail.accountNum);
				formData.append('accountHolder', paymentDetail.accountHolder);
			}
			
			// 이미지 파일 추가
			selectedImages.forEach(image => {
				formData.append('images', image);
			});
			
			// 환불/교환 요청 API 호출
			const response = await axios.post(
				'http://localhost:8080/api/my/user/order/refund', 
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			);
			
			if (response.data.status === 200) {
				alert(statusId === 5 ? '반품 신청이 완료되었습니다.' : '교환 신청이 완료되었습니다.');
				onOrderChanged && onOrderChanged();
				onClose();
			} else {
				alert('요청 처리 중 오류가 발생했습니다.');
			}
		} catch (error) {
			console.error('환불/교환 요청 오류:', error);
			alert('요청 처리 중 오류가 발생했습니다.');
		} finally {
			setSubmitting(false);
		}
	};
	
	return (
		<>
			{isOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white w-full max-w-md rounded-lg overflow-hidden max-h-[90vh] flex flex-col">
						{/* 헤더 */}
						<div className="flex justify-between items-center px-4 py-3 border-b flex-shrink-0">
							<h2 className="text-lg font-medium">{statusId === 5 ? '반품 신청' : '교환 신청'}</h2>
							<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
								<X size={24} />
							</button>
						</div>
						
						<div className="flex-1 overflow-y-auto">
							{/* 주문 상품 목록 */}
							{sales.map(sale => (
								<RefundItem 
									key={sale.saleId} 
									sale={sale} />
							))}
							<div className="mt-2 text-lg font-medium flex justify-between px-4">
								<span>총 환불 금액</span>
								<span>{paymentDetail.amount.toLocaleString() || 0}원</span>
							</div>
							{/* 처리 유형 선택 (반품/교환) */}
							<div className="p-4 border-b">
								<div className="mb-2">처리 유형</div>
								<div className="flex space-x-4">
									<button
										className={`px-4 py-2 rounded ${statusId === 5 ? 'bg-green text-white' : 'bg-gray-200 text-gray-800'}`}
										onClick={() => setStatusId(5)}
									>
										반품
									</button>
									<button
										className={`px-4 py-2 rounded ${statusId === 6 ? 'bg-green text-white' : 'bg-gray-200 text-gray-800'}`}
										onClick={() => setStatusId(6)}
									>
										교환
									</button>
								</div>
							</div>
							
							{/* 환불 사유 선택 */}
							<div className="p-4 border-b">
								<div className="mb-2">환불 사유</div>
								<select 
									className="w-full border border-gray-300 rounded p-2"
									value={typeId}
									onChange={(e) => setTypeId(Number(e.target.value))}
								>
									{refundTypes.map(type => (
										<option key={type.typeId} value={type.typeId}>
											{type.name}
										</option>
									))}
								</select>
							</div>
							
							{/* 계좌 정보 (반품일 경우만) */}
							{statusId === 5 && (
								<div className="p-4 border-b">
									<div className="mb-2">환불 계좌 정보</div>
									<div className="space-y-3">
										<div>
											<label className="block text-sm text-gray-600 mb-1">은행명</label>
											<input
												type="text"
												name="bankName"
												className="w-full border border-gray-300 rounded p-2 bg-gray-100"
												value={paymentDetail.bankName}
												disabled
											/>
											<p className="text-xs text-gray-500 mt-1">결제 시 사용된 은행으로 환불됩니다.</p>
										</div>
										<div>
											<label className="block text-sm text-gray-600 mb-1">계좌번호</label>
											<input
												type="text"
												name="accountNumber"
												className="w-full border border-gray-300 rounded p-2 bg-gray-100"
												value={paymentDetail.accountNum}
												disabled
											/>
											<p className="text-xs text-gray-500 mt-1">결제 시 사용된 계좌로 환불됩니다.</p>
										</div>
										<div>
											<label className="block text-sm text-gray-600 mb-1">예금주 <span className="text-red-500">*</span></label>
											<input
												type="text"
												name="accountHolder"
												className="w-full border border-gray-300 rounded p-2"
												placeholder="예금주를 입력해주세요"
												value={paymentDetail.accountHolder}
												onChange={(e) => setPaymentDetail({...paymentDetail, accountHolder: e.target.value})}
											/>
										</div>
									</div>
								</div>
							)}
							
							{/* 사진 업로드 */}
							<div className="p-4 border-b">
								<div className="mb-2">사진 업로드 <span className="text-gray-500 text-sm">(필수)</span></div>
								<div className="text-xs text-gray-500 mb-2">
									상품 상태를 확인할 수 있는 사진을 첨부해주세요.
									{statusId === 5 ? ' 반품' : ' 교환'} 사유에 따라 필요한 사진이 다를 수 있습니다.
								</div>
								
								<div className="flex flex-wrap gap-2">
									{/* 이미지 업로드 버튼 */}
									<label className="w-16 h-16 border border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer">
										<span className="text-2xl text-gray-400">+</span>
										<span className="text-xs text-gray-400">사진 업로드</span>
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleImageUpload}
										/>
									</label>
									
									{/* 이미지 미리보기 */}
									{imagePreview.map((src, index) => (
										<div key={index} className="w-16 h-16 border border-gray-300 rounded overflow-hidden relative">
											<img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
											<button 
												onClick={() => handleRemoveImage(index)}
												className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs"
											>
												<X size={16}/>
											</button>
										</div>
									))}
								</div>
							</div>
							
							{/* 상세 내용 */}
							<div className="p-4">
								<div className="mb-2 flex justify-between items-center">
									<div>상세 내용</div>
									<div className="text-sm text-gray-500">
										<span className={content.length > 450 ? "text-red-500" : ""}>{content.length}/500자</span>
									</div>
								</div>
								<div className="relative">
									<textarea
										className="w-full border border-gray-300 rounded p-3 h-32 resize-none"
										placeholder={statusId === 5 
											? "반품 사유와 상품 상태에 대해 자세히 설명해주세요." 
											: "교환 사유와 원하는 교환 상품에 대해 자세히 설명해주세요."}
										value={content}
										onChange={handleContentChange}
									></textarea>
								</div>
							</div>
							<div className='text-xs text-danger p-3'>* 주의: 함께 주문하신 다른 상품들도 모두 같은 처리 유형으로 자동 적용됩니다.</div>

						</div>
						
						{/* 제출 버튼 - 항상 하단에 고정 */}
						<button
							className={`w-full py-3 ${submitting ? 'bg-gray-400' : 'bg-green'} text-white font-medium flex-shrink-0`}
							onClick={handleSubmit}
							disabled={submitting}
						>
							{submitting ? '처리 중...' : statusId === 5 ? '반품 신청하기' : '교환 신청하기'}
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default ChangeOrderModal;