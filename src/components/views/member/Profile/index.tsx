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
import Loader from '@/components/ui/Loader';
import { User } from '@/types/user.type';

type PropTypes = {
  profile: User | null;
  setProfile: Dispatch<SetStateAction<User | null>>;
  setToaster: Dispatch<
    SetStateAction<{
      variant: string;
      message: string;
    }>
  >;
};
const MemberProfileView = (props: PropTypes) => {
  const { profile, setProfile, setToaster } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session: any = useSession();
  const [possibleNewImageName, setPossibleNewImageName] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [newPasswordError, setNewPasswordError] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [fullNameFieldError, setFullNameFieldError] = useState('');

  const handleUploadImage = async (event: any) => {
    setIsUploadingImage(true);
    event.preventDefault();
    const file = event.target[0].files[0];
    if (file) {
      const newName = 'profile.' + file.name.split('.')[1];
      const newPath = `images/users/${session.data?.user.id}/${newName}`;
      uploadFile(newPath, file, (isComplete, result) => {
        if (isComplete && result) {
          setIsUploadingImage(false);
          setPossibleNewImageName('');
          event.target[0].value = '';
          updateUserImage(result);
        } else if (!isComplete && result) {
          setIsUploadingImage(false);
          setPossibleNewImageName('');
          event.target[0].value = '';
          setToaster({
            variant: 'danger',
            message: result,
          });
        }
      });
    }
  };

  const updateUserImage = async (imageURL: string) => {
    if (!profile) {
      return;
    }

    const data = {
      image: imageURL,
    };
    const result = await userServices.updateUserImage(session.data?.accessToken, session.data?.user.id, data);
    if (result.status === 200) {
      setProfile({
        ...profile,
        image: imageURL,
      });
      setToaster({
        variant: 'success',
        message: 'Avatar updated successfully.',
      });
    } else {
      setToaster({
        variant: 'success',
        message: 'There was a problem when updating image. Please try again later.',
      });
    }
  };

  const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form: any = event.target as HTMLFormElement;
    const fullname = form.fullname.value;
    const phone = form.phone.value;

    setFullNameFieldError('');

    if (!fullname) {
      setFullNameFieldError('Fullname is required');
      return;
    }

    setIsUpdatingProfile(true);

    const data = {
      fullname: fullname,
      phone: phone,
    };

    setFullNameFieldError('');
    const result = await userServices.updateUserProfile(session.data?.accessToken, session.data?.user.id, data);

    if (result.status === 200) {
      setIsUpdatingProfile(false);
      if (!profile) {
        return;
      }
      setProfile({
        ...profile,
        fullname: data.fullname,
        phone: data.phone,
      });
      form.reset();
      setToaster({
        variant: 'success',
        message: 'Profile updated successfully.',
      });
    } else {
      setIsUpdatingProfile(false);
      setToaster({
        variant: 'danger',
        message: 'Failed to update profile. Check all the details and try again.',
      });
    }
  };

  const validatePasswordFields = (oldPassword: string, newPassword: string) => {
    let isValid = true;
    if (!oldPassword) {
      setOldPasswordError('Old passwords is required');
      isValid = false;
    }

    if (!newPassword) {
      setNewPasswordError('New passwords is required');
      isValid = false;
    }

    return isValid;
  };

  const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form: any = event.target as HTMLFormElement;
    const password = form['new-password'].value;
    const oldPassword = form['old-password'].value;

    setNewPasswordError('');
    setOldPasswordError('');

    const isValid = validatePasswordFields(oldPassword, password);
    if (!isValid) {
      return;
    }

    setNewPasswordError('');
    setOldPasswordError('');
    setIsUpdatingPassword(true);

    const data = {
      password: password,
      oldPassword: oldPassword,
      lastPassword: profile?.password,
    };
    const result = await userServices.updateUserPassword(session.data?.accessToken, session.data?.user.id, data);
    if (result.status === 200) {
      setIsUpdatingPassword(false);
      form.reset();
      setToaster({
        variant: 'success',
        message: 'Password updated successfully.',
      });
    } else {
      setIsUpdatingPassword(false);
      form.reset();
      setToaster({
        variant: 'danger',
        message: 'Failed to update password. Please try again later.',
      });
    }
  };

  return (
    <MemberLayout>
      <h1 className={styles.profile__title}>{`${profile?.fullname}'s `}Profile</h1>
      <div className={styles.profile__main}>
        <div className={styles.profile__main__row}>
          <div className={styles.profile__main__row__avatar}>
            <h2 className={styles.profile__main__row__avatar__title}>Avatar</h2>
            {profile?.image ? (
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
              {isUploadingImage && <Loader />}
            </form>
          </div>
          <div className={styles.profile__main__row__profile}>
            <h2 className={styles.profile__main__row__profile__title}>Profile</h2>
            <form onSubmit={handleUpdateUser}>
              <Input
                label="Fullname"
                name="fullname"
                type="text"
                defaultValue={profile?.fullname}
                error={fullNameFieldError}
              />
              <Input
                label="Phone"
                name="phone"
                type="number"
                defaultValue={profile?.phone}
                placeholder="Input your phone number"
              />
              <Input label="Email" name="email" type="email" defaultValue={profile?.email} disabled error="" />
              <Input label="Role" name="role" type="text" defaultValue={profile?.role} disabled error="" />

              {!isUpdatingProfile && (
                <Button type="submit" variant="primary">
                  Update Profile
                </Button>
              )}
              {isUpdatingProfile && <Loader />}
            </form>
          </div>
          <div className={styles.profile__main__row__password}>
            <h2 className={styles.profile__main__row__password__title}>Change Password</h2>
            <form onSubmit={handleUpdatePassword}>
              <Input
                name="old-password"
                label="Old Password"
                type="password"
                error={oldPasswordError}
                disabled={profile?.type === 'google'}
                placeholder="Input your current password"
              ></Input>
              <Input
                name="new-password"
                label="New Password"
                type="password"
                error={newPasswordError}
                disabled={profile?.type === 'google'}
                placeholder="Input your new password"
              ></Input>

              {!isUpdatingPassword && (
                <Button type="submit" disabled={isUpdatingPassword || profile?.type === 'google'}>
                  Update Password
                </Button>
              )}
              {isUpdatingPassword && <Loader />}
            </form>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default MemberProfileView;
