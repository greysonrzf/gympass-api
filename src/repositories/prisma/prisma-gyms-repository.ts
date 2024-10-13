import {
  GymsRepository,
  type FindManyNearbyParams,
} from '@/repositories/gyms-repository'
import { prisma } from '@/lib/prisma'
import type { Prisma, Gym } from '@prisma/client'

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) <= 10
    `

    return gyms
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({ where: { id } })

    return gym
  }
}
