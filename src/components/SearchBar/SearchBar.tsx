import './SearchBar.css';

import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { isEmptyOrSpaces } from '../../util/StringUtils';

interface SearchBarProps {
  onSearch: Function;
  onClearSearchResult: Function
}

export default function SearchBar({ onSearch, onClearSearchResult }: SearchBarProps) {
  const [timer, setTimer] = useState(0);

  const handleTermChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value;

    if (isEmptyOrSpaces(searchTerm)) {
      clearTimeout(timer);
      onClearSearchResult();
      return;
    }

    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => {
      onSearch(searchTerm)
    }, 500));
  }

  return (
    <Form onSubmit={e => { e.preventDefault(); }}>
      <Form.Group controlId="formBasicEmail">
        {/* <Form.Label>Introduce termino de busqueda</Form.Label> */}
        <Form.Control
          type="search"
          name="searchTerm"
          placeholder="Busca una canción, álbum o artista"
          onChange={handleTermChange}
          autoComplete="off"
        />
      </Form.Group>
    </Form>
  );
}
