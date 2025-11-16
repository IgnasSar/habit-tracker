<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\HabitCheck;
use DateTimeImmutable;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

class HabitCheckRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HabitCheck::class);
    }

    public function findHabitCheckByHabitAndDate(int $habitId, Uuid $userId, DateTimeImmutable $date): ?HabitCheck
    {
        return $this->createQueryBuilder('hc')
            ->innerJoin('hc.habit', 'h')
            ->andWhere('h.id = :habitId')
            ->andWhere('h.user = :userId')
            ->andWhere('hc.entryDate = :date')
            ->setParameter('habitId', $habitId)
            ->setParameter('userId', $userId)
            ->setParameter('date', $date->format('Y-m-d'))
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @return HabitCheck[]
     */
    public function findChecksByHabitAndDateRange(int $habitId, ?string $fromDate, ?string $toDate): array
    {
        $queryBuilder = $this->createQueryBuilder('hc')
            ->andWhere('hc.habit = :habitId')
            ->setParameter('habitId', $habitId)
            ->orderBy('hc.entryDate', 'ASC');

        if ($fromDate !== null) {
            $queryBuilder->andWhere('hc.entryDate >= :fromDate')
                ->setParameter('fromDate', $fromDate);
        }

        if ($toDate !== null) {
            $queryBuilder->andWhere('hc.entryDate <= :toDate')
                ->setParameter('toDate', $toDate);
        }

        return $queryBuilder->getQuery()->getResult();
    }
}
