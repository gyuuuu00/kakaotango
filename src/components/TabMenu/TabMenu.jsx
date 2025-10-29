import styles from "./TabMenu.module.css";

export default function TabMenu({ activeTab, onTabChange }) {
  const tabs = ["종합보기", "정면측정", "측면측정", "후면측정", "동적측정", "추천운동"];

  return (
    <div className={styles.tabMenu}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tabButton} ${activeTab === tab ? styles.active : ""}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}