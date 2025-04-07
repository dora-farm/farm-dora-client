import React from 'react'

function UserSidebar() {
    return (
        <div className="flex-col w-[250px] h-[100vh] rounded-xl p-4 mt-7 border-gray-dark border-2 max-w-[250px]">

            {/*활동 정보*/}
            <span className="font-bold text-xl border-b-2 border-gray-dark inline-block w-[100%] h-fit pb-3 pl-2">
              활동 정보
            </span>
            <nav className="mt-6 flex flex-col">
                <button className="text-left px-4 py-2 rounded-md hover:bg-gray-100 transition">마이페이지</button>
                <button className="text-left px-4 py-2 rounded-md hover:bg-gray-100 transition">짬한 상품</button>
                <button className="text-left px-4 py-2 rounded-md hover:bg-gray-100 transition">장바구니</button>
                <button className="text-left px-4 py-2 rounded-md hover:bg-gray-100 transition">내 리뷰 보기</button>
                <button className="text-left px-4 py-2 rounded-md hover:bg-gray-100 transition">내 문의 보기</button>
            </nav>

            {/*쇼핑 정보*/}
            <span className="font-bold text-xl border-b-2 border-gray-dark inline-block w-[100%] h-fit pb-3 pl-2 mt-32">
              쇼핑정보
            </span>
            <nav className="mt-6 flex flex-col">
                <button className="text-left px-4 py-2 rounded-md hover:bg-gray-100 transition">주문 내역</button>
                <button className="text-left px-4 py-2 rounded-md hover:bg-gray-100 transition">배송지 관리</button>
            </nav>

            {/*개인정보*/}
            <span className="font-bold text-xl border-b-2 border-gray-dark inline-block w-[100%] h-fit pb-3 pl-2 mt-32">
              개인정보
            </span>
            <nav className="mt-6 flex flex-col">
                <button className="text-left px-4 py-2 rounded-md hover:bg-gray-100 transition">회원정보 수정</button>
                <button className="text-left px-4 py-2 rounded-md hover:bg-gray-100 transition">회원 탈퇴</button>
            </nav>
        </div>
    )
}

export default UserSidebar