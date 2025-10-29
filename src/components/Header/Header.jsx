// src/components/Header/Header.jsx
import styles from './Header.module.css';

function Header({ userData }) {
  // 데이터가 없을 경우 대비
  const name = userData?.user_name || userData?.userName || '사용자';
  const date = userData?.test_date || userData?.testDate || '-';

  return (
    <div className={styles.header}>
      <span className={styles.userName}>{name}님 측정 이력 조회</span>
      <span className={styles.testDate}>측정일 : {date}</span>
    </div>
  );
}

export default Header;