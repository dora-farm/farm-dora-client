// src/components/product/ProductTable.jsx
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function VideoTable({ 
  products, 
  pagination, 
  isAllChecked, 
  handleAllCheck, 
  handleItemCheck, 
  handleProductClick,
  handleProductStatusClick
}) {
  return (
<TableContainer component={Paper} className="mb-4">
  <Table size="small" className="table-fixed w-full">
    <TableHead>
      <TableRow style={{ backgroundColor: '#4b4b4b' }}>
        <TableCell padding="checkbox" className="w-12">
          <Checkbox color="default" 
                    checked={isAllChecked}
                    onChange={handleAllCheck}
          />
        </TableCell>
        <TableCell style={{ color: 'white' }} className="w-16">번호</TableCell>
        <TableCell style={{ color: 'white' }} className="w-32">썸네일</TableCell>
        <TableCell style={{ color: 'white' }} className="w-64">제목</TableCell>
        <TableCell style={{ color: 'white' }} className="w-64">설명</TableCell>
        <TableCell style={{ color: 'white' }} className="w-24">노출여부</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {products.map((video, index) => (
        <TableRow key={video.id}>
          <TableCell padding="checkbox" className="w-12">
            <Checkbox color="default" 
                      checked={video.isChecked || false}
                      onChange={() => handleItemCheck(video.id)}
            />
          </TableCell>
          <TableCell className="w-16">{pagination.currentPage * pagination.pageSize + index + 1}</TableCell>
          <TableCell className="w-32">
            <img src={video.thumbnailImage} className="w-24 h-16 object-cover"/>
          </TableCell>
          <TableCell
            className="w-64 cursor-pointer hover:bg-gray-100"
            onClick={() => handleProductClick(video.id)}
          >
            {video.title}
          </TableCell>
          <TableCell className="w-64">{video.desc}</TableCell>
          <TableCell className="w-24">
            <button 
              className={`text-xs py-1 px-2 rounded ${
                video.blind === true 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
              onClick={() => handleProductStatusClick(video.id)}
            >
              {video.blind === true ? "노출 중지" : "노출 중"}
            </button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
  );
}

export default VideoTable;