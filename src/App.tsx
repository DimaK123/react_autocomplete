import React, { useMemo, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [onFocus, setOnFocus] = useState(false);
  const [onSelected, setOnSelected] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const handleFocus = () => {
    setOnFocus(!onFocus);
  };

  const applyQuery = useMemo(() => debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnSelected(null);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredHumans = useMemo(() => {
    return peopleFromServer.filter(human => {
      const optimizedQuery = appliedQuery.toLocaleLowerCase().trim();
      const optimizedName = human.name.toLocaleLowerCase().trim();

      return optimizedName.includes(optimizedQuery);
    });
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {onSelected
            ? `${onSelected.name} (${onSelected.born} - ${onSelected.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={handleFocus}
            />
          </div>

          {onFocus && filteredHumans.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredHumans.map(person => {
                  const { name: nameOfPerson, sex } = person;

                  return (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={nameOfPerson}
                      onClick={() => {
                        setOnSelected(person);
                        setOnFocus(false);
                        setQuery(person.name);
                        setAppliedQuery(person.name);
                      }}
                    >
                      <p
                        className={cn({
                          'has-text-link': sex === 'm',
                          'has-text-danger': sex === 'f',
                        })}
                      >
                        {nameOfPerson}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {filteredHumans.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
