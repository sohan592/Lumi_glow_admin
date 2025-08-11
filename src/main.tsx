import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { antTheme } from './config/antd';
import AppRoutes from './routes/router.tsx';
import './styles/index.scss';
import './styles/tailwind.css';
import { store } from './modules/appstore/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={antTheme}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
);
