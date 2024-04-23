/* eslint-disable @typescript-eslint/no-explicit-any */
import MemberLayout from '@/components/layouts/MemberLayout';
import styles from './Profile.module.scss';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import userServices from '@/services/user';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { uploadFile } from '@/lib/firebase/service';

type PropTypes = {
  profile: {
    image: string;
    phone: string;
    email: string;
    fullname: string;
    role: string;
    password: string;
  };
  setProfile: Dispatch<
    SetStateAction<{
      image: string;
      phone: string;
      email: string;
      fullname: string;
      role: string;
      password: string;
    }>
  >;
};
const MemberProfileView = (props: PropTypes) => {
  const { profile, setProfile } = props;
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session: any = useSession();
  const [possibleNewImageName, setPossibleNewImageName] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUploadImage = async (event: any) => {
    setIsUploadingImage(true);
    event.preventDefault();
    const file = event.target[0].files[0];
    if (file) {
      const newName = 'profile.' + file.name.split('.')[1];
      const newPath = `images/users/${session.data?.user.id}/${newName}`;
      uploadFile(newPath, file, (isComplete, downloadURL) => {
        if (isComplete && downloadURL) {
          setIsUploadingImage(false);
          setPossibleNewImageName('');
          event.target[0].value = '';
          updateUserImage(downloadURL);
        }
      });
    }
  };

  const updateUserImage = async (imageURL: string) => {
    const data = {
      image: imageURL,
    };
    const result = await userServices.updateUserImage(session.data?.accessToken, session.data?.user.id, data);
    if (result.status === 200) {
      setProfile({
        ...profile,
        image: imageURL,
      });
    }
  };

  const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form: any = event.target as HTMLFormElement;
    const data = {
      fullname: form.fullname.value,
      phone: form.phone.value,
    };

    const result = await userServices.updateUserProfile(session.data?.accessToken, session.data?.user.id, data);

    if (result.status === 200) {
      setIsLoading(false);
      setProfile({
        ...profile,
        fullname: data.fullname,
        phone: data.phone,
      });
      form.reset();
    } else {
      setIsLoading(false);
      console.log(result);
    }
  };

  const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdatingPassword(true);
    const form: any = event.target as HTMLFormElement;
    const data = {
      password: form['new-password'].value,
      oldPassword: form['old-password'].value,
      lastPassword: profile.password,
    };
    console.log(data);
    const result = await userServices.updateUserPassword(session.data?.accessToken, session.data?.user.id, data);
    if (result.status === 200) {
      setIsUpdatingPassword(false);
      form.reset();
    }
  };

  return (
    <MemberLayout>
      <h1 className={styles.profile__title}>{`${profile.fullname}'s `}Profile</h1>
      <div className={styles.profile__main}>
        <div className={styles.profile__main__row}>
          <div className={styles.profile__main__row__avatar}>
            <h2 className={styles.profile__main__row__avatar__title}>Avatar</h2>
            {profile.image ? (
              <Image
                className={styles.profile__main__row__avatar__image}
                src={profile.image}
                alt="member-avatar"
                width={200}
                height={200}
              />
            ) : (
              <div className={styles.profile__main__row__avatar__image}>{profile?.fullname?.charAt(0)}</div>
            )}

            <form onSubmit={handleUploadImage}>
              {!possibleNewImageName && (
                <label className={styles.profile__main__row__avatar__label} htmlFor="upload-image">
                  <p>Click here to upload a new avatar. Large image will be resized.</p>
                  <p>
                    Maximum upload size is <b>1 MB</b>
                  </p>
                </label>
              )}
              <input
                className={styles.profile__main__row__avatar__input}
                type="file"
                name="image"
                id="upload-image"
                onChange={(e: any) => {
                  e.preventDefault();
                  setPossibleNewImageName(e.currentTarget.files[0].name);
                }}
              />
              {!isUploadingImage && possibleNewImageName && (
                <div className={styles.profile__main__row__avatar__new_image_label}>
                  <p>New image selected</p>
                  <p className={styles.profile__main__row__avatar__new_image_label__name}>{possibleNewImageName}</p>
                </div>
              )}
              {isUploadingImage && (
                <p className={styles.profile__main__row__avatar__new_image_label}>Uploading image...</p>
              )}
              {possibleNewImageName && !isUploadingImage && (
                <div className={styles.profile__main__row__avatar__button_container}>
                  <Button className={styles.profile__main__row__avatar__button_container__button} type="submit">
                    Upload New Image
                  </Button>
                  <Button
                    className={styles.profile__main__row__avatar__button_container__button}
                    type="button"
                    variant="secondary"
                    onClick={() => setPossibleNewImageName('')}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </div>
          <div className={styles.profile__main__row__profile}>
            <h2 className={styles.profile__main__row__profile__title}>Profile</h2>
            <form onSubmit={handleUpdateUser}>
              <Input label="Fullname" name="fullname" type="text" defaultValue={profile.fullname} />
              <Input label="Phone" name="phone" type="number" defaultValue={profile.phone} />
              <Input label="Email" name="email" type="email" defaultValue={profile.email} disabled />
              <Input label="Role" name="role" type="text" defaultValue={profile.role} disabled />
              <Button type="submit" variant="primary">
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </div>
          <div className={styles.profile__main__row__password}>
            <h2 className={styles.profile__main__row__password__title}>Change Password</h2>
            <form onSubmit={handleUpdatePassword}>
              <Input name="old-password" label="Old Password" type="password"></Input>
              <Input name="new-password" label="New Password" type="password"></Input>
              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default MemberProfileView;
