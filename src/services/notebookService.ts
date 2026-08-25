import {
  addDoc, collection, deleteDoc, doc, getDocs, onSnapshot,
  orderBy, query, setDoc, updateDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Folder, Notebook, Page } from "../types/models";

const now = () => Date.now();

export async function createFolder(uid: string, name: string) {
  const ref = await addDoc(collection(db, "users", uid, "folders"), {
    name, createdAt: now(), updatedAt: now()
  });
  return ref.id;
}

export async function createNotebook(uid: string, title: string, template: Notebook["template"] = "lined") {
  const ref = await addDoc(collection(db, "users", uid, "notebooks"), {
    title, folderId: null, cover: "paper", template, favorite: false,
    pageCount: 1, createdAt: now(), updatedAt: now()
  });
  const pageRef = doc(collection(db, "users", uid, "notebooks", ref.id, "pages"));
  await setDoc(pageRef, {
    pageNumber: 1, template, strokes: [], createdAt: now(), updatedAt: now()
  });
  return ref.id;
}

export async function deleteNotebook(uid: string, notebookId: string) {
  const pages = await getDocs(collection(db, "users", uid, "notebooks", notebookId, "pages"));
  await Promise.all(pages.docs.map((p) => deleteDoc(p.ref)));
  await deleteDoc(doc(db, "users", uid, "notebooks", notebookId));
}

export async function toggleFavorite(uid: string, notebookId: string, favorite: boolean) {
  await updateDoc(doc(db, "users", uid, "notebooks", notebookId), { favorite, updatedAt: now() });
}

export function subscribeNotebooks(uid: string, cb: (items: Notebook[]) => void) {
  const q = query(collection(db, "users", uid, "notebooks"), orderBy("updatedAt", "desc"));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notebook))));
}

export function subscribeFolders(uid: string, cb: (items: Folder[]) => void) {
  const q = query(collection(db, "users", uid, "folders"), orderBy("updatedAt", "desc"));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Folder))));
}

export function subscribePages(uid: string, notebookId: string, cb: (items: Page[]) => void) {
  const q = query(collection(db, "users", uid, "notebooks", notebookId, "pages"), orderBy("pageNumber"));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Page))));
}

export async function savePage(uid: string, notebookId: string, pageId: string, data: Partial<Page>) {
  await updateDoc(doc(db, "users", uid, "notebooks", notebookId, "pages", pageId), {
    ...data, updatedAt: now()
  });
  await updateDoc(doc(db, "users", uid, "notebooks", notebookId), { updatedAt: now() });
}