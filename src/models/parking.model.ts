import { prisma, PrismaError } from "@/config/db";
import type { PrismaClientError } from "@/config/db.js";
import type { ParkingSpot } from "@prisma/client";

class parkingstore {
  async index() {
    try {
      const park = await prisma.parkingSpot.findMany();
      return park;
    } catch (err) {
      throw new PrismaError(err as PrismaClientError);
    }
  }

  async show(id: string) {
    try {
      return await prisma.parkingSpot.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (err) {
      throw new PrismaError(err as PrismaClientError);
    }
  }

  async create(location: string) {
    try {
      return await prisma.parkingSpot.create({data:{
        location
      }});
    } catch (err) {
      throw new PrismaError(err as PrismaClientError);
    }
  }

  async update(spotId: string, isEmpty: boolean) {
    try {
      return await prisma.parkingSpot.update({
        where: {
          id: spotId,
        },
        data: {
          isEmpty
        }
      });
    } catch (err) {
      throw new PrismaError(err as PrismaClientError);
    }
  }

  async delete(id: string) {
    try {
      return await prisma.parkingSpot.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      	throw new PrismaError(err as PrismaClientError);
      }
    }
    
    async countEmpty() {
    try {
      return await prisma.parkingSpot.count({
        where: {
          isEmpty: true
        }
      })
    } catch (err) {
      throw new PrismaError(err as PrismaClientError);

    }
  }
}
export default new parkingstore();
