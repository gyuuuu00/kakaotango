import styles from './Header.module.css';

function Header({ userData }) {
  return (
    <div className={styles.header}>
        <span className={styles.userName}>{userData.userName}님 측정 이력 조회</span>  
        <span className={styles.testDate}>측정일 : {userData.testDate}</span> 
    </div>
  );
}

export default Header;