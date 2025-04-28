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
      <Table size="small">
        <TableHead>
          <TableRow style={{ backgroundColor: '#4b4b4b' }}>
            <TableCell padding="checkbox">
              <Checkbox color="default" 
                        checked={isAllChecked}
                        onChange={handleAllCheck}
              />
            </TableCell>
            <TableCell style={{ color: 'white' }}>번호</TableCell>
            <TableCell style={{ color: 'white' }}>썸네일</TableCell>
            <TableCell style={{ color: 'white' }}>방송명</TableCell>
            <TableCell style={{ color: 'white' }}>설명</TableCell>
            <TableCell style={{ color: 'white' }}>노출여부</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((video, index) => (
            <TableRow key={video.broadcastId}>
              <TableCell padding="checkbox">
                <Checkbox color="default" 
                          checked={video.isChecked || false}
                          onChange={() => handleItemCheck(video.broadcastId)}
                />
              </TableCell>
              <TableCell>{pagination.currentPage * pagination.pageSize + index + 1}</TableCell>
              <TableCell 
                onClick={() => handleProductClick(video.broadcastId)}
                className="cursor-pointer hover:bg-gray-100"
              >{video.image}</TableCell>
              <TableCell>{video.title}</TableCell>
              <TableCell>{video.desc}</TableCell>
              <TableCell>
                <button 
                  className={`text-xs py-1 px-2 rounded ${
                    video.blind === true 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                  }`}
                  onClick={() => handleProductStatusClick(video.broadcastId)}
                >
                  {video.blind === true ? "노출 중지" : "노출 중"}
                </button>
              </TableCell>
              <TableCell>{video.orderCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default VideoTable;