<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Habit;
use App\Entity\HabitCheck;
use App\Entity\User;
use App\Enum\PeriodType;
use DateTimeImmutable;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;

class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function findPendingHabitsExtended(): array
    {
        $daily = $this->findPendingByPeriod(
            PeriodType::Daily,
            new DateTimeImmutable('today midnight'),
            new DateTimeImmutable('tomorrow midnight')
        );

        $weekly = $this->findPendingByPeriod(
            PeriodType::Weekly,
            new DateTimeImmutable('monday this week midnight'),
            new DateTimeImmutable('monday next week midnight')
        );

        $monthly = $this->findPendingByPeriod(
            PeriodType::Monthly,
            new DateTimeImmutable('first day of this month midnight'),
            new DateTimeImmutable('first day of next month midnight')
        );

        return array_merge($daily, $weekly, $monthly);
    }

    public function findLastCompletions(array $habitIds): array
    {
        if (empty($habitIds)) {
            return [];
        }

        $qb = $this->getEntityManager()->createQueryBuilder();
        $results = $qb->select('IDENTITY(hc.habit) as habit_id', 'MAX(hc.entryDate) as last_date')
            ->from(HabitCheck::class, 'hc')
            ->where('hc.habit IN (:ids)')
            ->groupBy('hc.habit')
            ->setParameter('ids', $habitIds)
            ->getQuery()
            ->getScalarResult();

        $map = [];
        foreach ($results as $row) {
            $map[$row['habit_id']] = $row['last_date'];
        }
        return $map;
    }

    private function findPendingByPeriod(PeriodType $type, DateTimeImmutable $start, DateTimeImmutable $end): array
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        return $qb->select(
            'u.id as user_id',
            'u.email',
            'h.id as habit_id',
            'h.name as habit_name',
            'h.createdAt as created_at'
        )
            ->from(Habit::class, 'h')
            ->join('h.user', 'u')
            ->leftJoin(
                HabitCheck::class,
                'hc',
                Join::WITH,
                'hc.habit = h.id AND hc.entryDate >= :start AND hc.entryDate < :end'
            )
            ->where('h.periodType = :type')
            ->andWhere('hc.id IS NULL')
            ->setParameter('start', $start)
            ->setParameter('end', $end)
            ->setParameter('type', $type->value)
            ->getQuery()
            ->getScalarResult();
    }
}
