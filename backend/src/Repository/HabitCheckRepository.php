<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Habit;
use App\Entity\HabitCheck;
use DateTimeImmutable;
use DateTimeZone;
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

    public function countChecksForCurrentPeriod(Habit $habit): int
    {
        $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));

        switch ($habit->getPeriodType()) {
            case 'daily':
                $start = $now->setTime(0, 0);
                break;

            case 'weekly':
                $start = $now->modify('monday this week')->setTime(0, 0);
                break;

            case 'monthly':
                $start = $now->modify('first day of this month')->setTime(0, 0);
                break;

            default:
                $days = $habit->getPeriodLength() ?? 1;
                $start = $now->modify("-{$days} days")->setTime(0, 0);
        }

        return (int) $this->createQueryBuilder('hc')
            ->select('COUNT(hc.id)')
            ->andWhere('hc.habit = :habit')
            ->andWhere('hc.entryDate >= :start')
            ->setParameter('habit', $habit)
            ->setParameter('start', $start->format('Y-m-d'))
            ->getQuery()
            ->getSingleScalarResult();
    }
}
