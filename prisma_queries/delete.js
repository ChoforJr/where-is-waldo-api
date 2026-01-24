import prisma from "../config/prisma.js";

// export async function delFolder(id) {
//   await prisma.folders.delete({
//     where: {
//       id: id,
//     },
//   });
// }

// export async function delFile(id) {
//   await prisma.files.delete({
//     where: {
//       id: id,
//     },
//   });
// }

// export async function deleteAllUsers() {
//   await prisma.user.deleteMany({});
// }

export async function deleteUserByID(userID) {
  await prisma.user.delete({
    where: {
      id: userID,
    },
  });
}
