

import { useState, useEffect } from 'react';
import { Beer } from '../types/Beer';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

interface TagFilterBeerProps {
  beers: Beer[];
  beerTags: string[];
}

function TagFilterBeer({ beers }: TagFilterBeerProps) {
  const [selectedBreweries, setSelectedBreweries] = useState<string[]>([]); 
  const [selectedAlcohol, setSelectedAlcohol] = useState<string[]>([]); 
 const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredBeers, setFilteredBeers] = useState<Beer[]>([]); 

  const breweryTags = Array.from(new Set(beers.map((beer) => (beer.brewery_name ?? '').toString())));

  const alcoholTags = useMemo(() => [
    { label: "Sans alcool", value: "non_alcoholic", range: [0, 0] },
    { label: "Légère (0-4°)", value: "light", range: [0, 4] },
    { label: "Moyenne (4-7°)", value: "medium", range: [4, 7] },
    { label: "Forte (+ de 7°)", value: "strong", range: [7, Infinity] }
  ], []);

  const categoryTags = Array.from(new Set(beers.map((beer) => (beer.category_name ?? '').toString())));

  useEffect(() => {
    // pas de tag : pas de resultats affichés
    if (selectedBreweries.length === 0 && selectedAlcohol.length === 0 && selectedCategories.length === 0) {
      console.log('Pas de tag sélectionné');
      setFilteredBeers([]);
      return;
    }

    let filtered = beers;

    // Filtre brasserie
    if (selectedBreweries.length > 0) {
      filtered = filtered.filter((beer) =>
        selectedBreweries.includes(beer.brewery_name.toString())
      );
    }

    // Filtre catégorie
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((beer) =>
        selectedCategories.includes(beer.category_name.toString())
      );
    }

    // Filtre alcool
    if (selectedAlcohol.length > 0) {
      filtered = filtered.filter((beer) => {
        return selectedAlcohol.some((tag) => {
          const alcoholTag = alcoholTags.find((at) => at.value === tag);
          if (alcoholTag) {
            const [min, max] = alcoholTag.range;
            return beer.abv >= min && beer.abv <= max;
          }
          return false;
        });
      });
    }

    setFilteredBeers(filtered);
  }, [selectedBreweries, selectedAlcohol, selectedCategories, beers, alcoholTags]);

  const handleBreweryTagClick = (brewery: string): void => {
    setSelectedBreweries((prevBreweries) =>
      prevBreweries.includes(brewery)
        ? prevBreweries.filter((b) => b !== brewery)
        : [...prevBreweries, brewery]
    );
  };

  const handleAlcoholTagClick = (alcoholTag: string): void => {
    setSelectedAlcohol((prevAlcohol) =>
      prevAlcohol.includes(alcoholTag)
        ? prevAlcohol.filter((tag) => tag !== alcoholTag)
        : [...prevAlcohol, alcoholTag]
    );
  };

  const handleCategoryTagClick = (category: string): void => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
       ? prevCategories.filter((c) => c!== category)
        : [...prevCategories, category]
    );
  };
//   const handleResetClick = () => {
//     setSelectedBreweries([]);
//     setSelectedAlcohol([]);
//     setSelectedCategories([]);
//     setFilteredBeers(beers);
//   };


  return (
    <div>
      <p>Filtrer par brasserie</p>
      <div className="tag-container">
        {breweryTags.map((brewery, index) => (
          <button
            key={index}
            onClick={() => handleBreweryTagClick(brewery.toString())}
            style={{
              backgroundColor: selectedBreweries.includes(brewery)
                ? 'blue'
                : 'white',
              color: selectedBreweries.includes(brewery) ? 'white' : 'black',
              cursor: 'pointer',
            }}
          >
            {brewery}
          </button>
        ))}
      </div>

      <p>Filtrer par alcool</p>
      <div className="tag-container">
        {alcoholTags.map((tag, index) => (
          <button
            key={index}
            onClick={() => handleAlcoholTagClick(tag.value)}
            style={{
              backgroundColor: selectedAlcohol.includes(tag.value)
                ? 'blue'
                : 'white',
              color: selectedAlcohol.includes(tag.value) ? 'white' : 'black',
              cursor: 'pointer',
            }}
          >
            {tag.label}
          </button>
        ))}
      </div>
      
      <p>Filtrer par categorie</p>
      <div className="tag-container">
        {categoryTags.map((tag, index) => (
          <button
            key={index}
            onClick={() => handleCategoryTagClick(tag.toString())}
            style={{
              backgroundColor: selectedCategories.includes(tag)
                ? 'blue'
                : 'white',
              color: selectedCategories.includes(tag) ? 'white' : 'black',
              cursor: 'pointer',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <p>Résultats :</p>
      <div className="beer-list">
        {filteredBeers.length > 0 ? (
          filteredBeers.map((beer) => (
            <div key={beer.beer_id} className="beer-item">
              <Link to={`/beerDetails/${beer.beer_id}`}>
                <h4>{beer.name}</h4>
                <p>{beer.description}</p>
                <p>
                  <strong>Brasserie :</strong> {beer.brewery_name}
                </p>
                <p>
                  <strong>ABV :</strong> {beer.abv}°
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p>Aucune bière ne correspond aux critères de recherche.</p>
        )}
      </div>
    </div>
  );
}

export default TagFilterBeer;
