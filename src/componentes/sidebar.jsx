import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './sidebar.module.css';

function Sidebar() {
  const {logado, logout} = useAuth()
  const linkClass = ({ isActive }) =>
    isActive ? styles.link + ' ' + styles.ativo : styles.link;

  return (
    (<aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>TaskFlow</h1>
      </div>
      <nav className={styles.nav}>
        {logado && <NavLink to='/' className={linkClass}>Dashboard</NavLink>}
        <NavLink to='/sobre' className={linkClass}>Sobre</NavLink>
      </nav>
      {logado && (
        <button className={styles.logout} onClick={logout}>
          Sair
        </button>
      )}
    </aside>)
  );
}
export default Sidebar;