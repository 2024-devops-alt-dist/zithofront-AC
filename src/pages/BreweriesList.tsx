
import { useEffect, useState } from 'react';
import { Brewery } from '../types/Brewery';
import { fetchBreweries } from '../utils/FetchBreweries';
import { Link } from 'react-router-dom';
import SearchBrewery from '../components/SearchBrewery';
import TagFilterBrewery from '../components/TagFilterBrewery';
import Collapse from '../components/Collapse';
import './../styles/ListStyle.css';
  
function BreweriesList() {
  const [breweries, setBreweries] = useState<Brewery[]>([]);

  useEffect(() => {
    fetchBreweries().then(data => setBreweries(data));
  }, []);
console.log("Nos brasseries", breweries);

  return (
    <div className='list-container'>
      <h2 className='h2-list'>Nos brasseries</h2>
      <SearchBrewery breweries={breweries} />
      <TagFilterBrewery breweries={breweries} breweryTags={[]} />
     { breweries.length === 0 ? (
       <p>Aucune brasserie trouvée.</p>
     ) : (
      <Collapse title="Toutes les brasseries">
      
       <ul>
         {breweries.map(brewery => (
           <li className='list-item' key={brewery.brewery_id}>
              <Link to={`/breweryDetails/${brewery.brewery_id}`}><h3>{brewery.name}</h3></Link>
           </li>
         ))}
       </ul>
      </Collapse>
     )} 
    </div>
  );
}

export default BreweriesList;
