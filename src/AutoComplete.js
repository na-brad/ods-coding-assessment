import { useState } from 'react';
import TextField from '@mui/material/TextField';


const AutoComplete = ({ suggestions, setTestQuery }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [input, setInput] = useState('');

  const onChange = (e) => {
    const userInput = e.target.value;

    const filtered = suggestions.filter(suggestion => {
        return suggestion?.toLowerCase().includes(userInput.toLowerCase())
    });

    setInput(e.target.value);
    setFilteredSuggestions(filtered.slice(0,5));
    setShowSuggestions(true);
  };

  const onClick = (e) => {
    setFilteredSuggestions([]);
    setInput(e.target.innerText);
    setTestQuery(e.target.innerText.toLowerCase());
    setShowSuggestions(false);
  };

  const SuggestionsListComponent = () => {
    return filteredSuggestions.length ? (
      <ul className='suggestions'>
        {filteredSuggestions.map(suggestion => {
          let className;

          return (
            <li className={className} key={suggestion} onClick={onClick}>
              {suggestion}
            </li>
          );
        })}
      </ul>
    ) : (
      <div className='no-suggestions'>
        <em>Try a different search</em>
      </div>
    );
  };

  return (
    <>
      <TextField
        id='autocomplete'
        className='text'
        onChange={onChange}
        value={input}
        label='Enter a city/aiport code'
        variant='outlined'
        placeholder='Search...'
        size='small'
      />
      {showSuggestions && input && <SuggestionsListComponent />}
    </>
  );
};

export default AutoComplete;
