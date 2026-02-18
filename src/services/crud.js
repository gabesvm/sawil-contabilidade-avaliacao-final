import { ref, push, set, update, remove, onValue } from "firebase/database";
import * as FirebaseConfig from "../config/firebase";

/*
  Pegando o DB de forma "à prova de erro".
  (Alguns projetos exportam como db, outros como database, outros como realtimeDb, etc.)
*/
const db =
  FirebaseConfig.db ||
  FirebaseConfig.database ||
  FirebaseConfig.realtimeDb ||
  FirebaseConfig.firebaseDb ||
  FirebaseConfig.default?.db ||
  FirebaseConfig.default?.database;

function ensureDb() {
  if (!db) {
    throw new Error(
      "Realtime Database não encontrado no arquivo src/config/firebase.js. Garanta que ele exporta o DB (ex: export const db = getDatabase(app))."
    );
  }
}

export async function createItem(path, data) {
  ensureDb();

  const listRef = ref(db, path);
  const newRef = push(listRef);

  await set(newRef, {
    ...data,
    createdAt: Date.now(),
  });

  return newRef.key;
}

export async function updateItem(path, id, data) {
  ensureDb();

  const itemRef = ref(db, `${path}/${id}`);
  await update(itemRef, {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deleteItem(path, id) {
  ensureDb();

  const itemRef = ref(db, `${path}/${id}`);
  await remove(itemRef);
}

/*
  Listener seguro:
  - onValue() já retorna a função de "unsubscribe"
  - sem off(), sem bug no Web
*/
export function listenItems(path, callback) {
  ensureDb();

  const listRef = ref(db, path);

  const unsubscribe = onValue(listRef, (snap) => {
    const val = snap.val();

    if (!val) {
      callback([]);
      return;
    }

    const arr = Object.keys(val).map((key) => ({
      id: key,
      ...val[key],
    }));

    arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    callback(arr);
  });

  return unsubscribe;
}