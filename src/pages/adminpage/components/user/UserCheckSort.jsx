import { Checkbox, FormControlLabel } from "@mui/material";

const UserCheckSort = ({ filters, handleFilterChange }) => {
    return (
        <div className="flex items-center mb-3">
            <div className="w-24 font-medium text-sm ml-3">사용자 유형</div>
            {['USER', 'SELLER'].map((key) => (
                <div className={`font-normal flex pl-3 rounded-md mr-2`}>
                <FormControlLabel
                    key={key}
                    control={
                        <Checkbox
                            checked={filters[key]}
                            onChange={handleFilterChange}
                            name={key}
                        />
                    }
                    label={key === 'USER' ? '구매자' : '판매자'}
                    sx={{
                        '& .MuiFormControlLabel-label': {
                            fontSize: '0.875rem',      // text-sm
                            fontWeight: 400,           // normal
                            color: '#374151'           // Tailwind text-gray-700
                        },
                    }}
                />
                </div>
            ))}
        </div>
    );
};

export default UserCheckSort;