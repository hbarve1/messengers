// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import React from 'react';

import VideoPlayer from './VideoPlayer';
import Sidebar from './Sidebar';
import Notifications from './Notifications';

export function App() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Video Chat</h1>
      </div>
      <VideoPlayer />
      <Sidebar>
        <Notifications />
      </Sidebar>
    </div>
  );
}

export default App;
