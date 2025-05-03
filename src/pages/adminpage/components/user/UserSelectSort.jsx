const UserSelectSort = ({ sortFilter, setSortFilter }) => {
    return (
        <select
            className="border rounded px-3s py-2"
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
        >
            <option value="LATEST">최신 등록일 순</option>
            <option value="OLDEST">오랜된 등록일 순</option>
        </select>
    );
};

export default UserSelectSort;
