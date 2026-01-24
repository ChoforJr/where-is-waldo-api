// import {
//   userIsAdmin,
//   updateFolder,
//   updateFileFolder,
// } from "../prisma_queries/update.js";
// import { matchedData } from "express-validator";

// export async function editFolder(req, res, next) {
//   try {
//     const { title } = matchedData(req);
//     const folderID = Number(req.params.id);
//     await updateFolder(folderID, title);
//     res.redirect("/");
//   } catch (err) {
//     return next(err);
//   }
// }

// export async function editFileFolder(req, res, next) {
//   try {
//     const { folder } = matchedData(req);
//     const folderID = Number(folder);
//     const fileID = Number(req.params.id);
//     await updateFileFolder(fileID, folderID);
//     res.redirect("/");
//   } catch (err) {
//     return next(err);
//   }
// }

// export async function userBecomeAdmin(req, res) {
//   await userIsAdmin(req.user.id);
//   res.redirect("/");
// }
