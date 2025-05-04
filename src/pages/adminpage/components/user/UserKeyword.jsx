const UserKeyword = ({ searchTerm, setSearchTerm, inputRef,sortFilter,setSortFilter }) => {
    return (
        <div className="flex items-center mb-3">
            <div className="w-24 text-sm font-medium ml-3">이름</div>
            <input
                ref={inputRef}
                type="text"
                placeholder="이름을 입력하세요"
                className="border w-1/2 focus:outline-none text-sm rounded px-3 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
                className="border rounded ml-3 px-2 py-2 font-normal text-sm"
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
            >
                <option value="LATEST">최신 등록일 순</option>
                <option value="OLDEST">오랜된 등록일 순</option>
            </select>
        </div>
    );
};

export default UserKeyword;
