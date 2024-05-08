import MemberProfileView from '@/components/views/member/Profile';
import userServices from '@/services/user';
import { User } from '@/types/user.type';

import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type PropTypes = {
  setToaster: Dispatch<
    SetStateAction<{
      variant: string;
      message: string;
    }>
  >;
};

const MemberProfilePage = ({ setToaster }: PropTypes) => {
  const [profile, setProfile] = useState<User | null>(null);
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
      <MemberProfileView profile={profile} setProfile={setProfile} setToaster={setToaster} />
    </>
  );
};

export default MemberProfilePage;
