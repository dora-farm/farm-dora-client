import UserKeyword from "./user/UserKeyword.jsx";
import UserCheckSort from "./user/UserCheckSort.jsx";
import BasicBtn from "../../../common/components/search/BasicBtn.jsx";

const UserSearchSection = ({
                               searchTerm, setSearchTerm, inputRef,
                               filters, setFilters,
                               handleSearch, handleReset, sortFilter, setSortFilter,
                           }) => {
    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        setFilters(prev => ({ ...prev, [name]: checked }));
    };

    return (
        <div className={`bg-gray border border-gray-dark py-5 px-8 rounded-md select-none ml-6`}>
            <UserKeyword
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                inputRef={inputRef}
                sortFilter={sortFilter}
                setSortFilter={setSortFilter}
            />
            <UserCheckSort
                filters={filters}
                handleFilterChange={handleFilterChange}
            />
            <BasicBtn handleSearch={handleSearch} handleReset={handleReset} />
        </div>
    );
};

export default UserSearchSection;