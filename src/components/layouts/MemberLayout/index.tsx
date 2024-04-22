import Sidebar from '@/components/fragments/Sidebar';
import styles from './MemberLayout.module.scss';

type Proptypes = {
  children: React.ReactNode;
};

const sidebarMenus = [
  {
    title: 'Dashboard',
    url: '/member',
    icon: 'bxs-dashboard',
  },
  {
    title: 'Orders',
    url: '/member/orders',
    icon: 'bxs-package',
  },
  {
    title: 'Profile',
    url: '/member/profile',
    icon: 'bxs-user',
  },
];

const MemberLayout = (props: Proptypes) => {
  const { children } = props;
  return (
    <div className={styles.member}>
      <Sidebar menus={sidebarMenus} title="Member Panel" />
      <div className={styles.member__main}>{children}</div>
    </div>
  );
};

export default MemberLayout;
