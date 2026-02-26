import './globals.css';

import { ConfigProvider, App as AntApp } from 'antd';
import AntdRegistry from '@/lib/AntdRegistry';
import { LogProvider } from '@/context/LogContext';
import OriginLogger from '@/components/OriginLogger';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = {
    token: {
      colorPrimary: '#845EC2',
      colorInfo: '#D65DB1',
      colorSuccess: '#F9F871',
      colorWarning: '#FFC75F',
      colorError: '#FF9671',
      colorBgBase: '#FFFFFF',
      borderRadius: 12,
    },
  };

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={theme}>
            <AntApp>
              <LogProvider>{children}
                <OriginLogger />
              </LogProvider>
            </AntApp>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
