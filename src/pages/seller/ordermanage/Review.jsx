import React from 'react';
import axios from 'axios';
import Container from '../dashboard/components/ChartContainer';
import SearchForm from './components/SearchForm';
import ListForm from './components/ListForm';
import Pagination from '../../../common/components/Pagination';

function Review() {
  return (
    <div className="space-y-6">
      <Container>
        <SearchForm 
        />
      </Container>
      
      <Container>        
        <ListForm 
        />
      </Container>
        <Pagination 
        />
    </div>
  )
}

export default Review;