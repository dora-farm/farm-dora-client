const UserTable = ({ headers, rows, onStatusChange }) => {
    return (
        <div className={`w-full border`}>
        <table className="w-full border text-sm bg-white">
            <thead className="bg-brown text-white text-center">
            <tr>
                {headers.map((header, i) => (
                    <th key={i} className="py-2 px-3">{header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {rows.map((row, rowIdx) => {
                const user = row[2];
                return (
                    <tr key={rowIdx} className="text-center border-t">
                        <td className={`py-2`} >{row[0]}</td>
                        <td className={`py-2`} >{row[1]}</td>
                        <td className={`py-2`} >
                            <select
                                className={`px-2 text-sm ${
                                    user.isBlind ? "text-red-500" : "text-green-600"
                                }`}
                                value={user.isBlind ? "BLINDED" : "ACTIVE"}
                                onChange={(e) => onStatusChange(user.userId, e.target.value)}
                            >
                                <option value="ACTIVE">정상</option>
                                <option value="BLINDED">차단</option>
                            </select>
                        </td>
                        <td className={`py-2`} >{row[3]}</td>
                    </tr>
                );
            })}
            </tbody>
        </table>
        </div>
    );
};

export default UserTable;