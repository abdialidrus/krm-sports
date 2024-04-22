import MemberProfileView from '@/components/views/member/Profile';
import userServices from '@/services/user';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const MemberProfilePage = () => {
  const [profile, setProfile] = useState({
    image: '',
    phone: '',
    email: '',
    fullname: '',
    role: '',
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session: any = useSession();

  useEffect(() => {
    const getUser = async () => {
      if (session.data === null) return;
      if (session.data === undefined) return;

      const { data } = await userServices.getProfile(session.data?.accessToken, session.data?.user?.id);
      setProfile(data.data);
    };

    getUser();
  }, [session]);
  return (
    <>
      <MemberProfileView profile={profile} />
    </>
  );
};

export default MemberProfilePage;
