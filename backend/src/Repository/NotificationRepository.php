<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Notification;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator;

class NotificationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Notification::class);
    }

    public function findOneById(int $id): ?Notification
    {
        return $this->find($id);
    }

    public function findAllPaginated(int $page, int $limit): Paginator
    {
        $query = $this->createQueryBuilder('n')
            ->orderBy('n.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery();

        return new Paginator($query);
    }

    /**
     * @return Notification[]
     */
    public function findUnreadForUser(string $userId, int $limit = 2): array
    {
        return $this->createQueryBuilder('n')
            ->join('n.user', 'u')
            ->andWhere('u.id = :userId')
            ->andWhere('n.isRead = :isRead')
            ->setParameter('userId', $userId)
            ->setParameter('isRead', false)
            ->orderBy('n.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
