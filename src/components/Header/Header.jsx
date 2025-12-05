import styles from './Header.module.css';

function Header({ userData }) {
  const name = userData?.user_name || '사용자';
  const date = userData?.measure_date || '-';
  return (
    <div className={styles.header}>
      <span className={styles.userName}>{name}님 측정 이력 조회</span>
      <span className={styles.testDate}>측정일 : {date}</span>
    </div>
  );
}

export default Header;