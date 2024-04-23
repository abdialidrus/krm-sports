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
  };
  setProfile: Dispatch<
    SetStateAction<{
      image: string;
      phone: string;
      email: string;
      fullname: string;
      role: string;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form: any = event.target as HTMLFormElement;
    const data = {
      fullname: form.fullname.value,
      email: form.email.value,
      phone: form.phone.value,
    };

    const result = await userServices.updateUserProfile(session.data?.accessToken, session.data?.user.id, data);

    if (result.status === 200) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <MemberLayout>
      <h1 className={styles.profile__title}>{`${profile.fullname}'s `}Profile</h1>
      <div className={styles.profile__main}>
        <div className={styles.profile__main__avatar}>
          {profile.image ? (
            <Image
              className={styles.profile__main__avatar__image}
              src={profile.image}
              alt="member-avatar"
              width={200}
              height={200}
            />
          ) : (
            <div className={styles.profile__main__avatar__image}>{profile?.fullname?.charAt(0)}</div>
          )}

          <form onSubmit={handleUploadImage}>
            {!possibleNewImageName && (
              <label className={styles.profile__main__avatar__label} htmlFor="upload-image">
                <p>Click here to upload a new avatar. Large image will be resized.</p>
                <p>
                  Maximum upload size is <b>1 MB</b>
                </p>
              </label>
            )}
            <input
              className={styles.profile__main__avatar__input}
              type="file"
              name="image"
              id="upload-image"
              onChange={(e: any) => {
                e.preventDefault();
                setPossibleNewImageName(e.currentTarget.files[0].name);
              }}
            />
            {!isUploadingImage && possibleNewImageName && (
              <div className={styles.profile__main__avatar__new_image_label}>
                <p>New image selected</p>
                <p className={styles.profile__main__avatar__new_image_label__name}>{possibleNewImageName}</p>
              </div>
            )}
            {isUploadingImage && <p className={styles.profile__main__avatar__new_image_label}>Uploading image...</p>}
            {possibleNewImageName && !isUploadingImage && (
              <div className={styles.profile__main__avatar__button_container}>
                <Button className={styles.profile__main__avatar__button_container__button} type="submit">
                  Upload New Image
                </Button>
                <Button
                  className={styles.profile__main__avatar__button_container__button}
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
