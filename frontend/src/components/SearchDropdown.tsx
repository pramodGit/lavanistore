import React, { useEffect, useMemo, useState } from 'react';
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItem,
  Paper,
  Box
} from '@mui/material';
import { debounceTime, Subject } from 'rxjs';
import { useNavigate } from 'react-router-dom';
import "../assets/searchDropdown.css";

const categoryOptions = [
  { id: 0, label: 'All' },
  { id: 1, label: 'Be Nutrition' },
  { id: 2, label: 'DA Maulik Organics' },
  { id: 3, label: 'Energie9 Pro' },
  { id: 4, label: 'F-Armour' },
  { id: 5, label: 'Herbs and Hills' },
  { id: 6, label: 'RJUV9' },
  { id: 7, label: 'Rootin' },
  { id: 8, label: 'Sages and Seas' }
];

const categoryItems: Record<number, string[]> = {
  0: ['Protein', 'Vitamins', 'Herbal Tea', 'Digestive Care'],
  1: ['Be Protein', 'Be Hair', 'Be Detox'],
  2: ['Organic Cough Syrup', 'Tulsi Drops', 'Amla Juice'],
  3: ['Whey9 Power', 'ProActive Energy'],
  4: ['Immunity Booster', 'Armor Pain Relief'],
  5: ['Herbal Skin Oil', 'Hills Tea'],
  6: ['RJUV Liver Care', 'RJUV Joints'],
  7: ['Rootin Calm', 'Rootin Kids Tonic'],
  8: ['Sage Calm', 'Sea Mineral Drops']
};

const SearchDropdown = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const searchSubject$ = useMemo(() => new Subject<string>(), []);
  const navigate = useNavigate();

  useEffect(() => {
    const subscription = searchSubject$.pipe(debounceTime(300)).subscribe(setDebouncedTerm);
    return () => subscription.unsubscribe();
  }, [searchSubject$]);

  const itemsToSearch = useMemo(() => {
    const allItems =
      selectedCategoryId === 0
        ? Object.values(categoryItems).flat()
        : categoryItems[selectedCategoryId] || [];
    return allItems.filter(item =>
      item.toLowerCase().includes(debouncedTerm.toLowerCase())
    );
  }, [selectedCategoryId, debouncedTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchSubject$.next(value);
  };

  const handleResultClick = (item: string) => {
    const queryParams = new URLSearchParams({
      category: String(selectedCategoryId),
      key: item
    });
    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <>
      <Box className="search-dropdown">
          <FormControl fullWidth style={{ flex: 1 }}>
              <InputLabel id="category-label">Brand</InputLabel>
              <Select
              labelId="category-label"
              value={selectedCategoryId}
              label="Brand"
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              >
              {categoryOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                  {option.label}
                  </MenuItem>
              ))}
              </Select>
          </FormControl>

          <TextField
              fullWidth
              label="Search product"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ flex: 2 }}
          />
      </Box>


      {debouncedTerm && (
        <Paper elevation={2} style={{ marginTop: '10px', maxHeight: 200, overflowY: 'auto' }}>
          <List>
            {itemsToSearch.length > 0 ? (
              itemsToSearch.map((item, index) => (
                <ListItem component="li" key={index} onClick={() => handleResultClick(item)}>{item}</ListItem>
              ))
            ) : (
              <ListItem>No results found</ListItem>
            )}
          </List>
        </Paper>
      )}
    </>
  );
};

export default SearchDropdown;
