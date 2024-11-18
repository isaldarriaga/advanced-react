import {CheapTimer} from '@app/components/CheapTimer/CheapTimer';
import {getFutureISODate, isDateInTheFuture} from '@app/components/CheapTimer/utils';
import styles from '../styles/Home.module.css';

export default function Home() {
  const beginDate = getFutureISODate({days: 8, hours: 10, minutes: 30, seconds: 59});
  return (
    <div className={styles.container}>
      {isDateInTheFuture(beginDate) && <CheapTimer beginDate={beginDate}/>}
    </div>
  );
}
