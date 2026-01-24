import prisma from "../config/prisma.js";

export async function getUsers() {
  const users = await prisma.user.findMany({
    // include: {
    //   files: true,
    //   folders: true,
    // },
  });
  return users;
}

export async function getUserInfoByUsername(username) {
  const user = await prisma.user.findUnique({
    where: { username: username },
  });
  return user;
}

export async function getUserInfoByID(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    // include: {
    //   files: true,
    //   folders: true,
    // },
  });
  return user;
}

// export async function getFilesByUserID(userID) {
//   const files = await prisma.files.findMany({
//     where: {
//       authorId: userID,
//     },
//     include: {
//       folders: true,
//     },
//   });
//   return files;
// }

// export async function getFoldersByID(folderID) {
//   const folders = await prisma.folders.findUnique({
//     where: {
//       id: folderID,
//     },
//     include: {
//       files: true,
//     },
//   });
//   return folders;
// }

// export async function getFilesByFolderID(folderID) {
//   const files = await prisma.files.findMany({
//     where: {
//       foldersId: folderID,
//     },
//     include: {
//       folders: true,
//     },
//   });
//   return files;
// }

// export async function getFoldersByUserID(userID) {
//   const folders = await prisma.folders.findMany({
//     where: {
//       authorId: userID,
//     },
//   });
//   return folders;
// }

// export async function getFileByID(fileID) {
//   const file = await prisma.files.findUnique({
//     where: {
//       id: fileID,
//     },
//   });
//   return file;
// }

// export async function getAllFiles() {
//   const files = await prisma.files.findMany();
//   return files;
// }
