// 'use server'
// import { prisma } from "@/lib/prisma";

// export const addCategory = async (nombre: string) => {
//     try {
//       const newCategory = await prisma.categoria.create({
//         data: {
//           nombre,
//         },
//       });
//       console.log("Categoría agregada:", newCategory);
//       return newCategory;
//     } catch (error) {
//       console.error("Error al agregar la categoría:", error);
//       throw error;
//     } finally {
//       await prisma.$disconnect();
//     }
//   };
  