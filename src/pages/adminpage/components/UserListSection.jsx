import UserTable from "./user/UserTable.jsx";
import Pagination from "../../../common/components/Pagination.jsx";

const UserListSection = ({users, pagination, onPageChange, onStatusChange}) => {
    const headers = ["아이디", "이름", "차단 상태", "역할"];
    const rows = users.map((user) => [
        // user.userId,
        user.id,
        user.name,
        user,
        user.isSeller ? "판매자" : "구매자"
    ]);

    return (
        <div className={` p-8 bg-gray border border-gray-dark rounded-md ml-6 mt-8`}>
            <UserTable headers={headers} rows={rows} onStatusChange={onStatusChange}/>
            {pagination.totalPages > 1 &&
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    hasNext={pagination.hasNext}
                    hasPrev={pagination.hasPrev}
                    onPageChange={onPageChange}
                />
            }
        </div>
    );
};

export default UserListSection;