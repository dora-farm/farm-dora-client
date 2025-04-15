import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AlertModal from '../../../common/components/modal/AlertModal';
import { useLocation, useNavigate } from 'react-router-dom';

function ProductEdit() {

  // 컴포넌트 마운트 시 딱 한 번만 실행
  useEffect(() => {
    // location.state에서 데이터 가져오기
    const productDetail = location.state.productDetail;
    setSaleId(productDetail.id);
    
    if (productDetail) {
      console.log('전달받은 데이터:', productDetail);
      
      // 카테고리 설정 등 추가 작업 수행
      if (productDetail.bigCategory) {
        setSelectedBigCategory(getBigCategoryIdByName(productDetail.bigCategory));
      }
      if (productDetail.smallCategory) {
        const categoryId = getSmallCategoryIdByName(productDetail.smallCategory);
        setSelectedSmallCategory(categoryId);
      }
      if (productDetail.title){
        setProductName(productDetail.title);
      }
      if (productDetail.origin){
        setOriginName(productDetail.origin);
      }
      if (productDetail.content){
        setEditorData(productDetail.content);
      }
      if (productDetail.options){
        setOptions(productDetail.options);
      }
      

    } else {
      // 데이터가 없는 경우
      alert('상품 정보를 찾을 수 없습니다.');
      navigate('/my/seller/item/manage');
    }
  }, []); // 빈 의존성 배열 - 컴포넌트 마운트 시 한 번만 실행

      // 카테고리 데이터
  const bigCategories = [
    { id: 1, name: '과일' },
    { id: 2, name: '채소' },
    { id: 3, name: '곡류' },
    { id: 4, name: '견과류' },
    { id: 5, name: '버섯류' }
  ];

  //조회에서 온 name을 기준으로 id 번호 추출
  const getBigCategoryIdByName = (name) => {
    const category = bigCategories.find(category => category.name === name);
    return category ? category.id : null; // 찾지 못하면 null 반환
  };
  const getSmallCategoryIdByName = (name) => {
    const category = smallCategories.find(category => category.name === name);
    return category ? category.id : null; // 찾지 못하면 null 반환
  };

  const smallCategories = [
    { id: 1, bigCategoryId: 1, name: '사과' },
    { id: 2, bigCategoryId: 1, name: '배' },
    { id: 3, bigCategoryId: 1, name: '딸기' },
    { id: 4, bigCategoryId: 1, name: '포도' },
    { id: 5, bigCategoryId: 1, name: '감귤' },
    { id: 6, bigCategoryId: 2, name: '상추' },
    { id: 7, bigCategoryId: 2, name: '깻잎' },
    { id: 8, bigCategoryId: 2, name: '고추' },
    { id: 9, bigCategoryId: 2, name: '마늘' },
    { id: 10, bigCategoryId: 2, name: '양파' },
    { id: 11, bigCategoryId: 3, name: '쌀' },
    { id: 12, bigCategoryId: 3, name: '현미' },
    { id: 13, bigCategoryId: 3, name: '보리' },
    { id: 14, bigCategoryId: 3, name: '콩' },
    { id: 15, bigCategoryId: 4, name: '호두' },
    { id: 16, bigCategoryId: 4, name: '아몬드' },
    { id: 17, bigCategoryId: 4, name: '땅콩' },
    { id: 18, bigCategoryId: 4, name: '잣' },
    { id: 19, bigCategoryId: 5, name: '새송이버섯' },
    { id: 20, bigCategoryId: 5, name: '표고버섯' },
    { id: 21, bigCategoryId: 5, name: '느타리버섯' }
  ];

  // 상태 관리
  const [saleId, setSaleId] = useState(null);
  const [selectedBigCategory, setSelectedBigCategory] = useState(null);
  const [selectedSmallCategory, setSelectedSmallCategory] = useState('');
  const [filteredSmallCategories, setFilteredSmallCategories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [detailImages, setDetailImages] = useState([null, null, null, null, null]);
  const [productName, setProductName] = useState('');
  const [originName, setOriginName] = useState('');
  const [editorData, setEditorData] = useState('');
  const [options, setOptions] = useState([{ name: '', price: '', quantity: '' }]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [detailImageFiles, setDetailImageFiles] = useState([null, null, null, null, null]);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!selectedBigCategory) {
      setModalMessage('대분류를 선택해주세요.');
      setShowModal(true);
      return false;
    }

    if (!document.getElementById('smallCategory').value) {
      setModalMessage('소분류를 선택해주세요.');
      setShowModal(true);
      return false;
    }
  
    if (!mainImage) {
      setModalMessage('대표 이미지를 등록해주세요.');
      setShowModal(true);
      return false;
    }
  
    const hasAtLeastOneDetailImage = detailImageFiles.some((img) => img !== null);
    if (!hasAtLeastOneDetailImage) {
      setModalMessage('상세 이미지를 1개 이상 등록해주세요.');
      setShowModal(true);
      return false;
    }
  
    if (!productName.trim()) {
      setModalMessage('상품명을 입력해주세요.');
      setShowModal(true);
      return false;
    }
  
    if (!originName.trim()) {
      setModalMessage('원산지를 입력해주세요.');
      setShowModal(true);
      return false;
    }
  
    if (!editorData.trim()) {
      setModalMessage('상품 상세 설명을 입력해주세요.');
      setShowModal(true);
      return false;
    }
  
    const invalidOption = options.some(
      (opt) => !opt.name.trim() || !opt.price || !opt.quantity
    );
    if (invalidOption) {
      setModalMessage('상품 옵션을 모두 입력해주세요.');
      setShowModal(true);
      return false;
    }
  
    return true;
  };

  // 대분류 선택 시 소분류 필터링
  useEffect(() => {
    if (selectedBigCategory) {
      const filtered = smallCategories.filter(
        item => item.bigCategoryId === selectedBigCategory
      );
      setFilteredSmallCategories(filtered);
    } else {
      setFilteredSmallCategories([]);
    }
  }, [selectedBigCategory]);

// 메인 이미지 핸들러
const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(URL.createObjectURL(file));
      setMainImageFile(file); // File 객체 저장
    }
  };
  
  // 상세 이미지 핸들러
  const handleDetailImageChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDetailImages = [...detailImages];
      newDetailImages[index] = URL.createObjectURL(file);
      setDetailImages(newDetailImages);
      
      const newDetailImageFiles = [...detailImageFiles];
      newDetailImageFiles[index] = file; // File 객체 저장
      setDetailImageFiles(newDetailImageFiles);
    }
  };

  // 옵션 추가 핸들러
  const addOption = () => {
    setOptions([...options, { name: '', price: '', quantity: '' }]);
  };

  // 옵션 삭제 핸들러
  const removeOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  // 옵션 필드 변경 핸들러
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    //유효성 검사
    if (!validateForm()) return;

    // FormData 객체 생성
    const formData = new FormData();
    
    // JSON 데이터 준비 // 추후 seller id 수정 필요
    const jsonData = {
        sellerId:1,
        saleId:saleId,
        title:productName,
        content:editorData,
        origin:originName,
        typeId:selectedSmallCategory,
        options
    };
    
    // JSON 데이터를 문자열로 변환하여 추가
    formData.append('productData', JSON.stringify(jsonData));
    
    // 이미지 파일들 추가
    if (mainImageFile) {
      formData.append('files', mainImageFile);
    }
    
    detailImageFiles.forEach(file => {
      if (file) {
        formData.append('files', file);
      }
    });
    
    fetch('http://localhost:8080/my/seller/item/update', {
      method: 'PUT',
      body: formData
    })
    .then(async response => {
      const data = await response.json();
    
      if (data.status === 200) {
        console.log('성공:', data);
        Reset();
      } else {
        // status가 200이 아닌 경우 예외 처리
        console.error('서버 오류:', data.message || '예기치 못한 오류');
        alert(`오류 발생: ${data.message || '처리에 실패했습니다.'}`);
        e.target.reset();
      }
    })
    .catch(error => {
      console.error('통신 오류:', error);
      alert('네트워크 오류 또는 서버와의 연결 실패');
      e.target.reset(); // 폼 초기화
    });
  };

    // Base64 이미지 업로드 어댑터
    function base64UploadAdapter(loader) {
        return {
          upload: () => {
            return new Promise((resolve, reject) => {
              loader.file.then(file => {
                const reader = new FileReader();
                reader.onload = function() {
                  // 이미지를 Base64 문자열로 변환
                  const base64Image = reader.result;
                  resolve({
                    default: base64Image
                  });
                };
                reader.onerror = function(error) {
                  reject(error);
                };
                reader.readAsDataURL(file);
              });
            });
          }
        };
      }
    
      // CKEditor 이미지 업로드 플러그인
      function uploadPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
          return base64UploadAdapter(loader);
        };
      }

  return (
    
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6 pb-2 border-b">상품 수정</h1>
      
      <form onSubmit={handleSubmit}>
        {/* 카테고리 선택 */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">카테고리</h2>
          
          <div className="flex">
            <div className="w-1/2 pr-2 border rounded">
              <ul className="h-64 overflow-y-auto">
                {bigCategories.map(category => (
                  <li 
                    key={category.id} 
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedBigCategory === category.id ? 'bg-gray-200' : ''}`}
                    onClick={() => setSelectedBigCategory(category.id)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/2 pl-2 border rounded">
              <select 
                id="smallCategory" 
                className="w-full h-64 p-2 bg-white"
                size="10"
                value={selectedSmallCategory}
                onChange={(e) => setSelectedSmallCategory(e.target.value)}
              >
                {filteredSmallCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* 상품명 */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">상품명</h2>
          <input 
            type="text" 
            className="w-full p-2 border rounded"
            placeholder="상품명 입력..."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        
        {/* 상품명 */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">원산지</h2>
          <input 
            type="text" 
            className="w-full p-2 border rounded"
            placeholder="원산지 입력..."
            value={originName}
            onChange={(e) => setOriginName(e.target.value)}
          />
        </div>
        
        {/* 옵션 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">옵션</h2>
            <button 
              type="button" 
              className="bg-gray-200 p-1 rounded-full"
              onClick={addOption}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 pb-2 font-medium">
              <div className="col-span-4">옵션명</div>
              <div className="col-span-3">가격</div>
              <div className="col-span-4">재고</div>
              <div className="col-span-1"></div>
            </div>
            
            {options.map((option, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded text-sm"
                    value={option.name}
                    onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                    placeholder="옵션명"
                  />
                </div>
                <div className="col-span-3">
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded text-sm"
                    value={option.price}
                    onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                    placeholder="가격"
                  />
                </div>
                <div className="col-span-4">
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded text-sm"
                    value={option.quantity}
                    onChange={(e) => handleOptionChange(index, 'quantity', e.target.value)}
                    placeholder="재고"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  {index > 0 && (
                    <button 
                      type="button" 
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => removeOption(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 상품 이미지 */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">대표 이미지</h2>
          <div className="border rounded w-24 h-24 flex items-center justify-center bg-gray-100 relative">
            {mainImage ? (
              <img src={mainImage} alt="Main" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer w-full h-full flex items-center justify-center">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleMainImageChange}
                  accept="image/*"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </label>
            )}
            {mainImage && (
              <button 
                type="button" 
                className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                onClick={() => setMainImage(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">상세 이미지</h2>
          <div className="flex flex-wrap gap-4">
            {detailImages.map((image, index) => (
              <div key={index} className="border rounded w-24 h-24 flex items-center justify-center bg-gray-100 relative">
                {image ? (
                  <img src={image} alt={`Detail ${index + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <label className="cursor-pointer w-full h-full flex items-center justify-center">
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleDetailImageChange(index, e)}
                      accept="image/*"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </label>
                )}
                {image && (
                  <button 
                    type="button" 
                    className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                    onClick={() => {
                      const newDetailImages = [...detailImages];
                      newDetailImages[index] = null;
                      setDetailImages(newDetailImages);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* 상세 설명 (CKEditor) - Base64 이미지 지원 */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">상세 설명</h2>
          <div className="border rounded editor-container">
            <CKEditor
              editor={ClassicEditor}
              data={editorData}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditorData(data);
              }}
              config={{
                extraPlugins: [uploadPlugin], // Base64 이미지 업로드 플러그인
                toolbar: [
                  'heading', '|',
                  'bold', 'italic', 'strikethrough', 'underline', '|',
                  'bulletedList', 'numberedList', '|',
                  'indent', 'outdent', '|',
                  'link', 'blockQuote', 'insertTable', 'imageUpload', '|',
                  'undo', 'redo'
                ],
                image: {
                  toolbar: [
                    'imageTextAlternative',
                    'imageStyle:inline',
                    'imageStyle:block',
                    'imageStyle:side'
                  ]
                }
              }}
            />
          </div>
        </div>
        
        {/* 제출 버튼 */}
        <div className="flex justify-center gap-4 mt-10">
          <button 
            type="submit" 
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            수정하기
          </button>
        </div>
      </form>
      {showModal && (
        <AlertModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ProductEdit;
