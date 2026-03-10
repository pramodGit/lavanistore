import { useSearchParams } from 'react-router-dom';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const key = searchParams.get('key');

  return (
    <div>
      <h2>Search Results</h2>
      <p>Category ID: {category}</p>
      <p>Search Key: {key}</p>
    </div>
  );
};

export default SearchResultsPage;
