import MemberLayout from '@/components/layouts/MemberLayout';
import styles from './Profile.module.scss';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FormEvent, useState } from 'react';
import userServices from '@/services/user';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

type PropTypes = {
  profile: {
    image: string;
    phone: string;
    email: string;
    fullname: string;
    role: string;
  };
};
const MemberProfileView = (props: PropTypes) => {
  const { profile } = props;
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session: any = useSession();

  const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form: any = event.target as HTMLFormElement;
    const data = {
      fullname: form.fullname.value,
      email: form.email.value,
      phone: form.phone.value,
    };

    const result = await userServices.updateUserProfile(session.data?.accessToken, session.data?.id, data);

    if (result.status === 200) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <MemberLayout>
      <h1 className={styles.profile__title}>{profile.fullname} Profile</h1>
      <div className={styles.profile__main}>
        <div className={styles.profile__main__avatar}>
          <Image src={profile.image} alt="member-avatar" width={200} height={200} />
          <label className={styles.profile__main__avatar__label} htmlFor="upload-image">
            <p>Upload a new avatar. Large image will be resized.</p>
            <p>
              Maximum upload size is <b>1 MB</b>
            </p>
          </label>
          <input className={styles.profile__main__avatar__input} type="file" name="image" id="upload-image" />
        </div>
        <div className={styles.profile__main__detail}>
          <form onSubmit={handleUpdateUser}>
            <Input label="Fullname" name="fullname" type="text" defaultValue={profile.fullname} />
            <Input label="Email" name="email" type="email" defaultValue={profile.email} />
            <Input label="Phone" name="phone" type="text" defaultValue={profile.phone} />
            <Button type="submit" variant="primary">
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </div>
      </div>
    </MemberLayout>
  );
};

export default MemberProfileView;
