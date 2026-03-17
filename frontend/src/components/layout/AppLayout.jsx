import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import PageContainer from './PageContainer.jsx';

function AppLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
    </div>
  );
}

export default AppLayout;
