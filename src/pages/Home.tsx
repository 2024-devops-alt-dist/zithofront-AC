import { Link } from 'react-router-dom';
import './../styles/HomeStyle.css';

function Home() {
alert("La base de données est déployée avec Render, les données mettent du temps à charger (1-2 minutes) !");

  return (
      <div className='home-container'>
        <h2 className='home-title'>The Beer Lover's Guide</h2>
        <Link to="/beers" className='link-style'>See all beers</Link>
        <br />
        <Link to="/breweries" className='link-style'>See all breweries</Link>
      </div>
  )
}

export default Home
