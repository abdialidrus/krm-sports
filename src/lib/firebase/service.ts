/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import app from './init';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

const firestore = getFirestore(app);

const storage = getStorage(app);

export async function retrieveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

export async function retrieveDataById(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  const data = snapshot.data();
  return data;
}

export async function retrieveDataByField(collectionName: string, field: string, value: string) {
  const q = query(collection(firestore, collectionName), where(field, '==', value));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

export async function addData(collectionName: string, data: any, callback: (status: boolean, result?: any) => void) {
  await addDoc(collection(firestore, collectionName), data)
    .then((res) => {
      callback(true, res);
    })
    .catch(() => {
      callback(false);
    });
}

export async function updateData(
  collectionName: string,
  id: string,
  data: { role: string },
  callback: (result: boolean) => void
) {
  const docRef = doc(firestore, collectionName, id);
  await updateDoc(docRef, data)
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
}

export async function deleteData(collectionName: string, id: any, callback: (result: boolean) => void) {
  const docRef = doc(firestore, collectionName, id);
  await deleteDoc(docRef)
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
}

export async function uploadFile(
  fileName: string,
  file: any,
  callback: (isComplete: boolean, result?: string) => void
) {
  if (file) {
    if (file.size < 1048576) {
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        () => {
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          callback(false);
        },
        () => {
          callback(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: any) => {
            callback(true, downloadURL);
          });
        }
      );
    } else {
      callback(false, 'File is too large');
    }
  } else {
    callback(false, 'File is empty');
  }
}
