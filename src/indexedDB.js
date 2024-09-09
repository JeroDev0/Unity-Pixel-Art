import { openDB } from 'idb';

const DB_NAME = 'pixelArtApp';
const STORE_NAME = 'projects';

async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function saveProject(project) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.put(project);
  await tx.done;
}

export async function getAllProjects() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const projects = await tx.store.getAll();
  return projects;
}

export async function getProject(id) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const project = await tx.store.get(id);
  return project;
}

export async function deleteProject(id) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
}
