import React from 'react';
import axios from 'axios';
import Container from '../dashboard/components/ChartContainer';
import SearchForm from './components/SearchForm';
import OrderList from './components/OrderList';
import Pagination from '../../../common/components/Pagination';

function Inquiry() {
  return (
    <div className="space-y-6">
      <Container>
        <SearchForm 
        />
      </Container>
      
      <Container>        
        <OrderList 
        />
      </Container>
        <Pagination 
        />
    </div>
  )
}

export default Inquiry;