// src/components/product/ProductTable.jsx
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function ProductTable({ 
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
            <TableCell style={{ color: 'white' }}>상품명</TableCell>
            <TableCell style={{ color: 'white' }}>판매가</TableCell>
            <TableCell style={{ color: 'white' }}>판매상태</TableCell>
            <TableCell style={{ color: 'white' }}>재고 수량</TableCell>
            <TableCell style={{ color: 'white' }}>주문 수</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.saleId}>
              <TableCell padding="checkbox">
                <Checkbox color="default" 
                          checked={product.isChecked || false}
                          onChange={() => handleItemCheck(product.saleId)}
                />
              </TableCell>
              <TableCell>{pagination.currentPage * pagination.pageSize + index + 1}</TableCell>
              <TableCell 
                onClick={() => handleProductClick(product.saleId)}
                className="cursor-pointer hover:bg-gray-100"
              >{product.title}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                <button 
                  className={`text-xs py-1 px-2 rounded ${
                    product.blind === true 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                  }`}
                  onClick={() => handleProductStatusClick(product.saleId)}
                >
                  {product.blind === true ? "판매 중지" : "판매 중"}
                </button>
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.orderCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProductTable;